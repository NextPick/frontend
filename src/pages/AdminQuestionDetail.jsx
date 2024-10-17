import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import AdminpageSide from '../components/AdminpageSide';
import plusbutton from '../assets/plusbutton.png';

const Administration = () => {
  const { questionId } = useParams(); // Retrieve questionId from the URL
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}questions/${questionId}`)
      .then(response => {
        const data = response.data.data;
        setQuestion(data.question);
        setAnswer(data.answer);
      })
      .catch(error => {
        console.error('Error fetching question data:', error);
      });
  }, [questionId]); // Re-run the effect if questionId changes

  return (
    <Container>
      <AdminpageSide />
      <MainContent>
        <Title>
          면접질문 관리 
          <img src={plusbutton} alt="plusbutton" style={{ width: '25px', height: '25px', marginLeft: '10px' }} />
        </Title>
        <ContentBox>
          <SectionTitle>문제</SectionTitle>
          <Content>{question}</Content>
          <SectionTitle>정답</SectionTitle>
          <Content>{answer}</Content>
        </ContentBox>
      </MainContent>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 100px;
  background-color: #FFF;
  height: 100vh;
  font-family: Arial, sans-serif;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 20px;
  max-width: 800px;
  height: 100%;
  border-radius: 15px;
  margin-left: 20px;
  text-align: center;
  border: 0.5px solid #ccc;
  background-color: #fff;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 4px;
`;

const Title = styled.h2`
  font-size: 24px;
  margin-top: 10px;
  margin-bottom: 10px;
  text-align: left;
  font-family: 'Pretendard', sans-serif;
  color: #006AC1;
  font-weight: bold;
`;

const ContentBox = styled.div`
  padding: 15px;
  background-color: #fff;
  border-radius: 10px;
  border: 1px solid #ddd;
`;

const SectionTitle = styled.div`
  font-size: 16px;
  font-weight: bold;
  margin: 10px 0 5px;
  text-align: left;
`;

const Content = styled.div`
  font-size: 14px;
  color: #333;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 5px;
  background-color: #f7f9fc;
  text-align: left;
`;

export default Administration;
