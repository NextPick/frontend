import React, { useEffect, useState } from 'react';
import { useHeaderMode } from '../hooks/HeaderManager';
import { useNavigate, useLocation } from 'react-router-dom';
import Font from '../components/Font';
import styled from 'styled-components';
import correctImage from '../assets/correctImage.png'; 
import incorrectImage from '../assets/incorrectImage.png'; 
import axios from 'axios';

const ResultCheck = () => {
    const { setHeaderMode } = useHeaderMode();
    const navigate = useNavigate();
    const location = useLocation();
    const { questionListId, userResponse, selectedSubcategory, correct } = location.state || {};
    const [correctAnswer, setCorrectAnswer] = useState(<span>정답을 불러오고 있습니다...</span>);
    const [correctRate, setCorrectRate] = useState('N/L');

    useEffect(() => {
        setHeaderMode('main');
    }, [setHeaderMode]);

    useEffect(() => {
        if (questionListId) {
            axios.get(`${process.env.REACT_APP_API_URL}questions/${questionListId}`)
                .then(response => {
                    const data = response.data.data;
                    setCorrectAnswer(
                        <span>
                            이 문제에 대한 정답률은 {data.correctRate}% 입니다. <br />
                            정답에 가까운 답변은 <span style={{ color: '#006AC1', fontWeight: 'bold' }}>{data.answer}</span> 입니다.
                        </span>
                    );
                    setCorrectRate(data.correctRate ? `${data.correctRate}%` : '0%');
                })
                .catch(error => {
                    console.error('정답을 가져오는 중 오류 발생:', error);
                    setCorrectAnswer(<span>정답을 불러올 수 없습니다.</span>);
                    setCorrectRate('정답률을 불러올 수 없습니다.');
                });
        }
    }, [questionListId]);

    const handleStartInterviewClick = () => {
        navigate('/aiInterview', { state: { selectedCategory: selectedSubcategory, selectedSubcategory } });
    };

    const handleQuitClick = () => {
        navigate('/resultpage');
    };

    return (
        <ContainerWrapper>
            <OutlineContainer>
                <Font font="PretendardB" size="27px" color="#000000" margintop="30px" spacing="2px" paddingleft="13px" paddingtop="5px" marginbottom="8px">
                    AI코치 채점 결과
                </Font>
                <Container>
                    <ImageWrapper>
                        <img
                            src={correct ? correctImage : incorrectImage}
                            alt="Result"
                            style={{ width: '330px', height: '430px', marginLeft: "-80px" }}
                        />
                    </ImageWrapper>
                    <ChatContainer>
                        <ChatBubble align="left">
                            <Font font="Pretendard" size="18px" color="#000000">
                                {correctAnswer}
                            </Font>
                        </ChatBubble>
                        <ChatBubble align="right">
                            <TextareaField 
                                type="text"
                                value={'내가 대답한 답 : ' + userResponse || '대답하지 못하였습니다.'}
                                readOnly
                                placeholder="사용자 대답을 불러오고 있습니다.." 
                            />
                        </ChatBubble>
                    </ChatContainer>
                </Container>
                <ButtonContainer>
                    <Button
                        onClick={handleStartInterviewClick}
                    >
                        다음문제풀기
                    </Button>
                    <Button
                        onClick={handleQuitClick}
                    >
                        그만풀기
                    </Button>
                </ButtonContainer>
            </OutlineContainer>
        </ContainerWrapper>
    );
};

const Button = styled.div`
    width: 170px;
    height: 50px;
    font-size: 20px;
    border-radius: 15px;
    color: #000;
    font-family: 'Pretendard', sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: color 0.3s ease, font-weight 0.3s ease;

    &:hover {
        color: #006AC1;
        font-weight: bold;
    }
`;

// Styled-components 정의
const ContainerWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const OutlineContainer = styled.div`
    position: relative; 
    height: 80vh;
    width: 70vw;
    justify: flex-start;
    margin-top: 30px;
    border: 2px solid #EEE; 
    box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 4px;
    border-radius: 10px;
    padding: 20px 40px 20px 40px;
    min-width: 1000px;
`;

const Container = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: center;
    margin-top: 90px;
    gap: 20px;
`;

const ImageWrapper = styled.div``;

const ChatContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const ChatBubble = styled.div`
    background-color: rgb(248, 249, 250);
    box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 4px;
    border-radius: 15px;
    padding: 10px 15px;
    width: 50vw;
    max-width: 40vw;
    height: 20vh;
    position: relative;
    overflow-y: auto;
    overflow-x: hidden;
    margin-left: ${({ align }) => (align === 'left' ? '-50px' : '50px')};
    margin-${({ align }) => (align === 'left' ? 'bottom' : 'top')}: 20px;
    flex-shrink: 0;
    &::after {
        content: '';
        position: absolute;
        top: 50%;
        ${({ align }) => (align === 'left' ? 'left: -16px;' : 'right: -16px;')}
        border-${({ align }) => (align === 'left' ? 'right' : 'left')}: 16px solid #ffffff;
        border-top: 10px solid transparent;
        border-bottom: 10px solid transparent;
        transform: translateY(-50%);
    }
`;

const TextareaField = styled.textarea`
    width: 100%;
    height: 100%;
    border: none;
    outline: none;
    background-color: rgb(248, 249, 250);
    font-family: 'Pretendard', sans-serif;
    font-size: 18px;
    padding: 10px;
    border-radius: 15px;
    resize: none;
    overflow-y: auto;
`;

const ButtonContainer = styled.div`
    position: absolute;
    right: 20px; 
    bottom: 20px; 
    display: flex;
    justify-content: flex-end;
    align-items: center;
`;

export default ResultCheck;
