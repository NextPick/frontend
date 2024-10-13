import React, { useEffect, useState } from 'react';
import { useHeaderMode } from '../hooks/HeaderManager';
import { useNavigate } from 'react-router-dom';
import Box from '../components/Box';
import Font from '../components/Font';
import styled from 'styled-components';
import Button from '../components/Button';
import Ai코치 from '../assets/Ai코치.png'; // 이미지 파일 import
import mic from '../assets/mic.png'; // 이미지 파일 import

const AiInterview = () => {
    const { setHeaderMode } = useHeaderMode();
    const navigate = useNavigate();

    // 기본 카테고리 BE와 하위 카테고리 초기화
    const [selectedCategory, setSelectedCategory] = useState('BE'); // 선택된 상위 카테고리 상태 (기본값 BE)
    const [selectedSubcategory, setSelectedSubcategory] = useState(null); // 선택된 하위 카테고리 상태
    const [userResponse, setUserResponse] = useState(''); // 사용자의 대답 상태

    useEffect(() => {
        setHeaderMode('main');
    }, [setHeaderMode]);

    useEffect(() => {
        // 초기화 시 하위 카테고리 기본 선택 메시지 설정
        setSelectedSubcategory(null); // 하위 카테고리는 초기화
    }, []); // 컴포넌트가 마운트될 때만 실행

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
    const handleInputChange = (event) => {
        setUserResponse(event.target.value);
    };

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
                    AI코치가 묻는 질문에 마이크를 켜고 대답해주세요
                </Font>

                <Container>
                    <img src={Ai코치} alt="Ai" style={{ width: '360px', height: '400px', marginLeft: "20px" }} />
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginLeft: '10px' }}>
                        <QuestionBubble>
                            <Font font="PretendardM" size="18px" color="#000000">
                                {exampleQuestion}
                            </Font>
                        </QuestionBubble>
                        <ResponseBubble>
                            {/* 인풋 필드 추가 */}
                            <InputField 
                                type="text" 
                                value={userResponse} 
                                onChange={handleInputChange}
                                placeholder="대답을 입력하세요..." // 기본 텍스트 추가
                            />
                        </ResponseBubble>
                    </div>
                </Container>

                {/* 버튼과 마이크 이미지를 수평으로 정렬하기 위한 컨테이너 추가 */}
                <MicrophoneContainer>
                    <Button
                        color="#FFFFFF"
                    >
                        <img src={mic} alt="Mic" style={{ width: '35px', height: '40px' }} />
                    </Button>
                    <Font
                        font="PretendardM"
                        size="15px"
                        color="#000000"
                        margintop="5px"
                        spacing="2px"
                        paddingleft="13px"
                        paddingtop="5px"
                        marginbottom="8px"
                    >
                        마이크를 눌러 대답을 시작하세요
                    </Font>
                    <Button
                        width="130px"
                        height="50px"
                        fontsize="27px"
                        radius="15px"
                        marginleft="33vw"
                        color="#f4fdff"
                        style={{ marginLeft: '10px' }} // 버튼과 마이크 간의 간격
                    >
                        제출하기
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
    margin-top: 70px;  /* 필요 시 여백 조정 */
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
    margin-bottom: 20px;
    margin-left: -90px;
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
    margin-left: -40px;
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

export default AiInterview;
