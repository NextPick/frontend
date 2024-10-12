import React, { useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

const WebRTC = () => {
    const localStreamElement = useRef(null);
    const [myKey] = useState(Math.random().toString(36).substring(2, 11));
    let pcListMap = new Map(); // 피어 연결 저장
    let roomId;
    let otherKeyList = [];
    let localStream = undefined;
    let stompClient;
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);
    const occupation = "BE";

    const startCam = async () => {
        if (navigator.mediaDevices !== undefined) {
            await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
                .then(async (stream) => {
                    console.log('Stream found');
                    localStream = stream;
                    stream.getAudioTracks()[0].enabled = true;
                    if (localStreamElement.current) {
                        localStreamElement.current.srcObject = localStream;
                    }
                }).catch(error => {
                    console.error("Error accessing media devices:", error);
                });
        }
    };

    const toggleMute = () => {
        if (localStream) {
            localStream.getAudioTracks()[0].enabled = !isMuted;
            setIsMuted(prev => !prev);
        }
    };

    const toggleVideo = () => {
        if (localStream) {
            localStream.getVideoTracks()[0].enabled = !isVideoEnabled;
            setIsVideoEnabled(prev => !prev);
        }
    };

    const connectSocket = async () => {
        const socket = new SockJS('https://localhost:8443/signaling');
        stompClient = Stomp.over(socket);
        stompClient.debug = null;

        stompClient.connect(
            {
                camKey: myKey,
                occupation: occupation,
                email: "123456@123.com",
            }, function () {
                console.log('Connected to WebRTC server');
                console.log(myKey);

                // 방 ID 구독
                stompClient.subscribe(`/topic/roomId/${myKey}`, (message) => {
                    roomId = message.body; // 룸 ID 저장
                    console.log(roomId);
                });

                // ICE 후보 구독
                stompClient.subscribe(`/topic/peer/iceCandidate/${myKey}/${roomId}`, candidate => {
                    const key = JSON.parse(candidate.body).key;
                    const message = JSON.parse(candidate.body).body;

                    const pc = pcListMap.get(key);
                    if (pc) {
                        pc.addIceCandidate(new RTCIceCandidate({
                            candidate: message.candidate,
                            sdpMLineIndex: message.sdpMLineIndex,
                            sdpMid: message.sdpMid
                        }));
                    }
                });

                // Offer 구독
                stompClient.subscribe(`/topic/peer/offer/${myKey}/${roomId}`, offer => {
                    const key = JSON.parse(offer.body).key;
                    const message = JSON.parse(offer.body).body;

                    // 이미 피어 연결이 존재하는지 확인
                    if (!pcListMap.has(key)) {
                        const pc = createPeerConnection(key);
                        pcListMap.set(key, pc);
                        pc.setRemoteDescription(new RTCSessionDescription({
                            type: message.type,
                            sdp: message.sdp
                        }));
                        sendAnswer(pc, key);
                    } else {
                        const pc = pcListMap.get(key);
                        pc.setRemoteDescription(new RTCSessionDescription({
                            type: message.type,
                            sdp: message.sdp
                        }));
                    }
                });

                // Answer 구독
                stompClient.subscribe(`/topic/peer/answer/${myKey}/${roomId}`, answer => {
                    const key = JSON.parse(answer.body).key;
                    const message = JSON.parse(answer.body).body;

                    const pc = pcListMap.get(key);
                    if (pc) {
                        pc.setRemoteDescription(new RTCSessionDescription(message));
                    }
                });

                stompClient.subscribe(`/topic/call/key`, () => {
                    stompClient.send(`/app/send/key`, {}, JSON.stringify(myKey));
                });

                stompClient.subscribe(`/topic/send/key`, message => {
                    const key = JSON.parse(message.body);

                    if (myKey !== key && !otherKeyList.includes(key)) {
                        otherKeyList.push(key);
                    }
                });

                // 연결이 완료된 후 바로 스트림 시작
                handleStartStream();
            },
            (error) => {
                console.error('Connection error: ', error);
            }
        );
    };

    const createPeerConnection = (otherKey) => {
        const pc = new RTCPeerConnection();
        try {
            pc.addEventListener('icecandidate', (event) => {
                onIceCandidate(event, otherKey);
            });
            pc.addEventListener('track', (event) => {
                onTrack(event, otherKey);
            });
            if (localStream) {
                localStream.getTracks().forEach(track => {
                    pc.addTrack(track, localStream);
                });
            }
            console.log('PeerConnection created');
        } catch (error) {
            console.error('PeerConnection failed: ', error);
        }
        return pc;
    };

    const onIceCandidate = (event, otherKey) => {
        if (event.candidate) {
            stompClient.send(`/app/peer/iceCandidate/${otherKey}/${roomId}`, {}, JSON.stringify({
                key: myKey,
                body: event.candidate
            }));
        }
    };

    const sendOffer = (pc, otherKey) => {
        pc.createOffer().then(offer => {
            setLocalAndSendMessage(pc, offer);
            stompClient.send(`/app/peer/offer/${otherKey}/${roomId}`, {}, JSON.stringify({
                key: myKey,
                body: offer
            }));
            console.log('Send offer');
        });
    };

    const sendAnswer = (pc, otherKey) => {
        pc.createAnswer().then(answer => {
            setLocalAndSendMessage(pc, answer);
            stompClient.send(`/app/peer/answer/${otherKey}/${roomId}`, {}, JSON.stringify({
                key: myKey,
                body: answer
            }));
            console.log('Send answer');
        });
    };

    const setLocalAndSendMessage = (pc, sessionDescription) => {
        pc.setLocalDescription(sessionDescription);
    };

    const onTrack = (event, otherKey) => {
        if (document.getElementById(`${otherKey}`) === null) {
            const video = document.createElement('video');
            video.autoplay = true;
            video.controls = true;
            video.id = otherKey;
            video.srcObject = event.streams[0];
            document.getElementById('remoteStreamDiv').appendChild(video);
        }
    };

    const handleEnterRoom = async () => {
        await startCam();
        document.querySelector('#localStream').style.display = 'block';
        await connectSocket();
    };

    const handleStartStream = async () => {
        stompClient.send(`/app/call/key`, {}, {});
        setTimeout(() => {
            otherKeyList.forEach((key) => {
                if (!pcListMap.has(key)) {
                    const pc = createPeerConnection(key);
                    pcListMap.set(key, pc);
                    sendOffer(pc, key);
                }
            });
        }, 1000);
    };

    return (
        <div>
            <button onClick={handleEnterRoom}>Enter Room</button>
            <button onClick={toggleMute}>{isMuted ? 'Unmute' : 'Mute'}</button>
            <button onClick={toggleVideo}>{isVideoEnabled ? 'Turn Off Video' : 'Turn On Video'}</button>
            <video ref={localStreamElement} id="localStream" autoPlay playsInline controls />
            <div id="remoteStreamDiv"></div>
        </div>
    );
};

export default WebRTC;
