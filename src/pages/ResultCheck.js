import React, { useEffect, useState } from 'react';
import { useHeaderMode } from '../hooks/HeaderManager';
import { useNavigate, useLocation } from 'react-router-dom';
import Box from '../components/Box';
import Font from '../components/Font';
import styled from 'styled-components';
import Button from '../components/Button';
import Ai코치 from '../assets/Ai코치.png'; // 이미지 파일 import
import 정답확인캐릭터 from '../assets/정답확인캐릭터.png'; // 이미지 파일 import
import axios from 'axios';

const ResultCheck = () => {
    const { setHeaderMode } = useHeaderMode();
    const navigate = useNavigate();
    const location = useLocation();
    const { questionListId, userResponse } = location.state || {};
    const [correctAnswer, setCorrectAnswer] = useState('정답을 불러오고 있습니다...');
    const [correctRate, setCorrectRate] = useState('N/L');

    // 기본 카테고리 BE와 하위 카테고리 초기화
    const [selectedCategory, setSelectedCategory] = useState('BE'); // 선택된 상위 카테고리 상태 (기본값 BE)
    const [selectedSubcategory, setSelectedSubcategory] = useState(null); // 선택된 하위 카테고리 상태
    // const [userResponse, setUserResponse] = useState(''); // 사용자의 대답 상태

    useEffect(() => {
        setHeaderMode('main');
    }, [setHeaderMode]);

    useEffect(() => {
        // 초기화 시 하위 카테고리 기본 선택 메시지 설정
        setSelectedSubcategory(null); // 하위 카테고리는 초기화
    }, []); // 컴포넌트가 마운트될 때만 실행

    useEffect(() => {
        if (questionListId) {
            // API 요청으로 정답과 정답률 가져오기
            axios.get(`http://localhost:8080/questions/${questionListId}`)
                .then(response => {
                    const data = response.data.data;
                    setCorrectAnswer(data.answer || '정답을 불러올 수 없습니다.');
                    setCorrectRate(data.correctRate ? `${data.correctRate}%` : '0%');
                })
                .catch(error => {
                    console.error('정답을 가져오는 중 오류 발생:', error);
                    setCorrectAnswer('정답을 불러올 수 없습니다.');
                    setCorrectRate('정답률을 불러올 수 없습니다.');
                });
        }
    }, [questionListId]);

    const handleCategoryClick = (categoryName) => {
        if (selectedCategory === categoryName) {
            setSelectedCategory(null); // 이미 선택된 카테고리를 다시 클릭하면 하위 카테고리 숨기기
            setSelectedSubcategory(null); // 하위 카테고리 선택 초기화
        } else {
            setSelectedCategory(categoryName); // 다른 카테고리를 클릭하면 선택된 카테고리 변경
            setSelectedSubcategory(null); // 하위 카테고리 선택 초기화
        }
    };

    const handleSubcategoryClick = (subcategory) => {
        setSelectedSubcategory(subcategory); // 선택된 하위 카테고리 상태 업데이트
    };

    // 예시 질문과 답변 처리 (실제 로직에 맞게 수정 필요)
    const exampleQuestion = "오늘 기분이 어떠신가요?";

    // 인풋 변화 처리
    // const handleInputChange = (event) => {
    //     setUserResponse(event.target.value);
    // };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
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

                <Container>
                    <img src={정답확인캐릭터} alt="Ai" style={{ width: '330px', height: '430px', marginLeft: "-80px" }} />
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginLeft: '10px', marginTop:'-10px' }}>
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
                                // onChange={handleInputChange}
                                placeholder="사용자 대답을 불러오고 있습니다.." // 기본 텍스트 추가
                            />
                        </ResponseBubble>
                    </div>
                </Container>

                {/* 버튼과 마이크 이미지를 수평으로 정렬하기 위한 컨테이너 추가 */}
                <MicrophoneContainer>
                    <Button
                        width="170px"
                        height="50px"
                        fontsize="22px"
                        radius="15px"
                        marginleft="40vw"
                        color="#f4fdff"
                        style={{ marginLeft: '10px' }} // 버튼과 마이크 간의 간격
                    >
                        다음문제풀기
                    </Button>
                    <Button
                        width="170px"
                        height="50px"
                        fontsize="22px"
                        radius="15px"
                        marginleft="1vw"
                        color="#f4fdff"
                        style={{ marginLeft: '10px' }} // 버튼과 마이크 간의 간격
                    >
                        그만풀기
                    </Button>
                </MicrophoneContainer>
            </Box>
        </div>
    );
};

// Styled-components 정의
const MicrophoneContainer = styled.div`
    display: flex;
    align-items: center;  /* 수직 정렬을 가운데로 설정 */
    margin-top: 45px;  /* 필요 시 여백 조정 */
`;

const Container = styled.div`
    display: flex;
    align-items: flex-start; /* 수직 정렬을 시작으로 설정 */
    margin-top: 90px; /* 필요에 따라 여백 조정 */
`;

const QuestionBubble = styled.div`
    background-color: #ffffff; /* 말풍선 배경 색상 */
    border-radius: 15px;
    padding: 10px 15px; /* 패딩 조정 */
    width: 32vw; /* 말풍선 최대 너비 */
    height: 20vh;
    max-width: 40vw;
    margin-bottom: 15px;
    margin-left: -30px;
    position: relative; /* 자식 요소의 위치 설정을 위한 */

    &::after {
        content: '';
        position: absolute;
        top: 50%; /* 말풍선 중앙에 위치 */
        left: -16px; /* 왼쪽에 위치하도록 설정 */
        border-right: 16px solid #ffffff; /* 말풍선 배경 색상 */
        border-top: 10px solid transparent; /* 투명한 부분 */
        border-bottom: 10px solid transparent; /* 투명한 부분 */
        transform: translateY(-50%); /* 수직 중앙 정렬 */
    }
`;

const ResponseBubble = styled.div`
    background-color: #ffffff; /* 말풍선 배경 색상 */
    border-radius: 15px;
    padding: 10px 15px; /* 패딩 조정 */
    width: 32vw; /* 말풍선 최대 너비 */
    height: 20vh;
    margin-bottom: 20px;
    margin-left: -5px;
    position: relative; /* 자식 요소의 위치 설정을 위한 */

    &::after {
        content:'';
        position:absolute;
        top:50%;
        right:-16px;
        border-left:16px solid #FFFFFF;
        border-top:10px solid transparent;
        border-bottom:10px solid transparent;
        transform:translateY(-50%);
    }
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
`;

// 정답과 정답률을 수평으로 정렬하기 위한 styled-component
const AnswerContainer = styled.div`
    display: flex;
    justify-content: space-between; /* 자식 요소 사이의 간격을 동일하게 */
    width: 100%; /* 부모 요소의 전체 너비 사용 */
    margin-top: 10px; /* 필요 시 여백 조정 */
`;

export default ResultCheck;
