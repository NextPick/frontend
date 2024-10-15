import React, { useEffect, useState, useRef } from 'react';
import { useHeaderMode } from '../hooks/HeaderManager';
import { useNavigate } from 'react-router-dom';
import Box from '../components/Box';
import Font from '../components/Font';
import styled from 'styled-components';
import { useMember } from '../hooks/MemberManager'; // 회원 정보를 관리하는 훅

// 모달 스타일 정의
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5); /* 어두운 배경 */
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  width: 400px;
  border-radius: 10px;
  text-align: center;
`;

const CloseButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #ff5722;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const ListBox = styled.div`
  width: 75%;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const ListItem = styled.div`
  padding: 15px;
  background-color: #f0f0f0;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ResultPage = () => {
    const { headerMode, setHeaderMode } = useHeaderMode();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    // `items` 상태와 `setItems` 함수 정의
    const [items, setItems] = useState([
        { id: 1, question: 'What is 2 + 2?', correctAnswer: '4', userAnswer: '4', isCorrect: true },
        { id: 2, question: 'What is the capital of France?', correctAnswer: 'Paris', userAnswer: 'London', isCorrect: false },
    ]);
    const [page, setPage] = useState(1); // 페이지 번호를 관리
    const [loading, setLoading] = useState(false); // 데이터 로딩 상태

    const openModal = (item) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    const handleScroll = () => {
        if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || loading) {
            return;
        }
        setLoading(true);
    };

    const loadMoreItems = () => {
        setTimeout(() => {
            setItems((prevItems) => [
                ...prevItems,
                { id: prevItems.length + 1, question: `New Question ${prevItems.length + 1}`, correctAnswer: 'Answer', userAnswer: 'Your Answer', isCorrect: true },
                { id: prevItems.length + 2, question: `New Question ${prevItems.length + 2}`, correctAnswer: 'Answer', userAnswer: 'Your Answer', isCorrect: false },
            ]);
            setLoading(false); // 로딩 상태 해제
            setPage((prevPage) => prevPage + 1); // 페이지 번호 증가
        }, 1500); // 임의의 딜레이를 주어 로딩 상태를 보여줌
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loading]);

    useEffect(() => {
        if (loading) {
            loadMoreItems(); // 새로운 데이터 로드
        }
    }, [loading]);

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedItem(null);
    };

    useEffect(() => {
        setHeaderMode('main');
    }, [setHeaderMode]);

    return (
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height:'100vh' }}>
            <Box
                height="70vh"
                width="60vw"
                border="none"
                left="20px"
                justify="flex-start"
                direction="column"
                alignitem="center"
                padding="0px"
                style={{ display: 'flex' }}
            >
                <Font
                    font="PretendardL"
                    size="22px"
                    color="#000000"
                    margintop="5px"
                    spacing="2px"
                    paddingtop="5px"
                    paddingleft="13px"
                    marginbottom="2px"
                >
                    오늘 공부한 질문 List
                </Font>

                <ListBox>
                    {items.map((item) => (
                        <ListItem key={item.id} onClick={() => openModal(item)}>
                            {item.question}
                        </ListItem>
                    ))}
                </ListBox>

                {loading && <p>Loading...</p>}

                {isModalOpen && (
                    <ModalOverlay>
                        <ModalContent>
                            <h2>질문: {selectedItem.question}</h2>
                            <p>정답: {selectedItem.correctAnswer}</p>
                            <p>내 답변: {selectedItem.userAnswer}</p>
                            <p>{selectedItem.isCorrect ? '정답입니다!' : '오답입니다.'}</p>
                            <CloseButton onClick={closeModal}>닫기</CloseButton>
                        </ModalContent>
                    </ModalOverlay>
                )}
            </Box>
        </div>
    );
};

export default ResultPage;
