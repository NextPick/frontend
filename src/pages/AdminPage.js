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
import Chart from '../components/Chart';

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



const AdminPage = () => {
    const { profileUrl, setProfileUrl, nickname, email } = useMember();
    const { headerMode, setHeaderMode } = useHeaderMode();
    const navigate = useNavigate();
    const location = useLocation();
    const fileInputRef = useRef(null); // 파일 입력을 참조할 ref 생성
    const [activeTab, setActiveTab] = useState('chart'); // 탭 상태를 관리

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


 // 탭에 따라 표시할 콘텐츠를 정의
 const renderTabContent = () => {
    if (activeTab === 'chart') {
        return (
            <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center' }}>
                     <div style={{ alignSelf: 'flex-start' , marginBottom: '10px', width:"35vw" }}> {/* 왼쪽 정렬을 위한 스타일 */}
                    <Font
                        font="PretendardL"
                        size="22px"
                        color="#000000"
                        margintop="5px"
                        spacing="2px"
                        paddingtop="5px"
                        paddingleft="13px"
                        marginbottom="2px"
                    >
                        서비스 이용비율
                    </Font>
                </div>
                       {/* 여기에 차트 컴포넌트를 추가합니다 */}
                <div style={{ width: '75%', marginTop: '10px' }}>
                <Chart /> {/* 'answer' 탭에서만 차트가 렌더링됩니다 */}
          </div>
        </div>
      );
    } 
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
                style={{ display: 'flex'}} // 자식 박스에서 정렬
            >
              
                {renderTabContent()} 
            </Box>
        </div>
    );
  }
  
export default AdminPage;