import React, { useEffect, useRef, useState,  }  from 'react';
import '../styles/global.css';
import Line from './Line';
import Font from './Font';
import styled from 'styled-components';
import Box from './Box'
import defaultProfile from '../assets/img-non-login.png';
import { useMember } from '../hooks/MemberManager'; // 회원 정보를 관리하는 훅
import axios from 'axios';
// import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';


const ProfileImgArea = styled.div`
justify-content: center;
margin-top: 20px;
padding: 3px;
display: flex; // 플렉스 박스 설정
    align-items: flex-start; // 이미지가 박스 시작 부분에 정렬되도록 설정
`;


const ProfileImage = styled.img`
    width: 65px; // 원하는 너비
    height: 68px; // 원하는 높이
    object-fit: cover; // 이미지 크기를 유지하며 잘림
    border-radius: 50%; // 원하는 경우 둥글게 만들기
    cursor: pointer; // 커서를 포인터로 변경
    margin: 10 auto;
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
  font-family: '강원교육튼튼L';

  &:hover {
    background-color: #0077ff96;
    color: #ffffff;
  }
`;

const Menu = styled.div`
  margin-top: 20px;
  text-align: center;
  margin-bottom: 20px;
  font-size: 16px;
  font-family: '강원교육튼튼L';
  width: 100%;
`;




const MypageSide = () => {
    const { profileUrl, setProfileUrl, nickname,  setNickname,  email,  setEmail, type, setType } = useMember();
    const fileInputRef = useRef(null); // 파일 입력을 참조할 ref 생성
    const [activeMenu, setActiveMenu] = useState('마이페이지'); // 활성화된 메뉴 상태
    const navigate = useNavigate(); // navigate 정의

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(process.env.REACT_APP_API_URL + 'members', {
                    headers: {
                        Authorization: localStorage.getItem('accessToken'), // 토큰을 헤더에 추가
                    },
                });
                if (response.status === 200) {
                    const { email, nickname } = response.data.data; // 이메일과 닉네임 가져오기
                    setEmail(email); // 이메일 상태 업데이트
                    setNickname(nickname); // 닉네임 상태 업데이트
                    setType(type )
                } else {
                    console.error('사용자 정보를 가져오는 데 실패했습니다.');
                }
            } catch (error) {
                // console.error('네트워크 오류:', error);
                // Swal.fire({
                //     text: `네트워크 오류가 발생했습니다. 인터넷 연결을 확인해 주세요.`,
                //     icon: 'error',
                //     confirmButtonText: '확인'
                // });
            }
        };
  
        fetchUserData(); // 사용자 정보 가져오기 호출
    }, []); // 빈 배열을 전달하여 컴포넌트 마운트 시 한 번만 실행
  

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


const handleMypageClick = () => {
    handleMenuClick('마이페이지'); // 메뉴 클릭 처리
    navigate('/mypage'); // 마이페이지로 이동
};

const handleMynoteClick = () => {
    handleMenuClick('마이노트'); // 메뉴 클릭 처리
    navigate('/mynote'); // 마이페이지로 이동
};

const handleCashClick = () => {
    handleMenuClick('결제창'); // 메뉴 클릭 처리
    navigate('/cash'); // 마이페이지로 이동
};


    // 메뉴 항목 클릭 시 활성화 상태 변경
    const handleMenuClick = (menuName) => {
        setActiveMenu(menuName); // 클릭한 메뉴 이름을 활성화 상태로 설정
    };


    const handleFeedbackClick = () => {
        console.log('사용자 타입:', type); // 타입 확인
        if (type === 'MENTOR') {
            setActiveMenu('받은 피드백'); // 상태 설정
            navigate('/feedbackT'); // 멘토 타입일 경우 피드백 T 페이지로 이동
        } else if (type === 'MENTEE') {
            setActiveMenu('받은 피드백'); // 상태 설정
            navigate('/feedbackS'); // 멘티 타입일 경우 피드백 S 페이지로 이동
        } else {
            console.error('유효하지 않은 타입입니다.',  type); // 타입이 유효하지 않을 경우
        }
    };


  return (
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
                <Font font="Pretendard" size="20px" color="#000000" marginbottom="1px">{nickname || '닉네임'}</Font>
                <Font font="Pretendard" size="185x" color="#A4A5A6" marginbottom="3px">{email || '이메일'}</Font>
                <Line
                    margintop="10px"
                ></Line>
                <Menu>
                <MenuItem active={activeMenu === '마이페이지'} onClick={() => handleMypageClick('마이페이지')}>마이페이지</MenuItem>
                <MenuItem active={activeMenu === '마이노트'} onClick={() => handleMynoteClick('마이노트')}>정답/오답노트</MenuItem>
                <MenuItem active={activeMenu === '받은 피드백'} onClick={() => handleFeedbackClick('받은 피드백')}>받은 피드백</MenuItem>
                <MenuItem active={activeMenu === '결제창'} onClick={() => handleCashClick('결제창')}>결제관리</MenuItem>
                </Menu>
                <Line
                    marginbottom="10px"
                ></Line>
                <LogoutButton>로그아웃</LogoutButton>
            </Box>
  );
}

export default MypageSide;