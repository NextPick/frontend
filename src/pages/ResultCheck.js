import React, { useEffect, useState } from 'react';
import { useHeaderMode } from '../hooks/HeaderManager';
import { useNavigate, useLocation } from 'react-router-dom';
import Box from '../components/Box';
import Font from '../components/Font';
import styled from 'styled-components';
import Button from '../components/Button';
import AiCoach from '../assets/AiCoach.png'; // 이미지 파일 import
import correctImage from '../assets/correctImage.png'; // 이미지 파일 import
import incorrectImage from '../assets/incorrectImage.png'; // 이미지 파일 import
import axios from 'axios';

const ResultCheck = () => {
    const { setHeaderMode } = useHeaderMode();
    const navigate = useNavigate();
    const location = useLocation();
    const { questionListId, userResponse, selectedSubcategory, correct } = location.state || {};
    const [correctAnswer, setCorrectAnswer] = useState('정답을 불러오고 있습니다...');
    const [correctRate, setCorrectRate] = useState('N/L');

    // 기본 카테고리 BE와 하위 카테고리 초기화
    const [selectedCategory, setSelectedCategory] = useState(''); // 선택된 상위 카테고리 상태 (기본값 BE)

    useEffect(() => {
        setHeaderMode('main');
    }, [setHeaderMode]);

    useEffect(() => {
        if (questionListId) {
            // API 요청으로 정답과 정답률 가져오기
            axios.get(`${process.env.REACT_APP_API_URL}/questions/${questionListId}`)
                .then(response => {
                    const data = response.data.data;
                    console.log(data);
                    setCorrectAnswer(data.answer || '정답을 불러올 수 없습니다.');
                    setCorrectRate(data.correctRate ? `${data.correctRate}%` : '0%');
                    // questionIdController();
                })
                .catch(error => {
                    console.error('정답을 가져오는 중 오류 발생:', error);
                    setCorrectAnswer('정답을 불러올 수 없습니다.');
                    setCorrectRate('정답률을 불러올 수 없습니다.');
                });
        }
    }, [questionListId]);

    const handleStartInterviewClick = () => {
        // 선택된 카테고리 및 하위 카테고리를 state로 전달하며 페이지 이동
        navigate('/aiInterview', { state: { selectedCategory, selectedSubcategory } });
    };

    // New handler for "그만풀기" button
    const handleQuitClick = () => {
        navigate('/resultpage');
    };

    return (
        <ContainerWrapper>
            <Box
                height="90vh"
                width="70vw"
                border="none"
                alignItems="flex-start"
                justify="flex-start"
            >
                <Font
                    font="PretendardM"
                    size="27px"
                    color="#000000"
                    margintop="5px"
                    spacing="2px"
                    paddingleft="13px"
                    paddingtop="5px"
                    marginbottom="8px"
                >
                    정답확인
                </Font>

                <ContentContainer>
                    <ImageWrapper>
                        <img
                            src={correct ? correctImage : incorrectImage}
                            alt="Result"
                            style={{ width: '330px', height: '430px', marginLeft: "-80px" }}
                        />
                    </ImageWrapper>
                    <DetailsWrapper>
                        <AnswerContainer>
                            <Font
                                font="PretendardL"
                                size="24px"
                                color="#000000"
                                margintop="5px"
                                spacing="2px"
                                paddingleft="0px"
                                paddingtop="5px"
                                marginbottom="8px"
                            >
                                정답
                            </Font>
                            <Font
                                font="PretendardL"
                                size="22px"
                                color="#000000"
                                margintop="5px"
                                spacing="2px"
                                paddingleft="0px"
                                paddingtop="5px"
                                marginbottom="8px"
                            >
                                정답률 {correctRate}
                            </Font>
                        </AnswerContainer>
                        <QuestionBubble>
                            <Font font="PretendardM" size="18px" color="#000000">
                                {correctAnswer || '정답을 불러오고 있습니다..'}
                            </Font>
                        </QuestionBubble>
                        <Font
                            font="PretendardL"
                            size="20px"
                            color="#000000"
                            margintop="5px"
                            spacing="2px"
                            paddingleft="0px"
                            paddingtop="5px"
                            marginbottom="8px"
                        >
                            내가 대답한 답
                        </Font>
                        <ResponseBubble>
                            {/* 인풋 필드 추가 */}
                            <InputField
                                type="text"
                                value={userResponse || '대답하지 못하였습니다.'}
                                readOnly
                                placeholder="사용자 대답을 불러오고 있습니다.." // 기본 텍스트 추가
                            />
                        </ResponseBubble>
                    </DetailsWrapper>
                </ContentContainer>

                {/* 버튼과 마이크 이미지를 수평으로 정렬하기 위한 컨테이너 추가 */}
                <ButtonContainer>
                    <Button
                        width="170px"
                        height="50px"
                        fontsize="22px"
                        radius="15px"
                        color="#f4fdff"
                        style={{ marginLeft: '10px' }} // 버튼 간의 간격
                        onClick={handleStartInterviewClick} // 클릭 핸들러 추가
                    >
                        다음문제풀기
                    </Button>
                    <Button
                        width="170px"
                        height="50px"
                        fontsize="22px"
                        radius="15px"
                        color="#f4fdff"
                        style={{ marginLeft: '10px' }} // 버튼 간의 간격
                        onClick={handleQuitClick} // Added onClick handler
                    >
                        그만풀기
                    </Button>
                </ButtonContainer>
            </Box>
        </ContainerWrapper>
    );
};

// Styled-components 정의
const ContainerWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const ContentContainer = styled.div`
    display: flex;
    align-items: flex-start; /* 수직 정렬을 시작으로 설정 */
    margin-top: 90px; /* 필요에 따라 여백 조정 */
`;

const ImageWrapper = styled.div`
    /* 추가적인 스타일이 필요하면 여기에 작성 */
`;

const DetailsWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-left: 10px;
    margin-top: -10px;
`;

const AnswerContainer = styled.div`
    display: flex;
    justify-content: space-between; /* 자식 요소 사이의 간격을 동일하게 */
    width: 100%; /* 부모 요소의 전체 너비 사용 */
    margin-top: 10px; /* 필요 시 여백 조정 */
`;

const QuestionBubble = styled.div`
    background-color: #ffffff;
    border-radius: 15px;
    padding: 10px 15px;
    width: 32vw;
    height: 20vh;
    max-width: 40vw;
    margin-bottom: 15px;
    margin-left: -30px;
    position: relative;
    overflow-y: auto; /* 스크롤 가능하도록 설정 */
    overflow-x: hidden;

    &::after {
        content: '';
        position: absolute;
        top: 50%;
        left: -16px;
        border-right: 16px solid #ffffff;
        border-top: 10px solid transparent;
        border-bottom: 10px solid transparent;
        transform: translateY(-50%);
    }

    /* 내부 텍스트 크기 조정 */
    font-size: 16px;
`;

const ResponseBubble = styled.div`
    background-color: #ffffff;
    border-radius: 15px;
    padding: 10px 15px;
    width: 32vw;
    height: 20vh;
    margin-bottom: 20px;
    margin-left: -5px;
    position: relative;
    overflow-y: auto; /* 스크롤 가능하도록 설정 */
    overflow-x: hidden;

    &::after {
        content: '';
        position: absolute;
        top: 50%;
        right: -16px;
        border-left: 16px solid #FFFFFF;
        border-top: 10px solid transparent;
        border-bottom: 10px solid transparent;
        transform: translateY(-50%);
    }

    /* 내부 텍스트 크기 조정 */
    font-size: 16px;
`;

// 인풋 필드를 위한 styled-component 정의
const InputField = styled.input`
    width: 100%; /* 인풋 필드 너비를 말풍선 너비에 맞추기 */
    height: 100%; /* 말풍선 높이에 맞추기 */
    border: none; /* 테두리 제거 */
    outline: none; /* 포커스 시 테두리 제거 */
    font-family: 'PretendardM', sans-serif; /* 폰트 설정 */
    font-size: 18px; /* 폰트 크기 */
    padding: 10px; /* 패딩 추가 */
    border-radius: 15px; /* 둥근 모서리 */
    background-color: transparent; /* 배경 투명 */
`;

// 버튼과 마이크 이미지를 수평으로 정렬하기 위한 styled-component
const ButtonContainer = styled.div`
    display: flex;
    align-items: center;  /* 수직 정렬을 가운데로 설정 */
    margin-top: 45px;  /* 필요 시 여백 조정 */
`;

export default ResultCheck;
