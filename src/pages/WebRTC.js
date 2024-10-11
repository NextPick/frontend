import React, { useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

const WebRTC = () => {
    // 지역 변수 및 상태 정의
    const localStreamElement = useRef(null); // 로컬 비디오 스트림을 참조하기 위한 useRef
    const [myKey] = useState(Math.random().toString(36).substring(2, 11)); // 랜덤 키 생성
    const [pcListMap, setPcListMap] = useState(new Map()); // 피어 연결을 관리하기 위한 Map
    let roomId = 0; // 방 ID 상태
    const [otherKeyList, setOtherKeyList] = useState([]); // 다른 피어의 키 목록
    let localStream = undefined; // 로컬 비디오 스트림 상태
    const [isMuted, setIsMuted] = useState(false); // 음소거 상태
    const [isVideoEnabled, setIsVideoEnabled] = useState(true); // 비디오 활성화 상태
    const stompClient = useRef(null); // STOMP 클라이언트 참조
    const occupation = "BE";

    // 카메라 시작 함수
    const startCam = async () => {
        if (navigator.mediaDevices) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
                console.log('Stream found');
                localStream = stream // 로컬 스트림 상태 업데이트
                if (localStreamElement.current) {
                    localStreamElement.current.srcObject = stream; // 비디오 요소에 로컬 스트림 설정
                }
            } catch (error) {
                console.error("Error accessing media devices:", error); // 에러 처리
            }
        }
    };

    // 음소거 토글 함수
    const toggleMute = () => {
        if (localStream) {
            localStream.getAudioTracks()[0].enabled = !isMuted; // 음소거 상태 변경
            setIsMuted(prev => !prev); // 상태 업데이트
        }
    };

    // 비디오 토글 함수
    const toggleVideo = () => {
        if (localStream) {
            localStream.getVideoTracks()[0].enabled = !isVideoEnabled; // 비디오 활성화 상태 변경
            setIsVideoEnabled(prev => !prev); // 상태 업데이트
        }
    };

    // 소켓 연결 함수
    const connectSocket = async () => {
        const socket = new SockJS('https://localhost:8443/signaling'); // 소켓 서버 URL
        stompClient.current = Stomp.over(socket); // STOMP 클라이언트 생성
        stompClient.debug = null;

        // STOMP 클라이언트 연결
        stompClient.current.connect(
            {
            camKey: myKey, // 서버로 camKey header에 담아서 보내기
            occupation: occupation,
            email: "1234@123.com",
        }, function ()  {
            console.log('Connected to WebRTC server');
            console.log(myKey);

            stompClient.current.subscribe(`/topic/roomId/${myKey}`, (message) => {
                const roomId1 = message.body;
                console.log("Received room ID:", roomId1);
                roomId = roomId1// 룸 ID 저장
            });

            // ICE 후보를 수신하는 구독
            stompClient.current.subscribe(`/topic/peer/iceCandidate/${myKey}/${roomId}`, candidate => {
                const key = JSON.parse(candidate.body).key; // 전송된 키 파싱
                const message = JSON.parse(candidate.body).body; // ICE 후보 메시지 파싱

                pcListMap.get(key).addIceCandidate(new RTCIceCandidate({
                    candidate: message.candidate,
                    sdpMLineIndex: message.sdpMLineIndex,
                    sdpMid: message.sdpMid
                })); // ICE 후보 추가
            });

            // 오퍼를 수신하는 구독
            stompClient.current.subscribe(`/topic/peer/offer/${myKey}/${roomId}`, offer => {
                const key = JSON.parse(offer.body).key; // 전송된 키 파싱
                const message = JSON.parse(offer.body).body; // 오퍼 메시지 파싱

                pcListMap.set(key, createPeerConnection(key))
                pcListMap.get(key).setRemoteDescription(new RTCSessionDescription({
                    type: message.type,
                    sdp: message.sdp
                })); // 원격 설명 설정
                sendAnswer(pcListMap.get(key), key); // 응답 전송
            });

                // 응답을 수신하는 구독
                stompClient.current.subscribe(`/topic/peer/answer/${myKey}/${roomId}`, answer => {
                    const key = JSON.parse(answer.body).key; // 전송된 키 파싱
                    const message = JSON.parse(answer.body).body; // 응답 메시지 파싱

                    console.log('Received answer:', message);
                    const pc = pcListMap.get(key);
                    if (pc) {
                        pc.setRemoteDescription(new RTCSessionDescription(message)).catch(error => {
                            console.error('Error setting remote description:', error);
                        });
                    }
                });

            // 키 요청을 수신하는 구독
            stompClient.current.subscribe(`/topic/call/key`, () => {
                stompClient.current.send(`/app/send/key`, {}, JSON.stringify(myKey)); // 자신의 키 전송
            });

            // 키를 수신하는 구독
            stompClient.current.subscribe(`/topic/send/key`, message => {
                const key = JSON.parse(message.body); // 전송된 키 파싱

                if(myKey !== key && otherKeyList.find((mapKey) => mapKey === myKey) === undefined){
                    otherKeyList.push(key);
                }
            });
        });
    };

    // 피어 연결 생성 함수
    const createPeerConnection = (otherKey) => {
        const pc = new RTCPeerConnection(); // 새로운 RTCPeerConnection 생성
        try {
            pc.addEventListener('icecandidate', (event) => {
                onIceCandidate(event, otherKey);
            });
            pc.addEventListener('track', (event) => {
                onTrack(event, otherKey);
            });
            if(localStream !== undefined){
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

    // ICE 후보 이벤트 핸들러
    const onIceCandidate = (event, otherKey) => {
        if (event.candidate) {
            console.log('ICE candidate:', event.candidate); // 로그 추가
            stompClient.current.send(`/app/peer/iceCandidate/${otherKey}/${roomId}`, {}, JSON.stringify({
                key: myKey,
                body: event.candidate
            })); // ICE 후보 전송
        }
    };

    // 오퍼 전송 함수
    const sendOffer = (pc, otherKey) => {
        pc.createOffer().then(offer => {
            return pc.setLocalDescription(offer).then(() => {
                stompClient.current.send(`/app/peer/offer/${otherKey}/${roomId}`, {}, JSON.stringify({
                    key: myKey,
                    body: offer
                }));
            });
        }).catch(error => {
            console.error('Error creating offer:', error);
        });
    };

    const setLocalAndSendMessage = (pc ,sessionDescription) =>{
        pc.setLocalDescription(sessionDescription);
    }

    // 응답 전송 함수
    const sendAnswer = (pc, otherKey) => {
        pc.createAnswer().then(answer => {
            return pc.setLocalDescription(answer).then(() => {
                stompClient.current.send(`/app/peer/answer/${otherKey}/${roomId}`, {}, JSON.stringify({
                    key: myKey,
                    body: answer
                }));
            });
        }).catch(error => {
            console.error('Error creating answer:', error);
        });
    };

    // 트랙 이벤트 핸들러
    let onTrack = (event, otherKey) => {
        console.log("Track event received:", event); // 로그 추가

        // 새로운 비디오 요소 생성 및 추가
        if (document.getElementById(`${otherKey}`) === null) {
            const video = document.createElement('video');
            video.autoplay = true; // 자동 재생
            video.controls = true; // 컨트롤 활성화
            video.id = otherKey; // ID 설정
            video.srcObject = event.streams[0]; // 스트림 설정

            document.getElementById('remoteStreamDiv').appendChild(video); // DOM에 추가
        }
    };

    // 방 입장 핸들러
    const handleEnterRoom = async () => {
        await startCam(); // 카메라 시작
        document.querySelector('#localStream').style.display = 'block'; // 로컬 스트림 표시
        await connectSocket(); // 소켓 연결
    };

    // 스트림 시작 핸들러
    const handleStartStream = async () => {
        stompClient.current.send(`/app/call/key`, {}, {}); // 키 요청 전송
        setTimeout(() => {
            otherKeyList.forEach((key) => {
                if (!pcListMap.has(key)) {
                    if (localStream) { // localStream이 존재하는지 확인
                        const pc = createPeerConnection(key);
                        pcListMap.set(key, pc);
                        sendOffer(pc, key);
                    } else {
                        console.error('Local stream is not available. Cannot create PeerConnection.');
                    }
                }
            });
        }, 1000); // 1초 후 실행
    };

    return (
        <div>
            <button onClick={handleEnterRoom}>Enter Room</button>
            <button onClick={handleStartStream}>Start Stream</button> {/* 스트림 시작 버튼 */}
            <button onClick={toggleMute}>{isMuted ? 'Unmute' : 'Mute'}</button> {/* 음소거 토글 버튼 */}
            <button onClick={toggleVideo}>{isVideoEnabled ? 'Turn Off Video' : 'Turn On Video'}</button> {/* 비디오 토글 버튼 */}
            <video ref={localStreamElement} id="localStream" autoPlay controls muted /> {/* 로컬 비디오 스트림 */}
            <div id="remoteStreamDiv"></div> {/* 원격 비디오 스트림을 표시할 DIV */}
        </div>
    );
};

export default WebRTC; // WebRTC 컴포넌트 내보내기
