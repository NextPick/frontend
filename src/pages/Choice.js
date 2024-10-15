import React, { useEffect, useState } from 'react';
import { useHeaderMode } from '../hooks/HeaderManager';
import '../styles/login.css';
import Button from '../components/Button'; // Button 컴포넌트 import
import choicefe from '../assets/choicefe.png'; // 이미지 파일 import
import choicebe from '../assets/choicebe.png'; // 이미지 파일 import
import styled from 'styled-components';
import { Modal, Button as ModalButton } from 'react-bootstrap'; // Modal 컴포넌트 추가
import Input from '../components/Input';
import Swal from 'sweetalert2';
import axios from "axios";
import {useNavigate} from "react-router-dom"; // SweetAlert2 import

// 모달 창 스타일
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
    let accessToken = window.localStorage.getItem('accessToken');
    const navigate = useNavigate();

    const handleShowAddModal = () => {
        setShowAddModal(true);
    };

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
                setRoomTitle(''); // 방 제목 초기화
                setRoomOccupation(''); // 방 직군 초기화
            });
            return;
        }

        console.log(`방 제목: ${roomTitle}, 방 직군: ${roomOccupation}`);
        navigate('/WebRTC');

        try {
            const response = await axios.post('https://server.nextpick.site/rooms',
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
            // 방 생성 성공 시 추가 동작 (예: 알림)
            Swal.fire({
                icon: 'success',
                title: '방이 성공적으로 생성되었습니다.',
                confirmButtonText: '확인'
            });
            setShowAddModal(false); // 모달 닫기
            navigate('/interviewRoom', { state: roomOccupation });
        } catch (error) {
            alert("방 만드는 중 오류가 발생했습니다. 다시 시도해주세요.");
        }
    };

    useEffect(() => {
        setHeaderMode('main');
    }, [setHeaderMode]);

    return (
        <div className='wrap' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '90vh', gap: "10px", width: "100%" }}>
            {/* 버튼 클릭 시 모달 열기 */}
            <Button color="transparent" radius="5px" hoverColor="#FFFFFF" onClick={handleShowAddModal}>
                <img src={choicefe} alt="fe" style={{ width: '360px', height: '340px' }} />
            </Button>
            <Button color="transparent" radius="5px" hoverColor="#FFFFFF" onClick={handleShowAddModal}>
                <img src={choicebe} alt="be" style={{ width: '360px', height: '340px' }} />
            </Button>

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
                        <select
                            value={roomOccupation}
                            onChange={(e) => setRoomOccupation(e.target.value)}
                            style={{ marginTop: '10px', padding: '10px', borderRadius: '5px' }}
                        >
                            <option value="" disabled>방 직군 선택</option>
                            <option value="BE">백앤드</option>
                            <option value="FE">프론트앤드</option>
                            {/* 필요한 경우 추가 직군 옵션을 여기에 추가하세요 */}
                        </select>
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
