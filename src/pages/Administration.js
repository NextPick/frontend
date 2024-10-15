import React, { useEffect, useState, useRef } from 'react';
import { useHeaderMode } from '../hooks/HeaderManager';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Box from '../components/Box';
import '../styles/login.css';
import Button from '../components/Button';
import Font from '../components/Font';
import styled from 'styled-components';
import defaultProfile from '../assets/img-non-login.png';
import { useMember } from '../hooks/MemberManager'; // 회원 정보를 관리하는 훅
import Line from '../components/Line';
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap 스타일 추가
import AdminpageSide from '../components/AdminpageSide';



// Styled Components
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 100px;
  background-color: #FFF;
  height: 100vh;
  font-family: Arial, sans-serif;
`;

// 수락 거절박스 css
const RequestBox = styled.div`
    margin-bottom: 1px;
    border: 1px solid #91a7c1;
    border-radius: 8px;
    width: 100%;
    height: 45px; // 요청 박스의 높이 조정
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
    const { headerMode, setHeaderMode } = useHeaderMode();
    const navigate = useNavigate();
    const [reviews, setReviews] = useState([]); // 리뷰 데이터를 저장할 상태
    const [requests, setRequests] = useState([]); // 요청 데이터를 저장할 상태


    useEffect(() => {
        setHeaderMode('main');

        const mockRequests = [
            { id: 1, userName: 'RequestUser1', content: '멘토가입 요청 1' },
            { id: 2, userName: 'RequestUser2', content: '멘토가입 요청 2' }
        ];
        setRequests(mockRequests);
    }, [setHeaderMode]);


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
        <Container>
           <AdminpageSide/>
            <Box
                height="73vh"
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
            </Container>
    );
}

export default Administration;