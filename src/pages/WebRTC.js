import React, { useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import "../styles/WebRTC.css";
import {useLocation} from "react-router-dom";
import axios from "axios";

const WebRTC = () => {
    const localStreamElement = useRef(null);
    const [myKey] = useState(Math.random().toString(36).substring(2, 11));
    let pcListMap = new Map(); // 피어 연결 저장
    let roomUuid;
    let otherKeyList = [];
    let localStream = undefined;
    let stompClient;
    const location = useLocation();
    const roomOccupation = location.state;
    let camCount = 0;
    let memberEmail = localStorage.getItem('email');
    let memberId;
    let memberType;
    let accessToken = localStorage.getItem('accessToken');

    const [memo, setMemo] = useState('');
    const [tutor1, setTutor1] = useState('');
    const [tutor2, setTutor2] = useState('');
    const [tutor3, setTutor3] = useState('');

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
                    localStreamElement.current.style.border = '2px solid red'; // 강조 스타일
                }).catch(error => {
                    console.error("Error accessing media devices:", error);
                });
        }
    };

    // const toggleMute = () => {
    //     if (localStream) {
    //         localStream.getAudioTracks()[0].enabled = !isMuted;
    //         setIsMuted(prev => !prev);
    //     }
    // };
    //
    // const toggleVideo = () => {
    //     if (localStream) {
    //         localStream.getVideoTracks()[0].enabled = !isVideoEnabled;
    //         setIsVideoEnabled(prev => !prev);
    //     }
    // };

    const connectSocket = async () => {
        const socket = new SockJS(process.env.REACT_APP_API_URL + 'signaling');
        stompClient = Stomp.over(socket);
        stompClient.debug = null;
        console.log(memberEmail);

        stompClient.connect(
            {
                camKey: myKey,
                occupation: roomOccupation,
                email: memberEmail,
            }, function () {
                console.log('Connected to WebRTC server');
                console.log(myKey);

                // 방 ID 구독
                stompClient.subscribe(`/topic/roomUuid/${myKey}`, (message) => {
                    roomUuid = message.body; // 룸 ID 저장
                    console.log(roomUuid);
                });

                // 회원 순번 받기
                stompClient.subscribe(`/topic/memberId/${myKey}`, (message) => {
                    memberId = message.body;
                })

                // 회원 타입 받기
                stompClient.subscribe(`/topic/memberType/${myKey}`, (message) => {
                    memberType = message.body;
                })

                // ICE 후보 구독
                stompClient.subscribe(`/topic/peer/iceCandidate/${myKey}/${roomUuid}`, candidate => {
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
                stompClient.subscribe(`/topic/peer/offer/${myKey}/${roomUuid}`, offer => {
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
                stompClient.subscribe(`/topic/peer/answer/${myKey}/${roomUuid}`, answer => {
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
            // 사용자 연결 종료 시 처리
            pc.addEventListener('iceconnectionstatechange', () => {
                if (pc.iceConnectionState === 'disconnected' || pc.iceConnectionState === 'closed') {
                    removeRemoteVideo(otherKey); // 사용자 화면 제거
                }
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

    const removeRemoteVideo = (otherKey) => {
        const videoElement = document.getElementById(otherKey);
        if (videoElement) {
            videoElement.srcObject = null; // 비디오 스트림 제거
            videoElement.parentNode.removeChild(videoElement); // DOM에서 비디오 요소 제거
            console.log(`Removed video for ${otherKey}`);
        }
    };

    const onIceCandidate = (event, otherKey) => {
        if (event.candidate) {
            stompClient.send(`/app/peer/iceCandidate/${otherKey}/${roomUuid}`, {}, JSON.stringify({
                key: myKey,
                body: event.candidate
            }));
        }
    };

    const sendOffer = (pc, otherKey) => {
        pc.createOffer().then(offer => {
            setLocalAndSendMessage(pc, offer);
            stompClient.send(`/app/peer/offer/${otherKey}/${roomUuid}`, {}, JSON.stringify({
                key: myKey,
                body: offer
            }));
            console.log('Send offer');
        });
    };

    const sendAnswer = (pc, otherKey) => {
        pc.createAnswer().then(answer => {
            setLocalAndSendMessage(pc, answer);
            stompClient.send(`/app/peer/answer/${otherKey}/${roomUuid}`, {}, JSON.stringify({
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
            video.style.width = '100%';
            video.style.height = '100%';
            video.srcObject = event.streams[0];
            camCount = camCount + 1;
            console.log(camCount);

            document.getElementById('remoteStreamDiv' + camCount).appendChild(video);
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

    const handleButtonClick = async () => {
        await handleEnterRoom();
    };

    // const handlePostFeedback = async () => {
    //     try {
    //         const response = await axios.post( "https://server.nextpick.site/" + `${roomId}/`)
    //     } catch (error) {
    //         alert("피드백 생성에 실패 했습니다.")
    //     }

    const handleGetParticipants = async () => {
        try {
            const resposne = await axios.get(process.env.REACT_APP_API_URL + "rooms/" + `${roomUuid}/` + "participants", {
               headers: {
                   'Content-Type': 'application/json',
                   Authorization: `Bearer ${accessToken}`
               }
            });
            let data = resposne.data.data;
            
        } catch (error) {

        }
    }


    return (
        <div className="container">
            <div className="video-section">
                <h2>진지한 자세로 참여부탁드립니다</h2>
                <div className="video-grid">
                    <div className="video-placeholder">
                        <video ref={localStreamElement} id="localStream" autoPlay playsInline controls style={{ width: '100%', height: '100%', display: "none"}}/>
                    </div>
                    <div className="video-placeholder">
                        <div id="remoteStreamDiv1"></div>
                    </div>
                    <div className="video-placeholder">
                        <div id="remoteStreamDiv2"></div>
                    </div>
                    <div className="video-placeholder">
                        <div id="remoteStreamDiv3"></div>
                    </div>
                </div>
                <button onClick={handleButtonClick}>입장하기</button>
            </div>

            <div className="input-section">
                <div className="memo-area">
                    <h2>나의 메모장</h2>
                    <textarea
                        value={memo}
                        onChange={(e) => setMemo(e.target.value)}
                        placeholder="여기에 메모를 입력하세요..."
                    />
                </div>
                <div className="tutor-feedback">
                    <h3>튜터 피드백</h3>
                    <div className="tutor-input">
                        <input
                            placeholder="1번 튜터"
                            value={tutor1}
                            onChange={(e) => setTutor1(e.target.value)}
                        />
                        <button>제출</button>
                    </div>
                    <div className="tutor-input">
                        <input
                            placeholder="2번 튜터"
                            value={tutor2}
                            onChange={(e) => setTutor2(e.target.value)}
                        />
                        <button>제출</button>
                    </div>
                    <div className="tutor-input">
                        <input
                            placeholder="3번 튜터"
                            value={tutor3}
                            onChange={(e) => setTutor3(e.target.value)}
                        />
                        <button>제출</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WebRTC;

