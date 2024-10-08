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
import SearchBar from '../components/SearchBar';
import search from '../assets/search.png'
import { Modal, Button as ModalButton } from 'react-bootstrap'; // Modal 컴포넌트 추가
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap 스타일 추가




const ReviewContainer = styled.div`
    display: flex;
    flex-wrap: wrap; /* 가로로 나열하고, 공간 부족 시 다음 줄로 넘어가도록 */
    width: 100%;
    padding: 10px;
    gap: 10px;
    padding-right: 5px; // 스크롤바 여백
    overflow-y: auto; // 수직 스크롤 활성화
    scroll-snap-type: x mandatory; // 스크롤 스냅 설정
    scrollbar-width: none; // 스크롤바 숨기기 (Firefox)
    -ms-overflow-style: none; // 스크롤바 숨기기 (Internet Explorer, Edge)

    &::-webkit-scrollbar {
        display: none; // 스크롤바 숨기기 (WebKit)
    }
`;

const ReviewCard = styled.div`
    width: 250px;
    height: 25px;
    background-color: #f0f8ff;
    border: 1px solid #3f8cec;
    border-radius: 6px;
    display: flex;
    font-family: 강원교육튼튼L;
    font-size: 10px;
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



const FeedbackS = () => {
    const { profileUrl, setProfileUrl, nickname, email } = useMember();
    const { headerMode, setHeaderMode } = useHeaderMode();
    const navigate = useNavigate();
    const location = useLocation();
    const fileInputRef = useRef(null); // 파일 입력을 참조할 ref 생성
    const [activeTab, setActiveTab] = useState('searchbar'); // 탭 상태를 관리
    const [reviews, setReviews] = useState([]); // 리뷰 데이터를 저장할 상태
    const [selectedReview, setSelectedReview] = useState(null); // 선택된 리뷰를 저장할 상태
    const [showModal, setShowModal] = useState(false); // 모달창 표시 상태
    const [averageScore, setAverageScore] = useState(0); // 평균 별점을 저장할 상태
    const [searchTerm, setSearchTerm] = useState(''); // 검색어 상태 관리
    const [filteredReviews, setFilteredReviews] = useState([]); // 검색 결과를 저장할 상태

    

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

    const handleImageClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click(); // 클릭 시 파일 입력 트리거
        }
    };



    // 탭에 따라 표시할 콘텐츠를 정의
    const renderTabContent = () => {
        if (activeTab === 'searchbar') {
            return (
                <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ alignSelf: 'flex-start' }}>
                        <Font
                            font="PretendardL"
                            size="10px"
                            color="#000000"
                            margintop="5px"
                            spacing="2px"
                            paddingleft="13px"
                            paddingtop="5px"
                            marginbottom="2px"
                        >
                            받은 피드백
                        </Font>
                    </div>
                    <SearchBar
                        height="15px"
                        width="30vw"
                        padding="8px"
                        top="0px"
                        value={searchTerm} // 검색어 상태를 입력 필드에 바인딩
                        onChange={(e) => handleSearch(e.target.value)} // 입력이 변경될 때 필터링 함수 호출
                    >
                        <Button
                            color="transparent"
                            radius="5px"
                            hoverColor="#FFFFFF"
                        >
                            <img src={search} alt="search" style={{ width: '18px', height: '20px' }} />
                        </Button>
                    </SearchBar>
                </div>
            );
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
               {/* SearchBar와 피드백 제목을 추가한 부분 */}
    <div style={{ marginBottom: '5px',width: '100%'  }}>
        <Font
            font="PretendardL"
            size="10px"
            color="#000000"
            margintop="1px"
            spacing="2px"
            paddingleft="13px"
            paddingtop="5px"
            marginbottom="8px"
        >
            받은 피드백
        </Font>
        </div>
        <SearchBar
            value={searchTerm} // 검색어 상태를 입력 필드에 바인딩
            onChange={(e) => handleSearch(e.target.value)} // 입력이 변경될 때 필터링 함수 호출
            left="8px"
       >
            <Button
                color="transparent"
                radius="5px"
                hoverColor="#FFFFFF"
            >
                <img src={search} alt="search" style={{ width: '18px', height: '20px' }} />
            </Button>
        </SearchBar>


                <ReviewContainer>
                    {filteredReviews.map((review, index) => (
                          <ReviewCard key={index} onClick={() => handleReviewClick(review)}>
                          <div style={{ padding: '10px' }}>
                              <Font font="PretendardB" size="12px" color="#3f8cec">
                                  {review.userName}
                              </Font>
                              <Font font="PretendardL" size="10px" color="#A1A1A1" margintop="5px" spacing="2px">
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
                            <Font font="PretendardB" size="14px" color="#3f8cec">
                                {selectedReview?.userName}
                            </Font>
                            <Font font="PretendardL" size="12px" color="#000000" margintop="5px">
                                점수: {selectedReview?.score}
                            </Font>
                            <Font font="PretendardL" size="12px" color="#000000" margintop="5px">
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
        </div>
    );
}

export default FeedbackS;