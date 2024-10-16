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
import ReviewForm from '../components/ReviewForm ';
import MypageSide from '../components/MypageSide';




const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 100px;
  background-color: #FFF;
  height: 100vh;
  font-family: Arial, sans-serif;
`;


const ProfileImgArea = styled.div`
justify-content: center;
margin-top: 18px;
padding: 5px;
display: flex; // 플렉스 박스 설정
    align-items: flex-start; // 이미지가 박스 시작 부분에 정렬되도록 설정
`;


const ProfileImage = styled.img`
    width: 90px; // 원하는 너비
    height: 90px; // 원하는 높이
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


const FeedbackT = () => {
    const { profileUrl, setProfileUrl, nickname, email } = useMember();
    const { headerMode, setHeaderMode } = useHeaderMode();
    const navigate = useNavigate();
    const location = useLocation();
    const fileInputRef = useRef(null); // 파일 입력을 참조할 ref 생성
    const [reviews, setReviews] = useState([]); // 리뷰 데이터를 저장할 상태
    const [averageScore, setAverageScore] = useState(0); // 평균 별점을 저장할 상태

    useEffect(() => {
        setHeaderMode('main');
    }, [setHeaderMode]);

    const handleButtonClick = (path) => {
        navigate(path); // 이동할 페이지
    };


    const handleImageClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };
    // 리뷰 데이터를 추가하는 함수
    const handleReviewSubmit = (newReview) => {
        setReviews((prevReviews) => {
            const updatedReviews = [...prevReviews, newReview];
            // 평균 점수 계산
            const totalScore = updatedReviews.reduce((sum, review) => sum + review.score, 0);
            const average = totalScore / updatedReviews.length;
            setAverageScore(average); // 평균 점수 업데이트
            return updatedReviews;
        });
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
        <Container>
             <MypageSide/>
            <Box
             color="#e7f0f9"
                 height="100%"
                width="35vw"
                border="none"
                left="20px"
                justify="flex-start"
                direction="column"
                alignitem="center"
                padding="0px"
                style={{ display: 'flex' }} // 자식 박스에서 정렬
            >
                <div style={{ alignSelf: 'flex-start' }}>
                    <Font
                        font="PretendardL"
                        size="25px"
                        color="#000000"
                        margintop="0px"
                        paddingtop="15px"
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
                        <span style={{ marginBottom: '10px', fontFamily: "함박눈", fontSize:"30px"}}>{averageScore} / 5</span> {/* 평균 평점 */}
                        <div style={{ display: 'flex' }}> {/* 별점을 가로로 나열 */}
                            {Array.from({ length: 5 }, (_, i) => (
                                <FaStar
                                    key={i}
                                    size={40}
                                    color={i < Math.round(averageScore) ? '#FFD700' : '#e4e5e9'} // 별점 채우기
                                />
                            ))}
                        </div>
                    </div>
                </div>


                <div style={{ alignSelf: 'flex-start' }}>
                    <Font font="PretendardL" size="25px" color="#000000" margintop="0px" paddingtop="15px" spacing="2px" paddingleft="13px">
                        받은 피드백
                    </Font>
                </div>
                {/* 리뷰 목록 출력 */}
                {reviews.map((review, index) => (
                    <div key={index}>
                        <div>익명</div> {/* 익명 표시 */}
                        <div>{review.score}점</div>
                        <div>{review.userComment}</div>
                    </div>
                ))}

                {/* ReviewForm 컴포넌트 사용 */}
                <ReviewForm onSubmit={handleReviewSubmit} />
            </Box>
            </Container>
    );
}

export default FeedbackT;