import React from 'react';
import '../styles/global.css';  
import { Link } from 'react-router-dom';  
import { useHeaderMode } from '../hooks/HeaderManager.js';

const Header = () => {
    const { headerMode } = useHeaderMode();

    const HeaderView = () => {
        if(headerMode === 'main') {
            return (
                <header>
                    <div className='width-wrapper'>
                        <Link to='/'><img id='logo' src={require('../assets/logo.png')} className='draggable-img' alt='홈로고'/></Link>
                        <Link to='/'><img id='aiinterview' src={require('../assets/aiinterview.png')} className='draggable-img' alt='AI 인터뷰'/></Link>
                        <Link to='/'><img id='faceinterview' src={require('../assets/faceinterview.png')} className='draggable-img' alt='얼굴 인터뷰'/></Link>
                        <Link to='/'><img id='board' src={require('../assets/board.png')} className='draggable-img' alt='게시판'/></Link>
                        <Link to='/'><img id='board2' src={require('../assets/board2.png')} className='draggable-img' alt='게시판2'/></Link>
                        <Link to='/audio-recorder'> <span>음성 인식</span> {/* 이미지 대신 텍스트 표시 */}</Link>{/* 음성인식 링크 추가 */}
                        <Link to='/login'><img id='login' src={require('../assets/login.png')} className='draggable-img' alt='로그인'/></Link>
                    </div>
                </header>
            );
        } 
        else if (headerMode === 'signup') {
            return (
                <header>
                    <div className='loginlogo'>
                        <Link to='/'>
                            <img id='logo' src={require('../assets/logo.png')} className='draggable-img' alt='Logo' />
                        </Link>
                    </div>
                </header>
            );
        }
    };

    return (
        <HeaderView />
    );
};

export default Header;
