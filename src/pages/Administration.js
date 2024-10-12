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
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap 스타일 추가

// 수락 거절박스 css
const RequestBox = styled.div`
    margin-bottom: 1px;
    border: 1px solid #91a7c1;
    border-radius: 8px;
    width: 100%;
    height: 42px; // 요청 박스의 높이 조정
    display: flex;
    align-items: center; // 수직 중앙 정렬
    justify-content: space-between; // 텍스트는 왼쪽, 버튼은 오른쪽에 배치
    padding: 10px; // 좌우 여백 추가
`;

const TextContainer = styled.div`
    flex-grow: 1; // 텍스트가 있는 컨테이너가 공간을 차지하도록 설정
`;

const ButtonContainer = styled.div`
    display: flex;
    gap: 10px; // 버튼 간의 간격 조정
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

const Administration = () => {
    const { profileUrl, setProfileUrl, nickname, email } = useMember();
    const { headerMode, setHeaderMode } = useHeaderMode();
    const navigate = useNavigate();
    const location = useLocation();
    const fileInputRef = useRef(null); // 파일 입력을 참조할 ref 생성
    const [reviews, setReviews] = useState([]); // 리뷰 데이터를 저장할 상태
    const [requests, setRequests] = useState([]); // 요청 데이터를 저장할 상태

    const handleButtonClick = (path) => {
        navigate(path); // 이동할 페이지
    };

    useEffect(() => {
        setHeaderMode('main');

        const mockRequests = [
            { id: 1, userName: 'RequestUser1', content: '멘토가입 요청 1' },
            { id: 2, userName: 'RequestUser2', content: '멘토가입 요청 2' }
        ];
        setRequests(mockRequests);
    }, [setHeaderMode]);


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


    const handleAcceptRequest = (id) => {
        // 요청 수락 로직
        console.log('Accepted request with id:', id);
        setRequests(prevRequests => prevRequests.filter(request => request.id !== id));
    };

    const handleDeclineRequest = (id) => {
        // 요청 거절 로직
        console.log('Declined request with id:', id);
        setRequests(prevRequests => prevRequests.filter(request => request.id !== id));
    };


    return (
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start' }}>
            <Box
                height="70vh"
                width="16vw"
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
                <Font font="PretendardL" size="20px" color="#000000" marginbottom="1px">{nickname || '닉네임'}</Font>
                <Font font="PretendardL" size="185x" color="#A4A5A6" marginbottom="3px">{email || '이메일'}</Font>
                <Line
                    margintop="10px"
                ></Line>


                <Button
                    color="transparent"
                    width="17vw"
                    textcolor="#000000"
                    height="54px"
                    hoverColor="#ffffff"
                    margintbottom="2px"
                >
                    <Font
                        font="PretendardL"
                        size="23px"
                        color="#000000"
                        align="center"
                        paddingtop="6px"
                    >
                        서비스 이용비율
                    </Font>
                </Button>

                <Link to="/mynote" style={{ textDecoration: 'none' }}>
                    <Button
                        color="transparent"
                        width="17vw"
                        textcolor="#000000"
                        height="54px"
                        hoverColor="#ffffff"
                        margintbottom="2px"
                        onClick={() => handleButtonClick('/mynote')}
                    >
                        <Font
                            font="PretendardL"
                            size="23px"
                            color="#000000"
                            align="center"
                            paddingtop="6px"
                        >
                            면접질문 관리
                        </Font>
                    </Button>
                </Link>

                <Link to="/feedback" style={{ textDecoration: 'none' }}>
                    <Button
                        color="transparent"
                        width="17vw"
                        textcolor="#000000"
                        height="54px"
                        hoverColor="#ffffff"
                        margintbottom="2px"
                        onClick={() => handleButtonClick('/feedbackT')}
                    >
                        <Font
                            font="PretendardL"
                            size="23px"
                            color="#000000"
                            align="center"
                            paddingtop="6px"
                        >
                            멘토가입 신청관리
                        </Font>
                    </Button>
                </Link>


                <Button
                    color="transparent"
                    width="17vw"
                    textcolor="#000000"
                    height="54px"
                    hoverColor="#ffffff"
                    margintbottom="2px"
                    onClick={() => handleButtonClick('/cash')}
                >
                    <Font
                        font="PretendardL"
                        size="23px"
                        color="#000000"
                        align="center"
                        paddingtop="6px"
                    >
                        사용자 신고목록 관리
                    </Font>
                </Button>
                <Line
                    marginbottom="14px"
                ></Line>
                <Button
                    color="transparent"
                    width="17vw"
                    textcolor="#000000"
                    height="54px"
                    hoverColor="#ffffff"
                >
                    <Font
                        font="PretendardL"
                        size="20px"
                        color="#A4A5A6"
                        align="center"
                        paddingtop="6px"
                        marginbottom="0px"
                    >
                        로그아웃
                    </Font>
                </Button>
            </Box>
            <Box
                height="70vh"
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
                        size="20px"
                        color="#000000"
                        margintop="5px"
                        spacing="2px"
                        paddingleft="13px"
                        paddingtop="5px"
                        marginbottom="8px"
                    >
                        멘토가입 신청관리
                    </Font>
                </div>
                <Box
                    height="55vh"
                    width="30vw"
                    border="none"
                    justify="flex-start"
                    direction="column"
                    alignitem="center"
                    padding="0px"
                    top="20px"
                    style={{ display: 'flex' }} // 자식 박스에서 정렬
                >

                    {requests.map((request) => (
                        <RequestBox key={request.id}>
                            <TextContainer>
                                <Font font="PretendardL" size="16px" color="#000000" margintop="15px" marginleft="17px">
                                    {request.userName}: {request.content}
                                </Font>
                            </TextContainer>
                            <ButtonContainer>
                                <Button
                                    height="4vh"
                                    width="5vw"
                                    border="none"
                                    radius="3px"
                                    color="#0372f396"
                                    padding="0px"
                                    onClick={() => handleAcceptRequest(request.id)}
                                >
                                    <Font
                                        font="PretendardB"
                                        size="15px"
                                        color="#000000"
                                        margintop="0px"
                                        paddingtop="1px"
                                        spacing="2px"
                                        align="center"
                                    >
                                        수락
                                    </Font>
                                </Button>
                                <Button
                                    height="4vh"
                                    width="5vw"
                                    border="none"
                                    radius="3px"
                                    color="#0372f396"
                                    padding="0px"
                                    onClick={() => handleAcceptRequest(request.id)}
                                >
                                    <Font
                                        font="PretendardB"
                                        size="15px"
                                        color="#000000"
                                        margintop="0px"
                                        paddingtop="1px"
                                        spacing="2px"
                                        align="center"
                                    >
                                        거절
                                    </Font>
                                </Button>
                            </ButtonContainer>
                        </RequestBox>
                    ))}
                </Box>
            </Box>
        </div>
    );
}

export default Administration;