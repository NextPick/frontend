import React, { useEffect, useState, useRef } from 'react';
import { useHeaderMode } from '../hooks/HeaderManager';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Box from '../components/Box';
import '../styles/login.css';
import Button from '../components/Button';
import Font from '../components/Font';
import styled from 'styled-components';
import defaultProfile from '../assets/img-non-login.png';
import { useProfile } from '../hooks/ProfileContext'; // 프로필 컨텍스트
import { useMember } from '../hooks/MemberManager'; // 회원 정보를 관리하는 훅
import Line from '../components/Line';
import { FaStar } from 'react-icons/fa'; // 별점 표시를 위한 react-icons


const ProfileImgArea = styled.div`
justify-content: center;
padding: 10px;
display: flex; // 플렉스 박스 설정
    align-items: flex-start; // 이미지가 박스 시작 부분에 정렬되도록 설정
`;


const ProfileImage = styled.img`
    width: 50px; // 원하는 너비
    height: 50px; // 원하는 높이
    object-fit: cover; // 이미지 크기를 유지하며 잘림
    border-radius: 50%; // 원하는 경우 둥글게 만들기
    cursor: pointer; // 커서를 포인터로 변경
`;
const ReviewContainer = styled.div`
    width: 100%; // 박스 너비
    display: flex; // 수평 정렬을 위한 flex 설정
    overflow-x: auto; // 수평 스크롤 가능하도록 설정
    scroll-snap-type: x mandatory; // 스크롤 스냅 설정
    scrollbar-width: none; // 스크롤바 숨기기 (Firefox)
    -ms-overflow-style: none; // 스크롤바 숨기기 (Internet Explorer, Edge)

    &::-webkit-scrollbar {
        display: none; // 스크롤바 숨기기 (WebKit)
    }
`;
const ReviewSlide = styled.div`
      flex: 0 0 auto; // 너비를 고정하여 수평으로 나열되도록 설정
    padding: 2px;
    text-align: center; // 텍스트 중앙 정렬
    width: 12vw; // 각 슬라이드의 너비
    scroll-snap-align: start; // 스크롤 스냅 정렬
    background-color: aliceblue;
    border: 1px solid #3F8CEC;
    border-radius: 6px;
    margin-left: 10px;
    font-family: 강원교육튼튼L;
    font-size: 10px;
    display: flex; // 플렉스 박스 설정
    flex-direction: column; // 수직 정렬
    justify-content: center; // 수직 중앙 정렬
    align-items: center; // 수평 중앙 정렬
    height: 28vh; // 슬라이드의 높이를 지정하여 중앙 정렬이 가능하도록 함
     // 스크롤을 위한 설정
     max-height: 38vh; // 슬라이드의 최대 높이를 지정
    overflow-y: auto; // 수직 스크롤 활성화
    padding-right: 5px; // 스크롤바 여백
`;


// 마우스 휠 이벤트 핸들러
const handleWheel = (event) => {
    event.preventDefault(); // 기본 스크롤 이벤트 방지
    event.currentTarget.scrollBy({
        left: event.deltaY, // 마우스 휠 방향에 따라 수평으로 스크롤
        behavior: 'smooth', // 부드럽게 스크롤
    });
};


const FeedbackT = () => {
    const { profileUrl, setProfileUrl, nickname, email } = useMember();
    const { headerMode, setHeaderMode } = useHeaderMode();
    const navigate = useNavigate();
    const location = useLocation();
    const fileInputRef = useRef(null); // 파일 입력을 참조할 ref 생성
    const [activeTab, setActiveTab] = useState('answer'); // 탭 상태를 관리
    // 리뷰 관련 상태
    const [reviews, setReviews] = useState([]); // 리뷰 데이터를 저장할 상태
    const [averageScore, setAverageScore] = useState(0); // 평균 별점을 저장할 상태

    // 백 연결하기전 mock 리뷰 데이터를 기반으로 평균 별점 계산
    useEffect(() => {
        setHeaderMode('main');

        const mockData = [
            { userName: 'User1', score: 4, userComment: 'Great!' },
            { userName: 'User2', score: 5, userComment: 'Excellent!' },
            { userName: 'User3', score: 3, userComment: 'Good, but can improve. 룰루 냐옹 서연이 코드침 오늘 너무 바쁨 흐규흐규 라면 냥냥 글자 100글자로 Not what I expected. I was hoping for more guidance and support. ' },
        ];
        setReviews(mockData);
        // 평균 별점 계산
        const totalScore = mockData.reduce((acc, curr) => acc + curr.score, 0);
        const average = totalScore / mockData.length;
        setAverageScore(average.toFixed(1)); // 소수점 첫째 자리로 고정
    }, [setHeaderMode]);

    const handleImageClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };


    const handleButtonClick = (path) => {
        navigate(path); // 이동할 페이지
    };


    // 프로필 이미지를 변경하는 함수
    const changeProfileImg = (event) => {
        const file = event.target.files && event.target.files[0]; // 안전하게 접근

        if (file) {
            const reader = new FileReader(); // FileReader를 사용하여 파일을 읽습니다.
            reader.onloadend = () => {
                setProfileUrl(reader.result); // 읽은 결과를 프로필 URL로 설정합니다.
            };
            reader.readAsDataURL(file); // 파일을 데이터 URL로 읽습니다.
        }
    };


    return (
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start' }}>
            <Box
                height="65vh"
                width="17vw"
                border="none"
                alignItems="flex-start"
                justify="flex-start"
            >
                <ProfileImgArea>
                    <ProfileImage
                        src={profileUrl ? profileUrl : defaultProfile}
                        alt="Profile"
                        onClick={handleImageClick}
                    />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={changeProfileImg}
                        ref={fileInputRef} // ref 설정
                        style={{ display: 'none' }} // 파일 입력 숨기기
                    />
                </ProfileImgArea>
                <Font font="PretendardL" size="6.4px" color="#000000" marginbottom="2px">{nickname || '닉네임'}</Font>
                <Font font="PretendardL" size="5px" color="#A4A5A6" marginbottom="3px">{email || '이메일'}</Font>
                <Line
                ></Line>


                <Button
                    color="transparent"
                    width="20vw"
                    textcolor="#000000"
                    height="25px"
                    hoverColor="#ffffff"
                >
                    <Font
                        font="PretendardL"
                        size="10px"
                        color="#000000"
                        align="center"
                        margintop="0px"
                        paddingtop="7px"
                    >
                        프로필
                    </Font>
                </Button>

                <Link to="/mynote" style={{ textDecoration: 'none' }}>
                    <Button
                        color="transparent"
                        width="20vw"
                        textcolor="#000000"
                        height="25px"
                        hoverColor="#ffffff"
                        onClick={() => handleButtonClick('/mynote')}
                    >
                        <Font
                            font="PretendardL"
                            size="10px"
                            color="#000000"
                            align="center"
                            margintop="0px"
                            paddingtop="7px"
                        >
                            정답 / 오답노트
                        </Font>
                    </Button>
                </Link>

                <Link to="/feedback" style={{ textDecoration: 'none' }}>
                    <Button
                        color="transparent"
                        width="20vw"
                        textcolor="#000000"
                        height="25px"
                        hoverColor="#ffffff"
                        onClick={() => handleButtonClick('/feedbackT')}
                    >
                        <Font
                            font="PretendardL"
                            size="10px"
                            color="#000000"
                            align="center"
                            margintop="0px"
                            paddingtop="7px"
                        >
                            받은 피드백
                        </Font>
                    </Button>
                </Link>


                <Button
                    color="transparent"
                    width="20vw"
                    textcolor="#000000"
                    height="25px"
                    hoverColor="#ffffff"
                    onClick={() => handleButtonClick('/cash')}
                >
                    <Font
                        font="PretendardL"
                        size="10px"
                        color="#000000"
                        align="center"
                        margintop="0px"
                        paddingtop="7px"
                    >
                        결제관리
                    </Font>
                </Button>
                <Line
                    marginbottom="10px"
                ></Line>
                <Button
                    color="transparent"
                    width="20vw"
                    textcolor="#000000"
                    height="25px"
                    hoverColor="#ffffff"
                >
                    <Font
                        font="PretendardL"
                        size="10px"
                        color="#A4A5A6"
                        align="center"
                        margintop="0px"
                        paddingtop="7px"
                    >
                        로그아웃
                    </Font>
                </Button>
            </Box>

            <Box
                height="65vh"
                width="35vw"
                border="none"
                left="20px"
                justify="flex-start"
                direction="column"
                alignitem="center"
                padding="0px"
                style={{ display: 'flex' }} // 자식 박스에서 정렬
            >
                <div style={{ alignSelf: 'flex-start'}}>
                    <Font
                        font="PretendardL"
                        size="10px"
                        color="#000000"
                        margintop="0px"
                        paddingtop="7px"
                        spacing="2px"
                        paddingleft="13px"
                    >
                        멘토 평점
                    </Font>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <ProfileImgArea>
                        <ProfileImage
                            src={profileUrl ? profileUrl : defaultProfile}
                            alt="Profile"
                            onClick={handleImageClick}
                        />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={changeProfileImg}
                            ref={fileInputRef} // ref 설정
                            style={{ display: 'none' }} // 파일 입력 숨기기
                        />
                    </ProfileImgArea>
                    {/* 별점 및 평점 수직 정렬 */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginLeft: '10px' }}>
                        <span style={{ marginBottom: '10px', fontFamily: "함박눈" }}>{averageScore} / 5</span> {/* 평균 평점 */}
                        <div style={{ display: 'flex' }}> {/* 별점을 가로로 나열 */}
                            {Array.from({ length: 5 }, (_, i) => (
                                <FaStar
                                    key={i}
                                    size={14}
                                    color={i < Math.round(averageScore) ? '#FFD700' : '#e4e5e9'} // 별점 채우기
                                />
                            ))}
                        </div>
                    </div>
                </div>
               
                    <div style={{ alignSelf: 'flex-start'}}>
                        <Font
                            font="PretendardL"
                            size="10px"
                            color="#000000"
                            margintop="0px"
                            paddingtop="7px"
                            spacing="2px"
                            paddingleft="13px"
                        >
                            받은 피드백
                        </Font>
                    </div>
                    <div>
                </div>

                {/* 슬라이더를 추가하는 부분 */}
                <ReviewContainer onWheel={handleWheel}>
                    {reviews.map((review, index) => (
                        <ReviewSlide key={index}>
                            <div>{review.userName}</div>
                            <div>{review.score}점</div>
                            <div>{review.userComment}</div>
                        </ReviewSlide>
                    ))}
                </ReviewContainer>
            </Box>
        </div>
    );
}

export default FeedbackT;