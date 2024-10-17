import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Box from './Box';
import Font from './Font';
import Line from './Line';
import Button from './Button';
import defaultProfile from '../assets/img-non-login.png';
import { useMember } from '../hooks/MemberManager';
import axios from 'axios';

const AdminpageSide = () => {
  const { profileUrl, setProfileUrl, nickname, setNickname, email, setEmail } = useMember();
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState(''); // 초기 상태 빈 문자열로 설정
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    // URL 기준으로 activeMenu 값 설정
    if (location.pathname.includes('/admin/question')) {
      setActiveMenu('면접질문 관리');
    } else if (location.pathname.includes('/admin/service')) {
      setActiveMenu('서비스 이용비율');
    } else if (location.pathname === '/admin') {
      setActiveMenu('멘토가입 신청관리');
    }
  }, [location.pathname]); // 경로가 변경될 때마다 실행

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
        }
      } catch (error) {
        console.error('사용자 정보를 가져오는 데 실패했습니다.');
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
      default:
        break;
    }
  };

  return (
    <Box
      height="100%"
      width="250px"
      padding="20px"
      border="0.5px solid #ccc"
      alignItems="flex-start"
      justify="flex-start"
      textalign="center"
      color="#FFF"
      radius="15px"
      top="0px"
      shadow= "rgba(0, 0, 0, 0.1) 0px 2px 4px;"
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
      <Font font="Pretendard" size="20px" color="#006AC1" marginbottom="1px" weight="bold">
        {nickname || '닉네임'}
      </Font>
      <Font font="Pretendard" size="18px" color="#999" marginbottom="3px">
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
      </Menu>
      <Line marginbottom="10px"></Line>
    </Box>
  );
};

// 스타일 정의

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
  color: ${({ active }) => (active ? '#006AC1' : '#ccc')};
  font-weight: ${({ active }) => (active ? 'bold' : 'normal')};

  &:hover {
    background-color: #F7F7F7;
    color: #0060B0;
  }
`;

const Menu = styled.div`
  margin-top: 20px;
  text-align: center;
  margin-bottom: 20px;
  font-size: 16px;
  font-family: 'Pretendard', sans-serif;
  width: 100%;
`;

export default AdminpageSide;
