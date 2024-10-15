import React, { useEffect, useState } from 'react';
import { useHeaderMode } from '../hooks/HeaderManager';
import '../styles/login.css';
import Button from '../components/Button';
import choicefe from '../assets/choicefe.png';
import choicebe from '../assets/choicebe.png';
import styled from 'styled-components';
import { Modal, Button as ModalButton } from 'react-bootstrap';
import Input from '../components/Input';
import Swal from 'sweetalert2';
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ModalContent = styled.div`
    display: flex;
    flex-direction: column;
    padding: 20px;
    font-family: PretendardL;
`;

const Choice = () => {
    const { setHeaderMode } = useHeaderMode();
    const [roomTitle, setRoomTitle] = useState('');
    const [roomOccupation, setRoomOccupation] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const accessToken = localStorage.getItem('accessToken');
    const navigate = useNavigate();
    const type = localStorage.getItem('type');
    let roomOccupationMT = null;

    const handleShowAddModalFE = () => {
        setShowAddModal(true);
        setRoomOccupation("FE");
    };

    const handleShowAddModalBE = () => {
        setShowAddModal(true);
        setRoomOccupation("BE");
    }

    const handleNavigateFE = () => {
        roomOccupationMT = "FE";
        navigate('/webrtc', { state: roomOccupationMT });
    }

    const handleNavigateBE = () => {
        roomOccupationMT = "BE";
        navigate('/webrtc', { state: roomOccupationMT });
    }

    const handleCloseAddModal = () => {
        setShowAddModal(false);
    };

    const handlePostInterviewRoom = async () => {
        if (roomTitle.trim() === '' || roomOccupation.trim() === '') {
            Swal.fire({
                icon: 'warning',
                title: '모든 필드를 입력해주세요.',
                confirmButtonText: '확인'
            }).then(() => {
                setRoomTitle('');
                setRoomOccupation('');
            });
            return;
        }

        try {
            const response = await axios.post(process.env.REACT_APP_API_URL + 'rooms',
                {
                    title: roomTitle,
                    occupation: roomOccupation,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            Swal.fire({
                icon: 'success',
                title: '방이 성공적으로 생성되었습니다.',
                confirmButtonText: '확인'
            }).then(() => {
                let dataToPass = { roomTitle: roomTitle, roomOccupation: roomOccupation };
                setShowAddModal(false);
                navigate('/webrtc', { state: dataToPass });
            });
        } catch (error) {
            alert("방 만드는 중 오류가 발생했습니다. 다시 시도해주세요.");
        }
    };

    useEffect(() => {
        setHeaderMode('main');
    }, [setHeaderMode]);

    return (
        <div className='wrap' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '90vh', gap: "10px", width: "100%" }}>
            {/* 조건부 렌더링에 따라 버튼 표시 */}
            {type === 'MENTOR' ? (
                <>
                    <Button color="transparent" radius="5px" hoverColor="#FFFFFF" onClick={handleShowAddModalFE}>
                        <img src={choicefe} alt="fe" style={{ width: '350px', height: '340px' }} />
                    </Button>
                    <Button color="transparent" radius="5px" hoverColor="#FFFFFF" onClick={handleShowAddModalBE}>
                        <img src={choicebe} alt="be" style={{ width: '350px', height: '340px' }} />
                    </Button>
                </>
            ) : type === 'MENTEE' ? (
                    <>
                        <Button color="transparent" radius="5px" hoverColor="#FFFFFF" onClick={handleNavigateFE}>
                            <img src={choicefe} alt="fe" style={{ width: '350px', height: '340px' }} />
                        </Button>
                        <Button color="transparent" radius="5px" hoverColor="#FFFFFF" onClick={handleNavigateBE}>
                            <img src={choicebe} alt="be" style={{ width: '350px', height: '340px' }} />
                        </Button>
                        <Button color="transparent" radius="5px" hoverColor="#FFFFFF" onClick={() => navigate('/webrtc')}>
                            입장하기
                        </Button>
                    </>
            ) : null}
            {/* 방 만들기 모달 */}
            <Modal show={showAddModal} onHide={handleCloseAddModal}>
                <Modal.Header closeButton>
                    <Modal.Title>방 만들기</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ModalContent>
                        <Input
                            placeholder="방 제목 입력"
                            value={roomTitle}
                            onChange={(e) => setRoomTitle(e.target.value)}
                        />
                    </ModalContent>
                </Modal.Body>
                <Modal.Footer>
                    <ModalButton variant="secondary" onClick={handleCloseAddModal}>닫기</ModalButton>
                    <ModalButton variant="primary" onClick={handlePostInterviewRoom}>방 만들기</ModalButton>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Choice;
