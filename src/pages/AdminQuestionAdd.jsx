import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Font from '../components/Font';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import AdminpageSide from '../components/AdminpageSide';
import plusbutton from '../assets/plusbutton.png';

const Administration = () => {
  const { questionId } = useParams(); // Retrieve questionId from the URL
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    if (questionId) {
      axios.get(`${process.env.REACT_APP_API_URL}questions/${questionId}`)
        .then(response => {
          const data = response.data.data;
          setQuestion(data.question);
          setAnswer(data.answer);
          setSelectedCategory(data.questionCategory.questionCategoryId);
        })
        .catch(error => {
          console.error('Error fetching question data:', error);
        });
    }
  }, [questionId]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}question/category`)
      .then(response => {
        setCategories(response.data.data);
      })
      .catch(error => {
        console.error('카테고리 가져오기 오류:', error);
      });
  }, []);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleQuestionChange = (e) => {
    setQuestion(e.target.value);
  };

  const handleAnswerChange = (e) => {
    setAnswer(e.target.value);
  };

  const handleAddQuestion = () => {
    axios.post(`${process.env.REACT_APP_API_URL}questions/admin`, {
      question,
      answer,
      questionCategoryId: selectedCategory
    })
    .then(() => {
      alert('질문이 성공적으로 추가되었습니다.');
      setQuestion('');
      setAnswer('');
      setSelectedCategory('');
    })
    .catch(error => {
      console.error('Error adding question:', error);
    });
  };

  return (
    <Container>
      <AdminpageSide />
      <MainContent>
        <Font font="Pretendard" size="24px" align="left" marginbottom="30px">
          면접질문 관리
          <img src={plusbutton} alt="plusbutton" style={{ width: '25px', height: '25px', marginLeft: '10px' }} />
        </Font>
        <CategoryDropdown>
          <label htmlFor="categorySelect">카테고리 선택: </label>
          <Select id="categorySelect" value={selectedCategory} onChange={handleCategoryChange}>
            <option value="">카테고리를 선택하세요</option>
            {categories.map((category) => (
              <option key={category.questionCategoryId} value={category.questionCategoryId}>
                {category.categoryName}
              </option>
            ))}
          </Select>
        </CategoryDropdown>
        <ContentBox>
          <SectionTitle>문제</SectionTitle>
          <TextArea value={question} onChange={handleQuestionChange} placeholder="문제를 입력하세요..." />
          <SectionTitle>정답</SectionTitle>
          <TextArea value={answer} onChange={handleAnswerChange} placeholder="정답을 입력하세요..." />
        </ContentBox>
        <AddButton onClick={handleAddQuestion}>질문 추가하기</AddButton>
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
  background-color: #f1f7fd;
  border-radius: 15px;
  margin-left: 20px;
  text-align: center;
`;

const CategoryDropdown = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  text-align: left;
  label {
    margin-right: 10px;
    font-size: 16px;
  }
`;

const Select = styled.select`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  background-color: #fff;
`;

const ContentBox = styled.div`
  padding: 15px;
  background-color: #fff;
  border-radius: 10px;
  border: 1px solid #ddd;
  margin-bottom: 20px;
`;

const SectionTitle = styled.div`
  font-size: 16px;
  font-weight: bold;
  margin: 10px 0 5px;
  text-align: left;
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 80px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
  margin-bottom: 15px;
  resize: vertical;
  background-color: #f7f9fc;
`;

const AddButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  color: #fff;
  background-color: #4b8da6;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #3a7a91;
  }
`;

export default Administration;
