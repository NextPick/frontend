import React, { useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import "../styles/WebRTC.css";
import {useLocation, useNavigate} from "react-router-dom";
import axios from "axios";
import placeholderImage from '../assets/mainlogo.png';
import Swal from "sweetalert2";

const WebRTC = () => {
    // 로컬 비디오 스트림을 참조하기 위한 ref
    const localStreamElement = useRef(null);
    // 고유한 키 생성
    const [myKey] = useState(Math.random().toString(36).substring(2, 11));
    let pcListMap = new Map(); // 피어 연결 저장을 위한 Map
    let otherKeyList = []; // 다른 참가자의 키 목록
    let localStream = undefined; // 로컬 스트림 저장
    let stompClient; // STOMP 클라이언트
    const location = useLocation(); // 현재 위치의 상태 가져오기
    const {roomUuid, title, roomId, roomOccupation, memberId} = location.state || {};
    let camCount = 0; // 비디오 카운트
    let memberType = localStorage.getItem('type'); // 회원 타입
    let accessToken = localStorage.getItem('accessToken'); // 접근 토큰
    let otherMemberIdList = []; // 다른 회원 ID 목록
    let memberEmail = localStorage.getItem('email'); // 회원 이메일
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);

    // 다른 회원 정보를 저장하기 위한 객체
    // 상태로 otherMembers 선언
    const [otherMembers, setOtherMembers] = useState({
        otherMember1: null,
        otherMember2: null,
        otherMember3: null,
    });

    // 메모 및 튜터 피드백을 위한 상태 관리
    const [memo, setMemo] = useState('');
    const [tutor1, setTutor1] = useState('');
    const [tutor2, setTutor2] = useState('');
    const [tutor3, setTutor3] = useState('');

    // 나가기 버튼 클릭 처리
    const handleLeaveRoom = () => {
        // 필요한 정리 작업 수행 (예: 소켓 연결 종료, 스트림 중지 등)
        if (stompClient) {
            stompClient.disconnect();
        }
        if (memberType === 'MENTOR') {
            navigate("/");
        } else {
            // 다른 페이지로 이동
            navigate("/InterviewFeedback", {state: {roomId: roomId, mentorId: memberId}}) // 이동할 페이지 경로로 변경
        }
    };

    // 카메라 시작 함수
    const startCam = async () => {
        if (navigator.mediaDevices !== undefined) {
            await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
                .then(async (stream) => {
                    console.log('Stream found');
                    localStream = stream; // 로컬 스트림 저장
                    stream.getAudioTracks()[0].enabled = true; // 오디오 트랙 활성화
                    if (localStreamElement.current) {
                        localStreamElement.current.srcObject = localStream; // 비디오 엘리먼트에 스트림 설정
                    }
                    localStreamElement.current.style.border = '2px solid red'; // 강조 스타일
                }).catch(error => {
                    console.error("Error accessing media devices:", error); // 오류 처리
                });
        }
    };

    // 소켓 연결 함수
    const connectSocket = async () => {
        const socket = new SockJS(process.env.REACT_APP_API_URL + 'signaling'); // SockJS 소켓 생성
        stompClient = Stomp.over(socket); // STOMP 클라이언트 생성
        stompClient.debug = null; // 디버그 메시지 비활성화

        stompClient.connect(
            {
                camKey: myKey, // 카메라 키
                occupation: roomOccupation, // 방 점유 정보
                email: memberEmail, // 회원 이메일
            },  () => {
                console.log('Connected to WebRTC server');

                // ICE 후보 구독
                stompClient.subscribe(`/topic/peer/iceCandidate/${myKey}/${roomUuid}`, candidate => {
                    const key = JSON.parse(candidate.body).key // 후보를 보낸 사용자 키
                    const message = JSON.parse(candidate.body).body; // ICE 후보 메시지

                    // 해당 키의 피어 연결에서 ICE 후보를 추가합니다.
                    pcListMap.get(key).addIceCandidate(new RTCIceCandidate({
                        candidate: message.candidate,
                        sdpMLineIndex: message.sdpMLineIndex,
                        sdpMid: message.sdpMid
                    }));
                });

                // Offer 구독
                stompClient.subscribe(`/topic/peer/offer/${myKey}/${roomUuid}`, async (offer) => {
                    const key = JSON.parse(offer.body).key; // 키 추출
                    const message = JSON.parse(offer.body).body; // Offer 메시지 추출

                    // 이미 피어 연결이 존재하는지 확인
                    if (!pcListMap.has(key)) {
                        const pc = createPeerConnection(key); // 새로운 피어 연결 생성
                        pcListMap.set(key, pc); // Map에 추가
                        try {
                            await pc.setRemoteDescription(new RTCSessionDescription({
                                type: message.type,
                                sdp: message.sdp
                            })); // 원격 설명 설정
                            sendAnswer(pc, key); // 응답 전송
                        } catch (error) {
                            console.error('Error setting remote description:', error); // 오류 처리
                        }
                    } else {
                        const pc = pcListMap.get(key);
                        try {
                            await pc.setRemoteDescription(new RTCSessionDescription({
                                type: message.type,
                                sdp: message.sdp
                            })); // 원격 설명 설정
                        } catch (error) {
                            console.error('Error setting remote description:', error); // 오류 처리
                        }
                    }
                });

                // Answer 구독
                stompClient.subscribe(`/topic/peer/answer/${myKey}/${roomUuid}`, async (answer) => {
                    const key = JSON.parse(answer.body).key; // 키 추출
                    const message = JSON.parse(answer.body).body; // Answer 메시지 추출

                    const pc = pcListMap.get(key);
                    if (pc) {
                        try {
                            await pc.setRemoteDescription(new RTCSessionDescription(message)); // 원격 설명 설정
                        } catch (error) {
                            console.error('Error setting remote description:', error); // 오류 처리
                        }
                    }
                });

                // 키 전송
                stompClient.subscribe(`/topic/call/key`, () => {
                    stompClient.send(`/app/send/key`, {}, JSON.stringify(myKey)); // 키 전송
                });

                // 키 수신
                stompClient.subscribe(`/topic/send/key`, message => {
                    const key = JSON.parse(message.body); // 다른 참여자의 키

                    // 이미 존재하지 않는 경우에만 추가
                    if (myKey !== key && !otherKeyList.includes(key)) {
                        otherKeyList.push(key);
                    }
                });

                // 연결이 완료된 후 바로 스트림 시작
                handleStartStream();
            },
            (error) => {
                console.error('Connection error: ', error); // 연결 오류 처리
            }
        );
    };

    // 피어 연결 생성
    const createPeerConnection = (otherKey) => {
        const pc = new RTCPeerConnection(); // 새로운 RTCPeerConnection 생성
        try {
            pc.addEventListener('icecandidate', (event) => {
                onIceCandidate(event, otherKey); // ICE 후보 처리
            });
            pc.addEventListener('track', (event) => {
                onTrack(event, otherKey); // 트랙 수신 처리
            });

            // 사용자 연결 종료 시 처리
            pc.addEventListener('iceconnectionstatechange', () => {
                if (pc.iceConnectionState === 'disconnected' || pc.iceConnectionState === 'closed') {
                    removeRemoteVideo(otherKey); // 사용자 화면 제거
                }
            });

            if (localStream) {
                localStream.getTracks().forEach(track => {
                    pc.addTrack(track, localStream); // 로컬 트랙 추가
                });
            }
            console.log('PeerConnection created'); // 피어 연결 생성 완료
        } catch (error) {
            console.error('PeerConnection failed: ', error); // 오류 처리
        }
        return pc; // 피어 연결 반환
    };

    // 원격 비디오 제거
    const removeRemoteVideo = (otherKey) => {
        const videoElement = document.getElementById(otherKey);
        if (videoElement) {
            videoElement.srcObject = null; // 비디오 스트림 제거
            videoElement.parentNode.removeChild(videoElement); // DOM에서 비디오 요소 제거
            console.log(`Removed video for ${otherKey}`); // 제거 로그
        }
    };

    // ICE 후보 처리
    const onIceCandidate = (event, otherKey) => {
        if (event.candidate) {
            stompClient.send(`/app/peer/iceCandidate/${otherKey}/${roomUuid}`, {}, JSON.stringify({
                key: myKey,
                body: event.candidate // ICE 후보 전송
            }));
        }
    };

    // Offer 전송
    const sendOffer = (pc, otherKey) => {
        pc.createOffer().then(offer => {
            setLocalAndSendMessage(pc, offer); // 로컬 설명 설정
            stompClient.send(`/app/peer/offer/${otherKey}/${roomUuid}`, {}, JSON.stringify({
                key: myKey,
                body: offer // Offer 전송
            }));
            console.log('Send offer'); // Offer 전송 로그
        });
    };

    // Answer 전송
    const sendAnswer = (pc, otherKey) => {
        pc.createAnswer().then(answer => {
            setLocalAndSendMessage(pc, answer); // 로컬 설명 설정
            stompClient.send(`/app/peer/answer/${otherKey}/${roomUuid}`, {}, JSON.stringify({
                key: myKey,
                body: answer // Answer 전송
            }));
            console.log('Send answer'); // Answer 전송 로그
        });
    };

    // 로컬 설명 설정 및 메시지 전송
    const setLocalAndSendMessage = (pc, sessionDescription) => {
        pc.setLocalDescription(sessionDescription); // 로컬 설명 설정
    };

    // 트랙 수신 처리
    const onTrack = (event, otherKey) => {
        // 비디오 엘리먼트가 존재하지 않는 경우에만 생성
        if (document.getElementById(`${otherKey}`) === null) {
            const video = document.createElement('video'); // 새로운 비디오 엘리먼트 생성
            video.autoplay = true; // 자동 재생 설정
            video.controls = true; // 컨트롤 표시
            video.id = otherKey; // ID 설정
            video.style.width = '100%'; // 너비 100% 설정
            video.style.height = '100%'; // 높이 100% 설정
            video.srcObject = event.streams[0]; // 스트림 설정
            camCount += 1; // 카운트 증가
            console.log(camCount);
            video.style.objectFit = "cover"; // 비디오 비율 유지

            handleGetParticipants(otherKey); // 참가자 정보 처리

            // DOM에 비디오 추가
            document.getElementById('remoteStreamDiv' + camCount).appendChild(video);
        }
    };

    // 방 입장 처리
    const handleEnterRoom = async () => {
        await startCam(); // 카메라 시작
        document.querySelector('#localStream').style.display = 'block'; // 로컬 스트림 표시
        await connectSocket(); // 소켓 연결
    };

    // 스트림 시작 처리
    const handleStartStream = async () => {
        stompClient.send(`/app/call/key`, {}, {}); // 키 전송
        setTimeout(() => {
            otherKeyList.forEach((key) => {
                // Map에 존재하지 않는 키에 대해 피어 연결 생성 및 Offer 전송
                if (!pcListMap.has(key)) {
                    const pc = createPeerConnection(key);
                    pcListMap.set(key, pc);
                    sendOffer(pc, key); // Offer 전송
                }
            });
        }, 1000); // 1초 후 실행
    };

    // 입장 버튼 클릭 처리
    const handleEnterButtonClick = async () => {
        await handleEnterRoom(); // 방 입장 처리
        await handleGetQuestions();
    };

    // 참가자 정보 가져오기
    const handleGetParticipants = async (key) => {
        try {
            const response = await axios.get(process.env.REACT_APP_API_URL + "rooms/" + `${roomUuid}/` + "participants/" + key, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}` // 인증 헤더 설정
                }
            });
            let data = response.data.data; // 응답 데이터
            console.log(data);
            if (!otherMemberIdList.includes(data.memberId)) {
                otherMemberIdList.push(data.memberId); // 다른 회원 ID 목록에 추가
            }
            handleMemberId();
        } catch (error) {
            alert("member를 찾을 수 없습니다."); // 오류 처리
        }
    };

    // handleMemberId 함수 수정
    const handleMemberId = () => {
        const newMembers = { ...otherMembers }; // 기존 상태 복사
        otherMemberIdList.forEach((memberId, index) => {
            if (index < 3 && newMembers[`otherMember${index + 1}`] == null) {
                newMembers[`otherMember${index + 1}`] = memberId; // 새로운 값 할당
            }
        });
        setOtherMembers(newMembers); // 상태 업데이트
    }

    // 피드백 버튼 클릭 처리
    const handlePostButtonClick1 = async (menteeId) => {
        // 여기에 피드백 전송 로직을 추가할 수 있습니다.
        try {
            const response = await axios.post(process.env.REACT_APP_API_URL + "mentee/feedback/" + `${roomId}/` + menteeId, {
                content: tutor1
            },{
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}` // 인증 헤더 설정
                },
            });
            await Swal.fire({
                icon: 'success',
                title: '피드백을 생성했습니다.',
                confirmButtonText: '확인'
            })
        } catch (error) {
            alert("피드백 생성에 실패했습니다.");
        }
    };

    // 피드백 버튼 클릭 처리
    const handlePostButtonClick2 = async (menteeId) => {
        // 여기에 피드백 전송 로직을 추가할 수 있습니다.
        try {
            const response = await axios.post(process.env.REACT_APP_API_URL + "mentee/feedback/" + `${roomId}/` + menteeId, {
                content: tutor2
            },{
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}` // 인증 헤더 설정
                }
            });
            await Swal.fire({
                icon: 'success',
                title: '피드백을 생성했습니다.',
                confirmButtonText: '확인'
            })
        } catch (error) {
            alert("피드백 생성에 실패했습니다.");
        }
    };

    // 피드백 버튼 클릭 처리
    const handlePostButtonClick3 = async (menteeId) => {
        // 여기에 피드백 전송 로직을 추가할 수 있습니다.
        try {
            const response = await axios.post(process.env.REACT_APP_API_URL + "mentee/feedback/" + `${roomId}/` + menteeId, {
                content: tutor3
            },{
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}` // 인증 헤더 설정
                }
            });
            await Swal.fire({
                icon: 'success',
                title: '피드백을 생성했습니다.',
                confirmButtonText: '확인'
            })
        } catch (error) {
            alert("피드백 생성에 실패했습니다.");
        }
    };

    const handleGetQuestions = async () => {
        try {
            const response = await axios.get(process.env.REACT_APP_API_URL + `questions?page=1&size=10&category=-1&keyword&type=none&sort=recent`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}` // 필요한 경우 인증 헤더 추가
                }
            });
            // 응답 구조 확인
            let dataList = response.data // 데이터가 data 속성에 있는지 확인
            setQuestions(dataList.data);
        } catch (error) {
            console.error("질문을 불러오는 중 실패했습니다:", error); // 오류 메시지 출력
        }
    };

    // 컴포넌트 렌더링
    // 컴포넌트 렌더링
    return (
        <div className="container">
            <div className="video-section">
                <h2>{title}</h2>
                <div className="video-grid">
                    <div className="video-placeholder">
                        <video ref={localStreamElement} id="localStream" autoPlay playsInline controls muted style={{ width: '100%', height: '100%', display: "none" }} />
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
                <div className="button-container">
                    <button onClick={handleEnterButtonClick} className="action-button enter-button">입장하기</button>
                    <button onClick={handleLeaveRoom} className="action-button leave-button">나가기</button>
                </div>
            </div>

            <div className="input-section">
                {memberType === 'MENTOR' ? (
                    <div className="mentor-section">
                        <h2>질문 리스트</h2>
                        <ul>
                            {questions.map(item => (
                                <li key={item.questionListId}>{item.question}</li>
                            ))}
                        </ul>
                        <h3>튜터 피드백</h3>
                        <div className="tutor-feedback">
                            <div className="tutor-input">
                                <input
                                    className="input-field"
                                    placeholder="1번 튜터"
                                    value={tutor1}
                                    onChange={(e) => setTutor1(e.target.value)}
                                />
                                <button onClick={() => handlePostButtonClick1(otherMembers.otherMember1)} className="submit-button">제출</button>
                            </div>
                            <div className="tutor-input">
                                <input
                                    className="input-field"
                                    placeholder="2번 튜터"
                                    value={tutor2}
                                    onChange={(e) => setTutor2(e.target.value)}
                                />
                                <button onClick={() => handlePostButtonClick2(otherMembers.otherMember2)} className="submit-button">제출</button>
                            </div>
                            <div className="tutor-input">
                                <input
                                    className="input-field"
                                    placeholder="3번 튜터"
                                    value={tutor3}
                                    onChange={(e) => setTutor3(e.target.value)}
                                />
                                <button onClick={() => handlePostButtonClick3(otherMembers.otherMember3)} className="submit-button">제출</button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="memo-area">
                        <h2>나의 메모장</h2>
                        <textarea
                            className="textarea"
                            value={memo}
                            onChange={(e) => setMemo(e.target.value)}
                            placeholder="여기에 메모를 입력하세요..."
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default WebRTC;