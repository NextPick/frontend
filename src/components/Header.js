import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';  
import axios from 'axios'; // axios 불러오기
import '../styles/global.css';  
import { useHeaderMode } from '../hooks/HeaderManager.js'; 
import logo from '../assets/mainlogo.png'; 

const Header = () => {
    const { headerMode } = useHeaderMode();
    const [nickname, setNickname] = useState(null);
    const [email, setEmail] = useState(null);
    const [roles, setRoles] = useState([]);  // roles 상태
    const navigate = useNavigate();

    // 사용자 정보 및 roles 가져오기
    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                console.error('토큰이 없습니다. 로그인 페이지로 이동합니다.');
                navigate('/login'); // 토큰이 없으면 로그인 페이지로 이동
                return;
            }

            try {
                const response = await axios.get(process.env.REACT_APP_API_URL + 'members', {
                    headers: {
                        Authorization: `Bearer ${token}`, // Bearer 토큰 설정
                    },
                });
                if (response.status === 200) {
                    const { roles, nickname, email } = response.data.data; // 서버에서 roles, nickname, email 정보를 가져옴
                    setRoles(roles);  // roles 설정
                    setNickname(nickname);  // 닉네임 설정
                    setEmail(email);  // 이메일 설정
                } else {
                    console.error('사용자 정보 가져오기 실패', response.status);
                }
            } catch (error) {
                console.error('사용자 정보를 가져오는 데 실패했습니다.', error);
                navigate('/login');  // 오류 발생 시 로그인 페이지로 리다이렉트
            }
        };

        fetchUserData();
    }, [navigate]);  // navigate를 의존성으로 추가하여, navigate 변경 시에만 실행

    // 로그아웃 함수
    const handleLogout = async () => {
        const token = localStorage.getItem('accessToken');

        if (token) {
            try {
                // 백엔드에 로그아웃 요청 보내기
                await axios.post(process.env.REACT_APP_API_URL + 'auth/logout', {}, {
                    headers: {
                        Authorization: `Bearer ${token}`  // 헤더에 토큰 추가
                    }
                });

                // 로그아웃 성공 시 로컬 스토리지에서 토큰, 닉네임, 이메일 삭제
                localStorage.removeItem('accessToken');
                localStorage.removeItem('nickname');
                localStorage.removeItem('email');
                setNickname(null);  // 상태 초기화
                setEmail(null);
                setRoles([]);  // roles도 초기화
                navigate('/login');  // 로그인 페이지로 리다이렉트
            } catch (error) {
                console.error('로그아웃 실패', error);
                alert('로그아웃에 실패했습니다.');
            }
        } else {
            console.log('토큰이 없습니다.');
            navigate('/login');  // 토큰이 없는 경우에도 로그인 페이지로 이동
        }
    };

    // 닉네임 클릭 시 이동 처리
    const handleNicknameClick = () => {
        console.log('Roles on click:', roles); // Roles 상태 클릭 시 출력

        if (roles.length > 0) {
            if (roles.includes('ADMIN')) {
                navigate('/admin'); // 관리자일 경우 관리자 페이지로 이동
            } else if (roles.includes('USER')) {
                navigate('/mypage'); // 일반 유저일 경우 마이페이지로 이동
            } else {
                console.log("알 수 없는 역할:", roles); // 예상되지 않은 역할 확인
            }
        } else {
            console.log("Roles가 아직 설정되지 않았습니다.");
        }
    };

    return (
        <header style={styles.header}>
            <div className='width-wrapper' style={styles.headerContainer}>
                <Link to='/' style={styles.logoContainer}>
                    <img src={logo} className='draggable-img' alt='홈로고' style={styles.logo} />
                </Link>
                <div style={styles.navLinks}>
                    <Link to='/aihome' className='navLink'>AI 면접</Link>
                    <Link to='/choice' className='navLink'>화상 면접</Link>
                    <Link to='/board/question' className='navLink'>질문 게시판</Link>
                    <Link to='/board/review' className='navLink'>면접 후기 게시판</Link>
                </div>
                {nickname ? (
                    <div style={styles.userContainer}>
                        <span 
                            className='navLink' 
                            onClick={handleNicknameClick} // 닉네임 클릭 시 이동 처리
                            style={{ cursor: 'pointer' }}
                        >
                            <span style={styles.welcomeMessage}>
                                <em style={{ fontStyle: 'normal', color: '#177FF9', fontWeight: 'bold' }}>
                                    [{nickname}]
                                </em>님 환영합니다!
                            </span>
                        </span>
                        <button onClick={handleLogout} style={styles.logoutButton}>로그아웃</button>
                    </div>
                ) : (
                    <Link to='/login' className='navLink'>로그인</Link>
                )}
            </div>
        </header>
    );
};

const styles = {
    header: {
        backgroundColor: '#f8f9fa',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        padding: '10px 20px',
        height: '70px', 
    },
    headerContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
        height: '100%', 
    },
    logoContainer: {
        display: 'flex',
        alignItems: 'center',
    },
    logo: {
        height: '30px', 
        width: 'auto',   
        marginRight: '20px',
        paddingRight: '15px',
    },
    navLinks: {
        display: 'flex',
        gap: '20px', // 링크 간격 조정
    },
    userContainer: {
        display: 'flex',
        alignItems: 'center'
    },
    welcomeMessage: {
        marginRight: '12px',
        fontSize: '16px',
        color: '#343a40',
    },
    logoutButton: {
        padding: '5px 10px',
        border: 'none',
        borderRadius: '4px',
        backgroundColor: 'rgb(150 190 213)', // 로그아웃 버튼 색상
        color: 'white',
        cursor: 'pointer',
        fontSize: '13px',
        transition: 'background-color 0.3s',
    },
};

export default Header;
