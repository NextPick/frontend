import React, { useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

const WebRTC = () => {
    const localStreamElement = useRef(null);
    const [localStream, setLocalStream] = useState(null);
    const [myKey] = useState(Math.random().toString(36).substring(2, 11));
    const [roomId, setRoomId] = useState('');
    const [pcListMap, setPcListMap] = useState(new Map());
    const [otherKeyList, setOtherKeyList] = useState([]);
    const [stompClient, setStompClient] = useState(null);

    // 카메라 시작 함수
    const startCam = async () => {
        if (navigator.mediaDevices) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
                console.log('Stream found');
                setLocalStream(stream);
                localStreamElement.current.srcObject = stream;
                localStreamElement.current.style.display = 'block'; // 로컬 스트림 표시
            } catch (error) {
                console.error("Error accessing media devices:", error);
            }
        }
    };

    // 소켓 연결 함수
    const connectSocket = async () => {
        const socket = new SockJS('https://172.30.1.27:8443/signaling'); // SockJS를 통해 소켓 연결
        const client = Stomp.over(socket); // STOMP 클라이언트 생성
        client.debug = null; // 디버그 로그 비활성화

        // STOMP 서버에 연결
        client.connect({}, () => {
            console.log('Connected to WebRTC server');

            // ICE 후보 수신 구독
            client.subscribe(`/topic/peer/iceCandidate/${myKey}/${roomId}`, candidate => {
                const key = JSON.parse(candidate.body).key; // 키 추출
                const message = JSON.parse(candidate.body).body; // 메시지 추출

                // ICE 후보 추가
                pcListMap.get(key).addIceCandidate(new RTCIceCandidate({
                    candidate: message.candidate,
                    sdpMLineIndex: message.sdpMLineIndex,
                    sdpMid: message.sdpMid
                }));
            });

            // OFFER 수신 구독
            client.subscribe(`/topic/peer/offer/${myKey}/${roomId}`, offer => {
                const key = JSON.parse(offer.body).key; // 키 추출
                const message = JSON.parse(offer.body).body; // 메시지 추출

                // 피어 연결 생성 및 원격 설명 설정
                const pc = createPeerConnection(key);
                pc.setRemoteDescription(new RTCSessionDescription({
                    type: message.type,
                    sdp: message.sdp
                }));
                sendAnswer(pc, key); // ANSWER 전송
            });

            // ANSWER 수신 구독
            client.subscribe(`/topic/peer/answer/${myKey}/${roomId}`, answer => {
                const key = JSON.parse(answer.body).key; // 키 추출
                const message = JSON.parse(answer.body).body; // 메시지 추출

                // 원격 설명 설정
                pcListMap.get(key).setRemoteDescription(new RTCSessionDescription(message));
            });

            // 호출 키 수신 구독
            client.subscribe(`/topic/call/key`, () => {
                client.send(`/app/send/key`, {}, JSON.stringify(myKey)); // 자신의 키 전송
            });

            // 다른 키 수신 구독
            client.subscribe(`/topic/send/key`, message => {
                const key = JSON.parse(message.body); // 키 추출

                // 다른 키 리스트에 추가
                if (myKey !== key && !otherKeyList.includes(key)) {
                    setOtherKeyList(prev => [...prev, key]);
                }
            });
        });

        setStompClient(client);
    };

    // 트랙 이벤트 처리 함수
    const onTrack = (event, otherKey) => {
        // 다른 사용자의 비디오 요소가 없으면 생성
        if (!document.getElementById(otherKey)) {
            const video = document.createElement('video'); // 비디오 요소 생성
            video.autoplay = true; // 자동 재생 설정
            video.controls = true; // 컨트롤러 표시
            video.id = otherKey; // ID 설정
            video.srcObject = event.streams[0]; // 스트림 연결

            // 비디오 요소를 DOM에 추가
            document.getElementById('remoteStreamDiv').appendChild(video);
        }
    };

    // 피어 연결 생성 함수
    const createPeerConnection = (otherKey) => {
        const pc = new RTCPeerConnection(); // RTCPeerConnection 객체 생성
        try {
            // ICE 후보 이벤트 추가
            pc.addEventListener('icecandidate', (event) => {
                onIceCandidate(event, otherKey); // ICE 후보 처리
            });
            // 트랙 이벤트 추가
            pc.addEventListener('track', (event) => {
                onTrack(event, otherKey); // 트랙 처리
            });
            // 로컬 스트림이 존재하면 스트림의 모든 트랙 추가
            if (localStream) {
                localStream.getTracks().forEach(track => {
                    pc.addTrack(track, localStream);
                });
            }

            console.log('PeerConnection created'); // 피어 연결 생성 로그
        } catch (error) {
            console.error('PeerConnection failed: ', error); // 오류 로그
        }
        return pc; // 피어 연결 반환
    };

    // ICE 후보 처리 함수
    const onIceCandidate = (event, otherKey) => {
        if (event.candidate) {
            console.log('ICE candidate'); // ICE 후보 로그
            // ICE 후보를 서버로 전송
            stompClient.send(`/app/peer/iceCandidate/${otherKey}/${roomId}`, {}, JSON.stringify({
                key: myKey,
                body: event.candidate
            }));
        }
    };

    // OFFER 전송 함수
    const sendOffer = (pc, otherKey) => {
        pc.createOffer().then(offer => {
            setLocalAndSendMessage(pc, offer); // 로컬 설명 설정 및 메시지 전송
            stompClient.send(`/app/peer/offer/${otherKey}/${roomId}`, {}, JSON.stringify({
                key: myKey,
                body: offer // OFFER 전송
            }));
            console.log('Send offer'); // OFFER 전송 로그
        });
    };

    // ANSWER 전송 함수
    const sendAnswer = (pc, otherKey) => {
        pc.createAnswer().then(answer => {
            setLocalAndSendMessage(pc, answer); // 로컬 설명 설정 및 메시지 전송
            stompClient.send(`/app/peer/answer/${otherKey}/${roomId}`, {}, JSON.stringify({
                key: myKey,
                body: answer // ANSWER 전송
            }));
            console.log('Send answer'); // ANSWER 전송 로그
        });
    };

    // 로컬 설명 설정 및 메시지 전송 함수
    const setLocalAndSendMessage = (pc, sessionDescription) => {
        pc.setLocalDescription(sessionDescription); // 로컬 설명 설정
    };

    // 방 번호 입력 후 카메라 및 웹소켓 실행
    const handleEnterRoom = async () => {
        await startCam(); // 카메라 시작

        // 로컬 스트림이 존재하면 UI 업데이트
        if (localStream) {
            localStreamElement.current.style.display = 'block';
            document.getElementById('startSteamBtn').style.display = 'block'; // 스트림 버튼 표시
        }
        setRoomId(document.getElementById('roomIdInput').value); // 방 ID 저장
        document.getElementById('roomIdInput').disabled = true; // 입력 필드 비활성화
        document.getElementById('enterRoomBtn').disabled = true; // 버튼 비활성화

        await connectSocket(); // 소켓 연결
    };

    // 스트림 버튼 클릭 시 다른 웹 키들 가져와서 OFFER -> ANSWER -> ICE 후보 통신
    const handleStartStream = async () => {
        await stompClient.send(`/app/call/key`, {}, {}); // 호출 키 전송

        // 잠시 후 다른 키들에 대해 OFFER 전송
        setTimeout(() => {
            otherKeyList.forEach(key => {
                if (!pcListMap.has(key)) {
                    const pc = createPeerConnection(key); // 피어 연결 생성
                    pcListMap.set(key, pc);
                    sendOffer(pc, key); // OFFER 전송
                }
            });
        }, 1000);
    };

    return (
        <div>
            <div>
                <input
                    type="number"
                    id="roomIdInput"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    placeholder="Room ID"
                />
                <button
                    type="button"
                    id="enterRoomBtn"
                    onClick={handleEnterRoom}
                >
                    Enter Room
                </button>
                <button
                    type="button"
                    id="startSteamBtn"
                    style={{ display: localStream ? 'block' : 'none' }} // 로컬 스트림이 있을 때만 표시
                    onClick={handleStartStream}
                >
                    Start Streams
                </button>
            </div>

            <video
                ref={localStreamElement}
                autoPlay
                playsInline
                controls
                style={{ display: 'none' }} // 초기에는 보이지 않음
            />

            <div id="remoteStreamDiv" style={{ marginTop: '20px' }}>
                {/* 원격 스트림 비디오 요소가 추가될 곳 */}
            </div>
        </div>
    );
};

export default WebRTC;
