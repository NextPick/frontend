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
import cashpage from '../assets/cashpage.png';
import MypageSide from '../components/MypageSide';




const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 100px;
  background-color: #FFF;
  height: 100vh;
  font-family: Arial, sans-serif;
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

const Cash = () => {
    const { profileUrl, setProfileUrl, nickname, email } = useMember();
    const { headerMode, setHeaderMode } = useHeaderMode();
    const navigate = useNavigate();
    const location = useLocation();
    const fileInputRef = useRef(null); // 파일 입력을 참조할 ref 생성


    const handleButtonClick = (path) => {
        navigate(path); // 이동할 페이지
    };

    useEffect(() => {
        setHeaderMode('main');
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

    return (
        <Container>
           <MypageSide/>
            <Box
                height="70vh"
                width="30vw"
                border="none"
                left="30px"
                justify="center"
                color="#ffffff"
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}} // 자식 박스에서 정렬
            >
               <img src={cashpage} alt="공사중" style={{  height: '50%', width: "95% ", marginLeft: "50px" }} /> {/* //나중에 미디어커리 적용해서 작은화면에서도 안넘치더록하자 */}
            </Box>
            </Container>
    );
  }
  
export default Cash;