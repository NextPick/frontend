import React, { useEffect, useState } from 'react';
import { useHeaderMode } from '../hooks/HeaderManager';
import '../styles/login.css';
import Button from '../components/Button'; // Button 컴포넌트 import
import choicefe from '../assets/choicefe.png'; // 이미지 파일 import
import choicebe from '../assets/choicebe.png'; // 이미지 파일 import
import styled from 'styled-components';
import { Modal, Button as ModalButton } from 'react-bootstrap'; // Modal 컴포넌트 추가
import Input from '../components/Input'
import Swal from 'sweetalert2'; // SweetAlert2 import


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
    const [showAddModal, setShowAddModal] = useState(false);

  
    const handleShowAddModal = () => {
        setShowAddModal(true);
    };

    const handleCloseAddModal = () => {
        setShowAddModal(false);
    };

    const handleRoomCreation = () => {
        console.log('방 생성 시도'); // 추가
        console.log(`현재 방 제목: '${roomTitle}'`); // 현재 방 제목 로그 추가
        if (roomTitle.trim() === '') {
            Swal.fire({
                icon: 'warning',
                title: '방 제목을 입력해주세요.',
                confirmButtonText: '확인'
            }).then(() => {
                setRoomTitle(''); // 스왈창 확인 후 방 제목 초기화
                setShowAddModal(false); // 모달 닫기
            });
            return;
        }
        console.log(`방 제목: ${roomTitle}`);
        // 방 생성 로직 추가
        setShowAddModal(false);
        setRoomTitle('');
    };
    

    useEffect(() => {
        setHeaderMode('main');
    }, [setHeaderMode]);

    return (
        <div className='wrap' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '90vh', gap: "10px", width: "100%" }}>
            {/* 버튼 클릭 시 모달 열기 */}
            <Button color="transparent" radius="5px" hoverColor="#FFFFFF" onClick={handleShowAddModal}>
                <img src={choicefe} alt="fe" style={{ width: '130px', height: '110px' }} />
            </Button>
            <Button color="transparent" radius="5px" hoverColor="#FFFFFF" onClick={handleShowAddModal}>
                <img src={choicebe} alt="be" style={{ width: '130px', height: '110px' }} />
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
                    </ModalContent>
                </Modal.Body>
                <Modal.Footer>
                    <ModalButton variant="secondary" onClick={handleCloseAddModal}>닫기</ModalButton>
                    <ModalButton variant="primary" onClick={handleRoomCreation}>방 만들기</ModalButton>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Choice;
