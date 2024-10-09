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
import { Modal, Button as ModalButton } from 'react-bootstrap'; // Modal 컴포넌트 추가
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap 스타일 추가
import plusbutton from '../assets/plusbutton.png'
import Input from '../components/Input'




// Styled SelectBox 컴포넌트
const StyledSelect = styled.select`
    padding: 3px;
    font-size: 6px;
    border: 2px solid #526f8d; // 보더 색상
    border-radius: 5px; // 둥근 모서리
    background-color: #f8f9fa; // 배경 색상
    color: #495057; // 글자 색상
    transition: border-color 0.3s;

    &:focus {
        outline: none; // 기본 포커스 아웃라인 제거
        border-color: #0056b3; // 포커스 시 보더 색상 변경
    }

    &:hover {
        border-color: #0056b3; // 호버 시 보더 색상 변경
    }

    // 옵션 스타일
    option {
        padding: 10px;
    }
`;


const ReviewContainer = styled.div`
    display: flex;
    flex-wrap: wrap; /* 가로로 나열하고, 공간 부족 시 다음 줄로 넘어가도록 */
    width: 100%;
    padding: 7px;
    gap: 6px;
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



const AdminPageInterview = () => {
    const { profileUrl, setProfileUrl, nickname, email } = useMember();
    const { headerMode, setHeaderMode } = useHeaderMode();
    const navigate = useNavigate();
    const location = useLocation();
    const fileInputRef = useRef(null); // 파일 입력을 참조할 ref 생성
    const [searchTerm, setSearchTerm] = useState(''); // 검색어 상태 관리
    const [filteredReviews, setFilteredReviews] = useState([]); // 검색 결과를 저장할 상태
    const [selectedReview, setSelectedReview] = useState(null); // 선택된 리뷰를 저장할 상태
    const [reviews, setReviews] = useState([]); // 리뷰 데이터를 저장할 상태
    const [showModal, setShowModal] = useState(false); // 모달창 표시 상태
    const [showAddModal, setShowAddModal] = useState(false); // 리뷰 추가 모달 상태
    const [showDetailModal, setShowDetailModal] = useState(false); // 리뷰 상세 모달 상태
    const [sortOption, setSortOption] = useState('latest'); // 기본 정렬: 최신순


    const sortReviews = (reviews, option) => {
        const sortedReviews = [...reviews]; // 원본 배열을 복사하여 정렬
        switch (option) {
            case 'accuracyHigh':
                return sortedReviews.sort((a, b) => b.score - a.score); // 정답률 높은순
            case 'accuracyLow':
                return sortedReviews.sort((a, b) => a.score - b.score); // 정답률 낮은순
            case 'latest':
            default:
                return sortedReviews.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded)); // 최신순
        }
    };

    const [newReview, setNewReview] = useState({
        questionName: '',
        questionBody: '',
        accuracy: ''
    });


    const SelectBox = ({ value, onChange, options = [] }) => {
        return (
            <StyledSelect value={value} onChange={onChange}>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </StyledSelect >
        );
    };

    const handleButtonClick = (path) => {
        navigate(path); // 이동할 페이지
    };

    useEffect(() => {
        setHeaderMode('main');

        const mockData = [
            { userName: 'User1', score: 4, userComment: 'Great!' },
            { userName: 'User2', score: 5, userComment: 'Excellent!' }
        ];
        setReviews(mockData);
        // 정렬 기준에 따라 정렬
        const sortedData = sortReviews(mockData, sortOption);
        setFilteredReviews(sortedData); // 정렬된 리뷰를 보여줌
    }, [setHeaderMode, sortOption]);


    // 추가 모달 열기
    const handleShowAddModal = () => {
        setShowAddModal(true);
    };


    const handleReviewClick = (review) => {
        setSelectedReview(review); // 선택한 리뷰를 저장
        setShowDetailModal(true);   // 상세 모달 열기
    };


    const handleCloseAddModal = () => {
        setShowAddModal(false);
    };

    const handleCloseDetailModal = () => {
        setShowDetailModal(false);
    };

    // 검색어에 따라 리뷰를 필터링하는 함수
    const handleSearch = (value) => {
        setSearchTerm(value);
        if (value === '') {
            setFilteredReviews(reviews); // 검색어가 없으면 모든 리뷰를 보여줌
        } else {
            const filtered = reviews.filter(review =>
                typeof review.userName === 'string' && review.userName.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredReviews(filtered);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewReview(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSaveReview = () => {
        const updatedReviews = [
            ...reviews,
            {
                userName: newReview.questionName,
                score: newReview.accuracy,
                userComment: newReview.questionBody,
                dateAdded: new Date().toLocaleDateString()  // 현재 날짜 추가
            }
        ];
        setReviews(updatedReviews);
        setFilteredReviews(updatedReviews);
        setNewReview({ questionName: '', questionBody: '', accuracy: '' });
        setShowModal(false); // 일반 모달 닫기
        setShowAddModal(false); // 추가 모달 닫기
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
                        서비스 이용비율
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
                            면접질문 관리
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
                            멘토가입 신청관리
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
                        사용자 신고목록 관리
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
                <div style={{ marginBottom: '5px', width: '100%', display: 'flex', alignItems: 'center' }}>
                    <Font
                        font="PretendardL"
                        size="10px"
                        color="#000000"
                        margintop="5px"
                        spacing="2px"
                        paddingleft="13px"
                        paddingtop="5px"
                        marginbottom="8px"
                    >
                        면접질문 관리
                    </Font>
                    <Button
                        color="transparent"
                        radius="5px"
                        hoverColor="#FFFFFF"
                        onClick={handleShowAddModal} // 버튼 클릭 시 검색 실행
                        fontsize="none"
                        padding="3px"
                        scale={1} // 원하는 확대 비율
                        height="16px"

                    >
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <img src={plusbutton} alt="plusbotton" style={{ width: '13px', height: '13px' }} />
                        </div>
                    </Button>

                    {/* 셀렉트 박스가 오른쪽에 위치하도록 변경 */}
                    <div style={{ marginLeft: 'auto', paddingRight: "17px" }}> {/* margin-left: auto; 추가 */}
                        <SelectBox
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                            options={[
                                { value: 'latest', label: '최신순' },
                                { value: 'accuracyHigh', label: '정답률 높은순' },
                                { value: 'accuracyLow', label: '정답률 낮은순' }
                            ]}
                        />
                    </div>
                </div>
                <SearchBar
                    value={searchTerm} // 검색어 상태를 입력 필드에 바인딩
                    onChange={(e) => handleSearch(e.target.value)} // 입력이 변경될 때 필터링 함수 호출
                    left="9px"
                >
                </SearchBar>


                <Box
                    height="42vh"
                    width="30vw"
                    border="none"
                    justify="flex-start"
                    direction="column"
                    alignitem="center"
                    padding="0px"
                    style={{ display: 'flex' }} // 자식 박스에서 정렬
                >
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

                    {/* 추가 모달 */}
                    <Modal show={showAddModal} onHide={handleCloseAddModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>새 면접 질문 추가</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <ModalContent>
                                <Input
                                    name="questionName"
                                    placeholder="문제명"
                                    value={newReview.questionName}
                                    onChange={handleChange}
                                />
                                <Input
                                    name="questionBody"
                                    placeholder="문제 본문"
                                    value={newReview.questionBody}
                                    onChange={handleChange}
                                />
                                <Input
                                    name="accuracy"
                                    placeholder="정답률"
                                    value={newReview.accuracy}
                                    onChange={handleChange}
                                />
                            </ModalContent>
                        </Modal.Body>
                        <Modal.Footer>
                            <ModalButton variant="secondary" onClick={handleCloseAddModal}>닫기</ModalButton>
                            <ModalButton variant="primary" onClick={handleSaveReview}>추가</ModalButton>
                        </Modal.Footer>
                    </Modal>

                    {/* 상세 모달 */}
                    <Modal show={showDetailModal} onHide={handleCloseDetailModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>{selectedReview?.userName}의 리뷰</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div>
                                <p><strong>점수:</strong> {selectedReview?.score}</p>
                                <p><strong>내용:</strong> {selectedReview?.userComment}</p>
                                <p><strong>추가된 날짜:</strong> {selectedReview?.dateAdded}</p> {/* 추가된 날짜 표시 */}
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <ModalButton variant="secondary" onClick={handleCloseDetailModal}>닫기</ModalButton>
                        </Modal.Footer>
                    </Modal>

                </Box>
            </Box>
        </div>
    );
}

export default AdminPageInterview;