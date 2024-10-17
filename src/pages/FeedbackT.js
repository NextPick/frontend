import React, { useEffect, useState, useRef } from 'react';
import { useHeaderMode } from '../hooks/HeaderManager';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Box from '../components/Box';
import '../styles/login.css';
import Font from '../components/Font';
import styled from 'styled-components';
import defaultProfile from '../assets/img-non-login.png';
import { useMember } from '../hooks/MemberManager'; // 회원 정보를 관리하는 훅
import { FaStar } from 'react-icons/fa'; // 별점 표시를 위한 react-icons
import ReviewForm from '../components/ReviewForm ';
import MypageSide from '../components/MypageSide';
import { Modal, Button as ModalButton } from 'react-bootstrap'; // Modal 컴포넌트 추가
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap 스타일 추가
import axios from 'axios';
import Swal from 'sweetalert2';



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
    display: flex; // 플렉스 박스 설정
    flex-direction: column; // 수직 정렬을 위한 플렉스 방향 설정
    overflow-y: auto; // 수직 스크롤 가능하도록 설정
    max-height: 400px; // 원하는 최대 높이 설정 (조정 가능)
    scrollbar-width: none; // 스크롤바 숨기기 (Firefox)
    -ms-overflow-style: none; // 스크롤바 숨기기 (Internet Explorer, Edge)

    &::-webkit-scrollbar {
        display: none; // 스크롤바 숨기기 (WebKit)
    }
`;



const ReviewCard = styled.div`
  width: 100%;
  height: 110px;
  background-color: #f0f8ff;
  border: 1px solid #3f8cec;
  border-radius: 6px;
  display: flex;
  font-family: 강원교육튼튼L;
  font-size: 20px;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
    
  &:hover {
    background-color: #e0f0ff;
  }
`;

// 모달 창 스타일
const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  font-family: PretendardL;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const PaginationButton = styled.button`
  background-color: #3f8cec;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 15px;
  margin: 0 5px;
  cursor: pointer;
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const FeedbackT = () => {
    const { profileUrl, setProfileUrl, nickname, email } = useMember();
    const { headerMode, setHeaderMode } = useHeaderMode();
    const [filteredReviews, setFilteredReviews] = useState([]);
    const fileInputRef = useRef(null); // 파일 입력을 참조할 ref 생성
    const [reviews, setReviews] = useState([]); // 리뷰 데이터를 저장할 상태
    const [averageScore, setAverageScore] = useState(0); // 평균 별점을 저장할 상태
    const [showModal, setShowModal] = useState(false);
    const [page, setPage] = useState(1); // 현재 페이지
    const [size] = useState(10); // 한 페이지에 표시할 항목 수
    const [totalPages, setTotalPages] = useState(1); // 총 페이지 수
    const [selectedReview, setSelectedReview] = useState(null);




    useEffect(() => {
        setHeaderMode('main');

        // 피드백 데이터 가져오는 함수
        const fetchFeedback = () => {
            const headers = {
                Authorization: localStorage.getItem('accessToken'),
            };

            axios.get(`${process.env.REACT_APP_API_URL}mentor/feedback?page=${page}&size=${size}`, { headers })
                .then(response => {
                    console.log(response.data); // 여기에 추가하여 응답 데이터 확인
                    if (response.status === 200) {
                        const feedbackData = response.data.data;
                        setReviews(response.data.data); // 피드백 데이터를 저장
                        setFilteredReviews(response.data.data); // 처음에는 모든 리뷰를 보여줌
                        setTotalPages(response.data.pageInfo.totalPages); // 총 페이지 수 저장
                        // 평균 별점 계산
                        const totalRating = feedbackData.reduce((sum, review) => sum + review.startRating, 0);
                        const average = feedbackData.length > 0 ? totalRating / feedbackData.length : 0; // 0으로 나누는 것을 방지
                        setAverageScore(average); // 평균 점수 업데이트
                    } else {
                        console.error('피드백 데이터를 가져오는 데 실패했습니다:', response.status);
                    }
                })
                .catch(error => {
                    console.error('피드백 데이터를 요청하는 중 오류가 발생했습니다:', error);
                    Swal.fire({
                        text: `피드백 데이터를 불러오는 중 오류가 발생했습니다.`,
                        icon: 'error',
                        confirmButtonText: '확인',
                    });
                });
        };

        fetchFeedback();
    }, [setHeaderMode, page]); // 페이지가 변경될 때마다 데이터를 다시 가져옴

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

    // 페이지네이션 버튼 핸들러
    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setPage(newPage);
        }
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

    // 모달창을 여는 함수
    const handleReviewClick = (review) => {
        setSelectedReview(review);
        setShowModal(true);
    };

    // 모달창을 닫는 함수
    const handleCloseModal = () => setShowModal(false);


    return (
        <Container>
            <MypageSide />
            <Box
                color="#e7f0f9"
                height="90%"
                width="35vw"
                border="none"
                left="20px"
                justify="space-between"
                direction="column"
                alignitem="center"
                padding="0px"
                style={{ display: 'flex' }} // 자식 박스에서 정렬
            >
                <div style={{ alignSelf: 'flex-start' }}>
                    <Font
                        font="Pretendard"
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
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginLeft: '25px' }}>
                        <span style={{ marginBottom: '10px', fontFamily: "함박눈", fontSize: "30px" }}>{averageScore.toFixed(1)} / 5</span> {/* 평균 평점 */}
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
                    <Font font="Pretendard" size="25px" color="#000000" margintop="0px" paddingtop="15px" spacing="2px" paddingleft="13px">
                        받은 피드백
                    </Font>
                </div>



                <ReviewContainer>
                    {filteredReviews.map((review, index) => (
                        <ReviewCard key={index} onClick={() => handleReviewClick(review)}>
                            <div style={{ padding: '10px' }}>
                                <Font font='강원교육튼튼L' size="10px" color="#A1A1A1" margintop="5px" spacing="2px">
                                    날짜: {review.createdAt} {/* createdAt 날짜 표시 */}
                                </Font>
                                <Font font='강원교육튼튼L' size="14px" color="#000000" margintop="5px" spacing="2px">
                                    피드백: {review.content} {/* content를 사용하여 피드백 내용 표시 */}
                                </Font>
                            </div>
                        </ReviewCard>
                    ))}
                </ReviewContainer>

                {/* 페이지네이션 버튼 */}
                <PaginationContainer>
                    <PaginationButton onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
                        이전
                    </PaginationButton>
                    <span style={{ marginTop: '9px' }} >{page} / {totalPages}</span>
                    <PaginationButton onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}>
                        다음
                    </PaginationButton>
                </PaginationContainer>


                {/* 모달 창 */}
                <Modal show={showModal} onHide={handleCloseModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>리뷰 상세보기</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <ModalContent>
                            <Font font="PretendardB" size="20px" color="#3f8cec" marginbottom="5px">
                                {selectedReview?.userName || '익명'} {/* userName이 없을 경우 '익명'으로 표시 */}
                            </Font>
                            <Font font="PretendardL" size="20px" color="#000000" margintop="5px">
                                피드백: {selectedReview?.content} {/* content를 사용하여 피드백 내용 표시 */}
                            </Font>
                            <Font font="PretendardL" size="20px" color="#000000" margintop="5px">
                                점수: {selectedReview?.startRating || 'N/A'} {/* startRating 점수를 표시 */}
                            </Font>
                            <Font font="PretendardL" size="10px" color="#A1A1A1" margintop="5px" spacing="2px">
                                날짜: {selectedReview?.createdAt} {/* createdAt 날짜 표시 */}
                            </Font>
                        </ModalContent>
                    </Modal.Body>
                    <Modal.Footer>
                        <ModalButton variant="secondary" onClick={handleCloseModal}>
                            닫기
                        </ModalButton>
                    </Modal.Footer>
                </Modal>
            </Box>
        </Container>
    );
}

export default FeedbackT;