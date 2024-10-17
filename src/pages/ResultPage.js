import React, { useEffect, useState } from 'react';
import { useHeaderMode } from '../hooks/HeaderManager';
import Box from '../components/Box';
import Font from '../components/Font';
import styled from 'styled-components';
import axios from 'axios';
import correct from '../assets/correct.png';
import incorrect from '../assets/incorrect.png';

// 모달 스타일 정의
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  width: 80vw;
  max-width: 900px;
  border-radius: 10px;
  text-align: left;
`;

const CloseButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const StyledH2 = styled.h2`
  font-size: 20px; 
  font-weight: bold;
  margin-bottom: 10px;
`;

const Separator = styled.hr`
  border: none;
  border-top: 1px solid gray;
  margin: 10px 0;
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
  margin: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 15px;
  overflow-y: auto;
`;

const ListItem = styled.div`
  padding: 15px;
  background-color: #fff;
  font-weight: 500;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  border: 2px solid ${({ correct }) => (correct ? 'green' : 'red')};
`;

const StatusIcon = styled.img`
  width: 40px;
  margin-right: 10px;
`;

const ResultPage = () => {
  const { setHeaderMode } = useHeaderMode();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);

  const openModal = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const fetchItems = async () => {
    try {
      const solveQuestion = localStorage.getItem('solveQuestion');
      if (!solveQuestion) throw new Error('solveQuestion not found in localStorage');
      const solvesIdList = solveQuestion.split('/').map((id) => parseInt(id, 10)).filter((id) => !isNaN(id));
      if (solvesIdList.length === 0) throw new Error('No valid solvesId found after splitting solveQuestion');
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('Authorization token not found');
      const response = await axios.post(
        process.env.REACT_APP_API_URL + 'solves/list',
        { solvesIdList },
        { headers: { Authorization: token, 'Content-Type': 'application/json' } }
      );
      const fetchedData = response.data;
      if (fetchedData && Array.isArray(fetchedData.data)) setItems(fetchedData.data);
      else throw new Error('Invalid data format received from server');
    } catch (error) {
      console.error('Error fetching items:', error);
      setError('데이터를 불러오는 중 오류가 발생했습니다.');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  useEffect(() => {
    setHeaderMode('main');
    return () => {
      // clean-up 함수 추가 필요 시
    };
  }, [setHeaderMode]);

  useEffect(() => {
    fetchItems();
    return () => {
      // clean-up 함수 추가 필요 시
    };
  }, []); 

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
      }}
    >
      <Box
        height="80vh"
        width="70vw"
        border="none"
        left="20px"
        justify="flex-start"
        direction="column"
        alignitem="center"
        padding="0px"
        top="30px"
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
            <ListItem key={item.solvesId} onClick={() => openModal(item)} correct={item.correct}>
              <StatusIcon src={item.correct ? correct : incorrect} alt={item.correct ? 'Correct' : 'Incorrect'} />
              <span>{item.question}</span>
            </ListItem>
          ))}
        </ListBox>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        {isModalOpen && selectedItem && (
          <ModalOverlay>
            <ModalContent>
              <StyledH2>질문 : {selectedItem.question}</StyledH2>
              <Separator />
              <p>결과 : {selectedItem.correct ? '정답' : '오답'}</p>
              <p>정답 : {selectedItem.answer}</p>
              <p>내 답변: {selectedItem.myAnswer}</p>
              <CloseButtonContainer>
                <CloseButton onClick={closeModal}>닫기</CloseButton>
              </CloseButtonContainer>
            </ModalContent>
          </ModalOverlay>
        )}
      </Box>
    </div>
  );
};

export default ResultPage;
