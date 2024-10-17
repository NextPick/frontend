import React, { useEffect, useState, useRef } from 'react';
import { useHeaderMode } from '../hooks/HeaderManager';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Box from '../components/Box';
import '../styles/login.css';
import Button from '../components/Button';
import Font from '../components/Font';
import styled from 'styled-components';
import { useMember } from '../hooks/MemberManager'; // 회원 정보를 관리하는 훅
import one from '../assets/one.png';
import two from '../assets/two.png';
import three from '../assets/three.png';
import axios from 'axios';
import MypageSide from '../components/MypageSide';

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

const MainContent = styled.main`
  flex: 1;
  padding: 20px;
  max-width: 800px;
  height: 100%;
  border-radius: 15px;
  margin-left: 20px;
  text-align: center;
  border: 0.5px solid #ccc;
  background-color: #fff;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 4px;
`;

const Title = styled.h2`
  font-size: 24px;
  margin-top: 10px;
  margin-bottom: 40px;
  text-align: left;
  font-family: 'Pretendard', sans-serif;
  color: #006AC1;
  font-weight: bold;
`;



const Mypage = () => {
    const { profileUrl, setProfileUrl, nickname,  setNickname,  email,  setEmail, type, setType } = useMember();
    const { headerMode, setHeaderMode } = useHeaderMode();
   


    useEffect(() => {
        const fetchUserData = async () => {
            console.log('API 호출 시작'); // 추가된 로그
            try {
                const response = await axios.get(process.env.REACT_APP_API_URL + 'members', {
                    headers: {
                        Authorization: localStorage.getItem('accessToken'), // 토큰을 헤더에 추가
                    },
                });
                if (response.status === 200) {
                    const { email, nickname, type } = response.data.data; 
                    setEmail(email);
                    setNickname(nickname);
                    setType(type);

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
    
    

    useEffect(() => {
        setHeaderMode('main');
    }, [setHeaderMode]);



  

    return (
        <Container>
            <MypageSide/>
                <MainContent    
                padding="0px"
                height="50%"
                width="33vw"
                border="none"
                color="#f1f7fd"
                justify="space-between"
                radius="15px"
                left="20px"
            >
                <Title>내 프로필</Title>    
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
                          {nickname} {/* 닉네임 표시 */}
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
                       {type} {/* 닉네임 표시 */}
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
                           {email} {/* 이메일 표시 */}
                    </Font>
                </div>
                <div class="line2"></div>
                <Button
                    color="transparent"
                    width="11vw"
                    textcolor="#000000"
                    height="35px"
                    hoverColor="#ffffff"
                    margintop="-6px"
                    paddingtop="7px"
                    align="none"
                    justify="none"
                    left="auto"
                    margintbottom="10px"
                    marginright="12px"
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
            </MainContent>
        </Container>
    );
}

export default Mypage;