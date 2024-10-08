import React, { useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

const WebRTC = () => {
    const localStreamElement = useRef(null);
    const [myKey] = useState(Math.random().toString(36).substring(2, 11));
    const [pcListMap, setPcListMap] = useState(new Map());
    const [roomId, setRoomId] = useState('');
    const [otherKeyList, setOtherKeyList] = useState([]);
    const [localStream, setLocalStream] = useState(undefined);
    let stompClient = useRef(null);

    const startCam = async () => {
        if (navigator.mediaDevices !== undefined) {
            await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
                .then((stream) => {
                    console.log('Stream found');
                    setLocalStream(stream);
                    localStreamElement.current.srcObject = stream;
                })
                .catch(error => {
                    console.error("Error accessing media devices:", error);
                });
        }
    };

    const connectSocket = async () => {
        const socket = new SockJS('https://172.30.1.27:8443/signaling');
        stompClient.current = Stomp.over(socket);
        stompClient.current.debug = null;

        stompClient.current.connect({
            roomId: roomId,
            camId: myKey,
        }, () => {
            console.log('Connected to WebRTC server');

            stompClient.current.subscribe(`/topic/peer/iceCandidate/${myKey}/${roomId}`, candidate => {
                const key = JSON.parse(candidate.body).key;
                const message = JSON.parse(candidate.body).body;

                pcListMap.get(key).addIceCandidate(new RTCIceCandidate(message));
            });

            stompClient.current.subscribe(`/topic/peer/offer/${myKey}/${roomId}`, offer => {
                const key = JSON.parse(offer.body).key;
                const message = JSON.parse(offer.body).body;

                const pc = createPeerConnection(key);
                pc.setRemoteDescription(new RTCSessionDescription(message));
                sendAnswer(pc, key);
            });

            stompClient.current.subscribe(`/topic/peer/answer/${myKey}/${roomId}`, answer => {
                const key = JSON.parse(answer.body).key;
                const message = JSON.parse(answer.body).body;

                pcListMap.get(key).setRemoteDescription(new RTCSessionDescription(message));
            });

            stompClient.current.subscribe(`/topic/call/key`, () => {
                stompClient.current.send(`/app/send/key`, {}, JSON.stringify(myKey));
            });

            stompClient.current.subscribe(`/topic/send/key`, message => {
                const key = JSON.parse(message.body);
                if (myKey !== key && !otherKeyList.includes(key)) {
                    setOtherKeyList(prev => [...prev, key]);
                }
            });
        });
    };

    const createPeerConnection = (otherKey) => {
        // STUN 서버 설정
        const iceServers = [
            {
                urls: 'stun:stun.l.google.com:19302' // 구글 STUN 서버
            }
        ];

        const pc = new RTCPeerConnection({ iceServers }); // ICE 서버를 설정하여 PeerConnection 생성
        pc.addEventListener('icecandidate', (event) => onIceCandidate(event, otherKey));
        pc.addEventListener('track', (event) => onTrack(event, otherKey));

        if (localStream) {
            localStream.getTracks().forEach(track => {
                pc.addTrack(track, localStream);
            });
        }

        console.log('PeerConnection created');
        return pc;
    };

    const onIceCandidate = (event, otherKey) => {
        if (event.candidate) {
            console.log('ICE candidate');
            stompClient.current.send(`/app/peer/iceCandidate/${otherKey}/${roomId}`, {}, JSON.stringify({
                key: myKey,
                body: event.candidate
            }));
        }
    };

    const sendOffer = (pc, otherKey) => {
        pc.createOffer().then(offer => {
            pc.setLocalDescription(offer);
            stompClient.current.send(`/app/peer/offer/${otherKey}/${roomId}`, {}, JSON.stringify({
                key: myKey,
                body: offer
            }));
            console.log('Send offer');
        });
    };

    const sendAnswer = (pc, otherKey) => {
        pc.createAnswer().then(answer => {
            pc.setLocalDescription(answer);
            stompClient.current.send(`/app/peer/answer/${otherKey}/${roomId}`, {}, JSON.stringify({
                key: myKey,
                body: answer
            }));
            console.log('Send answer');
        });
    };

    const onTrack = (event, otherKey) => {
        if (!document.getElementById(otherKey)) {
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
        if (localStream) {
            localStreamElement.current.style.display = 'block';
            await connectSocket();
        }
    };

    const handleStartStream = async () => {
        stompClient.current.send(`/app/call/key`, {}, {});
        setTimeout(() => {
            otherKeyList.forEach(key => {
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
            <input
                type="text"
                placeholder="Room ID"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
            />
            <button onClick={handleEnterRoom}>Enter Room</button>
            <button onClick={handleStartStream}>Start Stream</button>
            <video ref={localStreamElement} autoPlay muted style={{ display: 'none' }} />
            <div id="remoteStreamDiv"></div>
        </div>
    );
};

export default WebRTC;
