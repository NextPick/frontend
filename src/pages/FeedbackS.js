import React, { useEffect, useState, useRef } from 'react';
import { useHeaderMode } from '../hooks/HeaderManager';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Box from '../components/Box';
import '../styles/login.css';
import Button from '../components/Button';
import Font from '../components/Font';
import styled from 'styled-components';
import { useMember } from '../hooks/MemberManager'; // 회원 정보를 관리하는 훅
import SearchBar from '../components/SearchBar';
import search from '../assets/search.png'
import { Modal, Button as ModalButton } from 'react-bootstrap'; // Modal 컴포넌트 추가
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap 스타일 추가
import MypageSide from '../components/MypageSide';
import axios from 'axios';
import Swal from 'sweetalert2';



// Styled Components
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 100px;
  background-color: #FFF;
  height: 100vh;
  font-family: Arial, sans-serif;
`;


const ReviewContainer = styled.div`
    display: flex;
    flex-wrap: wrap; /* 가로로 나열하고, 공간 부족 시 다음 줄로 넘어가도록 */
    width: 100%;
    padding: 10px;
    gap: 10px;
    margin-top: 20px;
    overflow-y: auto; // 수직 스크롤 활성화
    scroll-snap-type: x mandatory; // 스크롤 스냅 설정
    scrollbar-width: none; // 스크롤바 숨기기 (Firefox)
    -ms-overflow-style: none; // 스크롤바 숨기기 (Internet Explorer, Edge)

    &::-webkit-scrollbar {
        display: none; // 스크롤바 숨기기 (WebKit)
    }
`;

const ReviewCard = styled.div`
    width: 100%;
    height: 80px;
    background-color: #f0f8ff;
    border: 1px solid #3f8cec;
    border-radius: 6px;
    display: flex;
    font-family: 강원교육튼튼L;
    font-size: 20px;
    flex-direction: column;
    justify-content: space-between;
    cursor: pointer;
    overflow: hidden; /* 박스 안에서 넘치는 내용을 숨깁니다 */
    text-overflow: ellipsis; /* 넘치는 텍스트에 ... 처리 */
    white-space: nowrap; /* 텍스트가 한 줄로 유지되도록 설정 */
    
    &:hover {
        background-color: #e0f0ff; /* 마우스 오버 효과 */
    }
`;

// 모달 창 스타일
const ModalContent = styled.div`
    display: flex;
    flex-direction: column;
    padding: 20px;
    font-family: PretendardL;
`;




const FeedbackS = () => {
    const { type, setType } = useMember();
    const { headerMode, setHeaderMode } = useHeaderMode();
    const navigate = useNavigate();
    const location = useLocation();
    const [reviews, setReviews] = useState([]); // 리뷰 데이터를 저장할 상태
    const [selectedReview, setSelectedReview] = useState(null); // 선택된 리뷰를 저장할 상태
    const [showModal, setShowModal] = useState(false); // 모달창 표시 상태
    const [searchTerm, setSearchTerm] = useState(''); // 검색어 상태 관리
    const [filteredReviews, setFilteredReviews] = useState([]); // 검색 결과를 저장할 상태
    const [memberType, setMemberType] = useState();


    const handleButtonClick = (path) => {
        navigate(path); // 이동할 페이지
    };


    useEffect(() => {
        setHeaderMode('main');

        const mockData = [
            { userName: 'User1', score: 4, userComment: 'Great!' },
            { userName: 'User2', score: 5, userComment: 'Excellent!' },
            { userName: 'User3', score: 3, userComment: 'Good, but can improve. 룰루 냐옹 서연이 코드침 오늘 너무 바쁨 흐규흐규 라면 냥냥 글자 100글자로 Not what I expected. I was hoping for more guidance and support. ' },
            { userName: 'User1', score: 4, userComment: 'Great!' },
            { userName: 'User2', score: 5, userComment: 'Excellent!' },
            { userName: 'User1', score: 4, userComment: 'Great!' },
            { userName: 'User2', score: 5, userComment: 'Excellent!' },
        ];
        setReviews(mockData);
        setFilteredReviews(mockData); // 처음에는 모든 리뷰를 보여줌
    }, [setHeaderMode]);


    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('http://localhost:8080/members', {
                    headers: {
                        Authorization: localStorage.getItem('accessToken'), // 토큰을 헤더에 추가
                    },
                });
                if (response.status === 200) {
                    const userType = response.data.data.type; // 사용자 타입 가져오기
                    setMemberType(userType); // 멤버 타입 설정
                    setType(userType); // 회원 정보 타입 설정

                    // 멘토일 경우 피드백 페이지로 리다이렉션
                    if (userType === 'MENTOR') {
                        navigate('/feedbackT'); // 멘토 피드백 페이지로 이동
                    }
                } else {
                    console.error('사용자 정보를 가져오는 데 실패했습니다.');
                }
            } catch (error) {
                console.error('네트워크 오류:', error);
                Swal.fire({
                    text: `네트워크 오류가 발생했습니다. 인터넷 연결을 확인해 주세요.`,
                    icon: 'error',
                    confirmButtonText: '확인'
                });
            }
        };

        fetchUserData(); // 사용자 정보 가져오기 호출
    }, [setHeaderMode, setType, navigate]); // 빈 배열을 전달하여 컴포넌트 마운트 시 한 번만 실행

    // 모달창을 여는 함수
    const handleReviewClick = (review) => {
        setSelectedReview(review);
        setShowModal(true);
    };

    // 모달창을 닫는 함수
    const handleCloseModal = () => setShowModal(false);




    // 검색어에 따라 리뷰를 필터링하는 함수
    const handleSearch = (value) => {
        setSearchTerm(value);
        if (value === '') {
            setFilteredReviews(reviews); // 검색어가 없으면 모든 리뷰를 보여줌
        } else {
            const filtered = reviews.filter(review =>
                review.userComment.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredReviews(filtered);
        }
    };



    // 멘티일 때만 피드백 S 페이지 내용 보여주기
    if (memberType === 'MENTEE') {
        return (
            <Container>
                <MypageSide />
                <Box
                    height="100%"
                    width="35vw"
                    border="none"
                    left="20px"
                    justify="flex-start"
                    direction="column"
                    alignitem="center"
                    padding="0px"
                    color="#e7f0f9"
                    style={{ display: 'flex' }} // 자식 박스에서 정렬
                >
                    {/* SearchBar와 피드백 제목을 추가한 부분 */}
                    <div style={{ marginBottom: '5px', width: '100%' }}>
                        <Font
                            font="PretendardL"
                            size="25px"
                            color="#000000"
                            margintop="15px"
                            spacing="2px"
                            paddingleft="15px"
                            paddingtop="5px"
                            marginbottom="-5px"
                        >
                            받은 피드백
                        </Font>
                    </div>
                    <SearchBar
                        value={searchTerm} // 검색어 상태를 입력 필드에 바인딩
                        onChange={(e) => handleSearch(e.target.value)} // 입력이 변경될 때 필터링 함수 호출
                        left="9px"
                        top="20px"
                    >
                    </SearchBar>


                    <ReviewContainer>
                        {filteredReviews.map((review, index) => (
                            <ReviewCard key={index} onClick={() => handleReviewClick(review)}>
                                <div style={{ padding: '10px' }}>
                                    <Font font="PretendardB" size="15px" color="#3f8cec">
                                        {review.userName}
                                    </Font>
                                    <Font font="PretendardL" size="15px" color="#A1A1A1" margintop="5px" spacing="2px">
                                        점수: {review.score}
                                    </Font>
                                    <Font font="PretendardL" size="10px" color="#000000" margintop="5px" spacing="2px">
                                        {review.userComment}
                                    </Font>
                                </div>
                            </ReviewCard>
                        ))}
                    </ReviewContainer>

                    {/* 모달 창 */}
                    <Modal show={showModal} onHide={handleCloseModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>리뷰 상세보기</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <ModalContent>
                                <Font font="PretendardB" size="20px" color="#3f8cec" marginbottom="5px" >
                                    {selectedReview?.userName}
                                </Font>
                                <Font font="PretendardL" size="15px" color="#000000" margintop="0px" paddingbottom="10px">
                                    점수: {selectedReview?.score}
                                </Font>
                                <Font font="PretendardL" size="20px" color="#000000" margintop="5px">
                                    {selectedReview?.userComment}
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

    // 멘토일 경우에는 아무것도 렌더링하지 않거나 리다이렉션 처리
    return null; // 또는 다른 내용을 반환할 수 있습니다.
}

export default FeedbackS;