import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';  
import '../styles/global.css';  
import { useHeaderMode } from '../hooks/HeaderManager.js'; 
import logo from '../assets/mainlogo.png'; // 로고 경로
import { NavItem } from 'react-bootstrap';

const Header = () => {
    const { headerMode } = useHeaderMode();
    const [nickname, setNickname] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            const savedNickname = localStorage.getItem('nickname');
            setNickname(savedNickname);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('nickname');
        setNickname(null); 
        navigate('/login'); 
    };



    const handleLinkClick = (event) => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            event.preventDefault(); 
            navigate('/login'); 
        }
    };

    const HeaderView = () => {
        return (
            <header style={styles.header}>
                <div className='width-wrapper' style={styles.headerContainer}>
                    <Link to='/' style={styles.logoContainer}>
                        <img src={logo} className='draggable-img' alt='홈로고' style={styles.logo} />
                    </Link>
                    <div style={styles.navLinks}>
                        <Link to='/aihome' className='navLink' onClick={handleLinkClick}>AI 면접</Link>
                        <Link to='/choice' className='navLink' onClick={handleLinkClick}>화상 면접</Link>
                        <Link to='/board/question' className='navLink' onClick={handleLinkClick}>질문 게시판</Link>
                        <Link to='/board/review' className='navLink' onClick={handleLinkClick}>면접 후기 게시판</Link>
                    </div>
                    {nickname ? (
                        <div style={styles.userContainer}>
                        <Link to='/mypage' className='navLink' onClick={handleLinkClick}>
                            <span style={styles.welcomeMessage}><em style={{ fontStyle:'normal', color:'#177FF9', fontWeight:'bold' }}>[{nickname}]</em>님 환영합니다!</span>
                            </Link>
                            <button onClick={handleLogout} style={styles.logoutButton}>로그아웃</button>
                        </div>
                    ) : (
                        <Link to='/login' className='navLink'>로그인</Link>
                    )}
                </div>
            </header>
        );
    };

    return (
        <HeaderView />
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
        // paddingTop: '5px',
        gap: '20px', // 링크 간격 조정
    },

    userContainer: {
        display: 'flex',
        alignItems: 'center'
        // marginRight: '60px',
        // marginTop: '11px',
        // marginLeft: '-60px'
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
        marginBottom: '-5x',
    },
};

// CSS 파일에 호버 효과 추가
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
    .navLink {
        margin: 0 15px;
        text-decoration: none;
        color: #343a40;
        font-size: 16px;
        font-weight: 500;
        transition: color 0.3s; // 부드러운 변화 효과
    }
`, styleSheet.cssRules.length);

styleSheet.insertRule(`
    .navLink:hover {
        color: #177FF9; // 호버 시 색상 변경
    }
`, styleSheet.cssRules.length);

export default Header;
