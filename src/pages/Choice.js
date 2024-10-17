import React, { useEffect, useState } from 'react';
import { useHeaderMode } from '../hooks/HeaderManager';
import { Modal, Button as ModalButton } from 'react-bootstrap';
import Input from '../components/Input';
import Swal from 'sweetalert2';
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Choice = () => {
    const { setHeaderMode } = useHeaderMode();
    const [roomTitle, setRoomTitle] = useState('');
    const [roomOccupation, setRoomOccupation] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const accessToken = localStorage.getItem('accessToken');
    const navigate = useNavigate();
    const type = localStorage.getItem('type');
    let title, memberId, roomUuid, roomId;

    const handleShowAddModalFE = () => {
        setShowAddModal(true);
        setRoomOccupation("FE");
    };

    const handleShowAddModalBE = () => {
        setShowAddModal(true);
        setRoomOccupation("BE");
    };

    const handleNavigate = async (occupation) => {
        setRoomOccupation(occupation);
        await handleGetInterviewRoom(occupation);
    };

    const handleCloseAddModal = () => setShowAddModal(false);

    const handlePostInterviewRoom = async () => {
        if (roomTitle.trim() === '' || roomOccupation.trim() === '') {
            // 필수 입력 필드 확인
            Swal.fire({
                icon: 'warning',
                title: '모든 필드를 입력해주세요.',
                confirmButtonText: '확인'
            }).then(() => {
                setRoomTitle(''); // 방 제목 초기화
                setRoomOccupation(''); // 방 직군 초기화
            });
            return;
        }

        try {
            // 서버에 방 생성 요청
            const response = await axios.post(
                process.env.REACT_APP_API_URL + 'rooms',
                { title: roomTitle, occupation: roomOccupation },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            // 방 생성 성공 메시지 표시
            Swal.fire({
                icon: 'success',
                title: '방이 성공적으로 생성되었습니다.',
                confirmButtonText: '확인',
            }).then(() => {
                const data = response.data.data;
                const roomUuid = data.roomUuid;
                const title = data.title;
                const roomId = data.roomId;
                const memberId = data.memberId;

                // 모달 닫기
                setShowAddModal(false);

                // 화면 전환 후 바로 적용될 수 있도록 navigate를 명시적으로 호출
                setTimeout(() => {
                    navigate('/webrtc', {
                        state: { roomUuid, title, roomId, roomOccupation, memberId },
                    });
                }, 100); // 짧은 지연을 추가하여 상태가 변경된 후 navigate 호출
            });
        } catch (error) {
            // 방 생성 실패 시 오류 메시지 표시
            await Swal.fire({
                icon: 'error',
                title: '방 만드는 중 오류가 발생했습니다.',
                confirmButtonText: '확인',
            });
        }
    };


    const handleGetInterviewRoom = async (occupation) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}rooms/${occupation}`, {
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
            });
            let data = response.data.data;
            roomUuid = data.roomUuid;
            title = data.title;
            roomId = data.roomId;
            // 모달 닫기
            setShowAddModal(false);

            // 화면 전환 후 바로 적용될 수 있도록 navigate를 명시적으로 호출
            setTimeout(() => {
                navigate('/webrtc', {
                    state: { roomUuid, title, roomId, roomOccupation, memberId },
                });
            }, 100); // 짧은 지연을 추가하여 상태가 변경된 후 navigate 호출
        } catch {
            await Swal.fire({icon: 'error', title: '직군의 남은 방이 없습니다.'});
        }
    };

    useEffect(() => {
        setHeaderMode('main');
    }, [setHeaderMode]);

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                gap: '30px',
                width: '100%',
                backgroundColor: '#f5f5f5',
                fontFamily: 'Pretendard, sans-serif',
                padding: '20px'
            }}
        >
            <div
                style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    padding: '40px',
                    textAlign: 'center',
                }}
            >
                <h1 style={{ marginBottom: '20px', color: '#333', fontSize: '24px' }}>직군을 선택하세요</h1>
                {type === 'MENTOR' ? (
                    <>
                        <button
                            style={{
                                backgroundColor: '#ffffff',
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                                padding: '15px',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                width: '250px',
                                height: '200px',
                                fontSize: '20px',
                                fontWeight: 'bold',
                                color: '#333',
                                cursor: 'pointer',
                                margin: '10px', // 여백 추가
                            }}
                            onClick={handleShowAddModalFE}
                            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            프론트엔드
                        </button>
                        <button
                            style={{
                                backgroundColor: '#ffffff',
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                                padding: '15px',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                width: '250px',
                                height: '200px',
                                fontSize: '20px',
                                fontWeight: 'bold',
                                color: '#333',
                                cursor: 'pointer',
                                margin: '10px', // 여백 추가
                            }}
                            onClick={handleShowAddModalBE}
                            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            백엔드
                        </button>
                    </>
                ) : type === 'MENTEE' ? (
                    <>
                        <button
                            style={{
                                backgroundColor: '#ffffff',
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                                padding: '15px',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                width: '250px',
                                height: '200px',
                                fontSize: '20px',
                                fontWeight: 'bold',
                                color: '#333',
                                cursor: 'pointer',
                                margin: '10px', // 여백 추가
                            }}
                            onClick={() => handleNavigate("FE")}
                            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            프론트엔드
                        </button>
                        <button
                            style={{
                                backgroundColor: '#ffffff',
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                                padding: '15px',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                width: '250px',
                                height: '200px',
                                fontSize: '20px',
                                fontWeight: 'bold',
                                color: '#333',
                                cursor: 'pointer',
                                margin: '10px', // 여백 추가
                            }}
                            onClick={() => handleNavigate("BE")}
                            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            백엔드
                        </button>
                    </>
                ) : null}
            </div>

            {/* 방 만들기 모달 */}
            <Modal show={showAddModal} onHide={handleCloseAddModal}>
                <Modal.Header closeButton>
                    <Modal.Title>방 만들기</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            padding: '20px',
                            fontFamily: 'Pretendard, sans-serif',
                        }}
                    >
                        <Input
                            placeholder="방 제목 입력"
                            value={roomTitle}
                            onChange={(e) => setRoomTitle(e.target.value)}
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <ModalButton variant="secondary" onClick={handleCloseAddModal}>닫기</ModalButton>
                    <ModalButton variant="primary" onClick={handlePostInterviewRoom}>방 만들기</ModalButton>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Choice;
