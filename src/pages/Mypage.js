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

const Mypage = () => {
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
                <Font font="PretendardL" size="6.4px" color="#000000">{nickname || '닉네임'}</Font>
                <Font font="PretendardL" size="5px" color="#A4A5A6">{email || '이메일'}</Font>
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
                height="36vh"
                width="30vw"
                border="none"
                left="20px"
                justify="space-between"
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', height: '50%' }} // 자식 박스에서 정렬
            >
                <Box
                    height="6vh"
                    width="30vw"
                    border="none"
                    alignitem="flex-start"
                    justify="flex-start"
                    top="none"
                    color="#0372f33a"
                >
                    <Font
                        font="PretendardB"
                        size="6px"
                        color="#000000"
                        margintop="0px"
                        paddingtop="7px"
                        marginleft="10px"
                        spacing="2px"
                    >
                        내 프로필
                    </Font>
                </Box>

                <div style={{ display: 'flex', alignItems: 'center',  marginRight: "auto", marginLeft:"5px"}}> {/* 수평 정렬을 위한 flexbox */}
                    <img src={one} alt="one" style={{ width: '20px', height: '20px' }} /> {/* 로고 이미지 */}
                    <Font
                        font="PretendardL"
                        size="6px"
                        color="#000000"
                        align="center"
                        margintop="none"
                        justify="center"
                    >
                        이름
                    </Font>
                </div>
                <div class="line2"></div>

                <div style={{ display: 'flex', alignItems: 'center', marginRight: "auto", marginLeft:"5px" }}> {/* 수평 정렬을 위한 flexbox */}
                <img src={two} alt="two" style={{ width: '20px', height: '20px'}} /> {/* 로고 이미지 */}
                <Font
                    font="PretendardL"
                    size="6px"
                    color="#000000"
                    align="center"
                    margintop="none"
                    justify="center"
                >
                    번호
                </Font>
                </div>
                <div class="line2"></div>

                <div style={{ display: 'flex', alignItems: 'center', marginRight: "auto", marginLeft:"5px" }}> {/* 수평 정렬을 위한 flexbox */}
                <img src={three} alt="three" style={{ width: '20px', height: '20px'}} /> {/* 로고 이미지 */}
                <Font
                    font="PretendardL"
                    size="6px"
                    color="#000000"
                    align="center"
                    margintop="none"
                    justify="center"
                >
                    이메일
                </Font>
                </div>
                <div class="line2"></div>
                <Button
                    color="transparent"
                    width="83px"
                    textcolor="#000000"
                    height="20px"
                    hoverColor="#ffffff"
                    margintop="none"
                    paddingtop="7px"
                    align="none"
                    justify="none"
                    left="auto"
                    margintbottom="3px"
                >
                    <Font
                        font="PretendardL"
                        size="7px"
                        color="#000000"
                        align="center"
                        margintop="none"
                        justify="center"
                    >
                        회원정보 수정하러가기 →
                    </Font>
                </Button>
            </Box>
        </div>
    );
}

export default Mypage;