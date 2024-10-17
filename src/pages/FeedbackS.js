import React, { useEffect, useState } from 'react';
import { useHeaderMode } from '../hooks/HeaderManager';
import Box from '../components/Box';
import '../styles/login.css';
import Font from '../components/Font';
import styled from 'styled-components';
import SearchBar from '../components/SearchBar';
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
  flex-wrap: wrap;
  width: 100%;
  padding: 10px;
  height: 47vh;
  gap: 10px;
  margin-top: 20px;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
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

const FeedbackS = () => {
    const { headerMode, setHeaderMode } = useHeaderMode();
    const [reviews, setReviews] = useState([]);
    const [filteredReviews, setFilteredReviews] = useState([]);
    const [selectedReview, setSelectedReview] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1); // 현재 페이지
    const [size] = useState(10); // 한 페이지에 표시할 항목 수
    const [totalPages, setTotalPages] = useState(1); // 총 페이지 수

    useEffect(() => {
        setHeaderMode('main');

        // 피드백 데이터 가져오는 함수
        const fetchFeedback = () => {
            const headers = {
                Authorization: localStorage.getItem('accessToken'),
            };

            axios.get(`${process.env.REACT_APP_API_URL}mentee/feedback?page=${page}&size=${size}`, { headers })
                .then(response => {
                    console.log(response.data); // 여기에 추가하여 응답 데이터 확인
                    if (response.status === 200) {
                        const feedbackData = response.data.data;
                        setReviews(response.data.data); // 피드백 데이터를 저장
                        setFilteredReviews(response.data.data); // 처음에는 모든 리뷰를 보여줌
                        setTotalPages(response.data.pageInfo.totalPages); // 총 페이지 수 저장
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
                (review.content && review.content.toLowerCase().includes(value.toLowerCase())) || // 피드백 내용
                (review.createdAt && review.createdAt.toLowerCase().includes(value.toLowerCase())) // 작성 날짜
            );
            setFilteredReviews(filtered);
        }
    };

    // 페이지네이션 버튼 핸들러
    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

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
                color="#fff"
                border="0.5px solid #ccc"
                style={{ display: 'flex' }}
            >
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
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    left="9px"
                    top="20px"
                />

                <ReviewContainer>
                    {filteredReviews.map((review, index) => (
                        <ReviewCard key={index} onClick={() => handleReviewClick(review)}>
                            <div style={{ padding: '10px' }}>

                                <Font font="PretendardL" size="14px" color="#A1A1A1" margintop="5px" spacing="2px">
                                    날짜: {review.createdAt} {/* createdAt 날짜 표시 */}
                                </Font>
                                <Font font="PretendardL" size="20px" color="#000000" margintop="5px" spacing="2px">
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

                            <Font font="PretendardL" size="15px" color="#A1A1A1" margintop="5px" spacing="2px">
                                날짜: {selectedReview?.createdAt} {/* createdAt 날짜 표시 */}
                            </Font>
                            <Font font="PretendardL" size="20px" color="#000000" margintop="5px">
                                피드백: {selectedReview?.content} {/* content를 사용하여 피드백 내용 표시 */}
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

export default FeedbackS;
