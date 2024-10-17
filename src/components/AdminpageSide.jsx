import React, { useEffect, useRef, useState } from 'react';
import '../styles/global.css';
import Line from './Line';
import Font from './Font';
import styled from 'styled-components';
import Box from './Box';
import defaultProfile from '../assets/img-non-login.png';
import { useMember } from '../hooks/MemberManager';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const ProfileImgArea = styled.div`
  justify-content: center;
  margin-top: 20px;
  padding: 3px;
  display: flex;
  align-items: flex-start;
`;

const ProfileImage = styled.img`
  width: 65px;
  height: 68px;
  object-fit: cover;
  border-radius: 50%;
  cursor: pointer;
  margin: 10px auto;
`;

const MenuItem = styled.p`
  padding: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;
  background-color: ${({ active }) => (active ? '#0077ff96' : 'transparent')};
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

const AdminpageSide = () => {
  const { profileUrl, setProfileUrl, nickname, setNickname, email, setEmail } = useMember();
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation(); // Hook to get the current location
  const [activeMenu, setActiveMenu] = useState('마이페이지');
  const [roles, setRoles] = useState([]); 

  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/admin/question')) {
      setActiveMenu('면접질문 관리');
    } else if (path === '/admin/service') {
      setActiveMenu('서비스 이용비율');
    } else if (path === '/admin') {
      setActiveMenu('멘토가입 신청관리');
    }
  }, [location.pathname]); // Dependency on pathname to run on path change

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(process.env.REACT_APP_API_URL + 'members', {
          headers: {
            Authorization: localStorage.getItem('accessToken'),
          },
        });
        if (response.status === 200) {
          const { email, nickname } = response.data.data;
          setEmail(email);
          setNickname(nickname);
          setRoles(roles);
        } else {
          console.error('사용자 정보를 가져오는 데 실패했습니다.');
        }
      } catch (error) {
        console.error('네트워크 오류:', error);
      }
    };
    fetchUserData();
  }, []);

  const changeProfileImg = (event) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleMenuClick = (menuName) => {
    setActiveMenu(menuName);
    switch (menuName) {
      case '서비스 이용비율':
        navigate('/admin/service');
        break;
      case '면접질문 관리':
        navigate('/admin/question');
        break;
      case '멘토가입 신청관리':
        navigate('/admin');
        break;
      case '사용자 신고목록 관리':
        // Navigation code if needed
        break;
      default:
        break;
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
      top="0px"
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
          ref={fileInputRef}
          style={{ display: 'none' }}
        />
      </ProfileImgArea>
      <Font font="Pretendard" size="20px" color="#000000" marginbottom="1px">
        {nickname || '닉네임'}
      </Font>
      <Font font="Pretendard" size="185x" color="#A4A5A6" marginbottom="3px">
        {email || '이메일'}
      </Font>
      <Line margintop="10px"></Line>
      <Menu>
        <MenuItem
          active={activeMenu === '서비스 이용비율'}
          onClick={() => handleMenuClick('서비스 이용비율')}
        >
          서비스 이용비율
        </MenuItem>
        <MenuItem
          active={activeMenu === '면접질문 관리'}
          onClick={() => handleMenuClick('면접질문 관리')}
        >
          면접질문 관리
        </MenuItem>
        <MenuItem
          active={activeMenu === '멘토가입 신청관리'}
          onClick={() => handleMenuClick('멘토가입 신청관리')}
        >
          멘토가입 신청관리
        </MenuItem>
        <MenuItem
          active={activeMenu === '사용자 신고목록 관리'}
          onClick={() => handleMenuClick('사용자 신고목록 관리')}
        >
          사용자 신고목록 관리
        </MenuItem>
      </Menu>
      <Line marginbottom="10px"></Line>
      <LogoutButton>로그아웃</LogoutButton>
    </Box>
  );
};

export default AdminpageSide;
