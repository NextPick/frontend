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
import one from '../assets/one.png';
import two from '../assets/two.png';
import three from '../assets/three.png';
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

const MenuItem = styled.p`
  padding: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;
  background-color: ${({ active }) => (active ? '#137df696' : 'transparent')};
  color: ${({ active }) => (active ? '#ffffff' : '#000')};

  &:hover {
    background-color: #0077ff96;
    color: #ffffff;
  }
`;

const LogoutButton = styled.button`
  border: none;
  background-color: transparent;
  color: #333;
  cursor: pointer;
  margin-top: 20px;
`;

const ProfileImgArea = styled.div`
justify-content: center;
margin-top: 10px;
padding: 3px;
display: flex; // 플렉스 박스 설정
    align-items: flex-start; // 이미지가 박스 시작 부분에 정렬되도록 설정
`;


const ProfileImage = styled.img`
    width: 70px; // 원하는 너비
    height: 70px; // 원하는 높이
    object-fit: cover; // 이미지 크기를 유지하며 잘림
    border-radius: 50%; // 원하는 경우 둥글게 만들기
    cursor: pointer; // 커서를 포인터로 변경
    margin: 0 auto;
`;


const Menu = styled.div`
  margin-top: 20px;
  text-align: center;
  margin-bottom: 20px;
  font-size: 16px;
  width: 100%;
`;

const Mypage = () => {
    const { profileUrl, setProfileUrl, nickname,  setNickname,  email,  setEmail } = useMember();
    const { headerMode, setHeaderMode } = useHeaderMode();
    const navigate = useNavigate();
    const location = useLocation();
    const fileInputRef = useRef(null); // 파일 입력을 참조할 ref 생성
    const [isActive, setIsActive] = useState(false); // 상태 정의


    useEffect(() => {
        setHeaderMode('main');
        fetchUserData(); // 컴포넌트가 마운트될 때 사용자 정보 가져오기
    }, [setHeaderMode]);


    const fetchUserData = async () => {
        try {
            const response = await axios.get('http://localhost:8080/members', {
                headers: {
                    Authorization: localStorage.getItem('accessToken'), // 토큰을 헤더에 추가
                },
            });
            if (response.status === 200) {
                const { email } = response.data; // 이메일만 가져오기
                setEmail(email);
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
        <Container>
            <Box
                height="100%"
                width="250px"
                padding="20px"
                border="none"
                alignItems="flex-start"
                justify="flex-start"
                textalign="center"
                color="#e7f0f9"
                radius="15px"
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
                <Font font="Pretendard" size="18px" color="#000000" marginbottom="1px">{nickname || '닉네임'}</Font>
                <Font font="Pretendard" size="145x" color="#A4A5A6" marginbottom="3px">{email || '이메일'}</Font>
                <Line
                    margintop="5px"
                ></Line>
                <Menu>
                    <MenuItem>마이페이지</MenuItem>
                    <MenuItem active>정답/오답노트</MenuItem>
                    <MenuItem>받은 피드백</MenuItem>
                    <MenuItem>결제관리</MenuItem>
                </Menu>
                <Line
                    marginbottom="10px"
                ></Line>
                <LogoutButton>로그아웃</LogoutButton>
            </Box>
            <Box
                padding="0px"
                height="50%"
                width="33vw"
                border="none"
                color="#f1f7fd"
                justify="space-between"
                radius="15px"
                left="20px"
            >
                <Box
                    height="7vh"
                    width="33vw"
                    border="none"
                    alignitem="flex-start"
                    justify="flex-start"
                    top="none"
                    color="#0372f33a"
                >
                    <Font
                        font="PretendardB"
                        size="18px"
                        color="#000000"
                        margintop="0px"
                        marginbottom="0px"
                        paddingtop="9px"
                        marginleft="10px"
                        spacing="3px"
                    >
                        내 프로필
                    </Font>
                </Box>

                <div style={{ display: 'flex', alignItems: 'center', marginRight: "auto", marginLeft: "5px", marginBottom: "-5px" }}> {/* 수평 정렬을 위한 flexbox */}
                    <img src={one} alt="one" style={{ width: '33px', height: '34px' }} /> {/* 로고 이미지 */}
                    <Font
                        font="PretendardL"
                        size="16px"
                        color="#000000"
                        align="center"
                        marginbottom="0px"
                        margintop="none"
                        justify="center"
                        marginleft="10px"
                    >
                        이름
                    </Font>
                </div>
                <div class="line2"></div>

                <div style={{ display: 'flex', alignItems: 'center', marginRight: "auto", marginLeft: "5px", marginBottom: "-5px" }}> {/* 수평 정렬을 위한 flexbox */}
                    <img src={two} alt="two" style={{ width: '33px', height: '34px' }} /> {/* 로고 이미지 */}
                    <Font
                        font="PretendardL"
                        size="16px"
                        color="#000000"
                        align="center"
                        marginbottom="0px"
                        margintop="none"
                        justify="center"
                        marginleft="10px"
                    >
                        번호
                    </Font>
                </div>
                <div class="line2"></div>

                <div style={{ display: 'flex', alignItems: 'center', marginRight: "auto", marginLeft: "5px", marginBottom: "-5px" }}> {/* 수평 정렬을 위한 flexbox */}
                    <img src={three} alt="three" style={{ width: '33px', height: '34px' }} /> {/* 로고 이미지 */}
                    <Font
                        font="PretendardL"
                        size="16px"
                        color="#000000"
                        align="center"
                        marginbottom="0px"
                        margintop="none"
                        marginleft="10px"
                        justify="center"
                    >
                        이메일
                    </Font>
                </div>
                <div class="line2"></div>
                <Button
                    color="transparent"
                    width="158px"
                    textcolor="#000000"
                    height="35px"
                    hoverColor="#ffffff"
                    margintop="-6px"
                    paddingtop="7px"
                    align="none"
                    justify="none"
                    left="auto"
                    margintbottom="10px"
                    marginright="5px"
                >
                    <Font
                        font="PretendardL"
                        size="14px"
                        color="#000000"
                        align="center"
                        marginbottom="0px"
                        margintop="none"
                        justify="center"
                    >
                        회원정보 수정하러가기 →
                    </Font>
                </Button>
            </Box>
        </Container>
    );
}

export default Mypage;