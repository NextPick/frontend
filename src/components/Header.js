import React from 'react';
import '../styles/global.css';  
import { Link } from 'react-router-dom';  
import { useHeaderMode } from '../hooks/HeaderManager.js';

// 로그인일 때는 헤더가 아이콘만 나오고 아이콘 누르면 홈으로 이어져야함
const Header = () => {

    // useHeaderMode 훅을 사용하여 현재 헤더 모드(headerMode)와 상태 변경 함수(setHeaderMode)를 가져옴
    const { headerMode } = useHeaderMode();

    // 헤더의 내용을 결정하는 HeaderView 컴포넌트 정의
    const HeaderView = () => {
        if(headerMode === 'main') {
            return (
                <header>
                    <div className='width-wrapper'></div>
                    <Link to='/'><img id='logo' src={require('../assets/logo.png')} className='draggable-img' /></Link>
                    <Link to='/'><img id='aiinterview' src={require('../assets/aiinterview.png')} className='draggable-img' /></Link>
                    <Link to='/'><img id='faceinterview' src={require('../assets/faceinterview.png')} className='draggable-img' /></Link>
                    <Link to='/'><img id='board' src={require('../assets/board.png')} className='draggable-img' /></Link>
                    <Link to='/'><img id='board2' src={require('../assets/board2.png')} className='draggable-img' /></Link>
                    <Link to='/'><img id='login' src={require('../assets/login.png')} className='draggable-img' /></Link>
                </header>
            );
        } 
         // 현재 headerMode가 'signup'일 경우
         else if (headerMode === 'signup') {
            return (
                <header>
                    <Link to='/signup'> {/* 보드 페이지로 링크 */}
                        <img id='logo' src={require('../assets/logo.png')} className='draggable-img' alt='Logo' /> {/* 보드 로고 이미지 */}
                    </Link>
                    <div className='width-wrapper'></div> {/* 스타일을 위한 여러 wrapper div */}
                    <div className='width-wrapper'></div>
                    <div className='width-wrapper'></div>
                    <Link to='/'> {/* 메인 페이지로 돌아가는 링크 */}
                        <div id='header-home' /> {/* 홈 버튼을 위한 div */}
                    </Link>
                </header>
            );
        }
    };
    return (
        <HeaderView /> // HeaderView 컴포넌트를 렌더링
    );
};

export default Header;