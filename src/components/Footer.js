import React from 'react';
import '../styles/global.css';  
import { Link } from 'react-router-dom';  
import '../styles/footer.css';
import Font from './Font';
import logo from '../assets/KakaoTalk_20241015_104803914_02.png'

const Footer = () => {
    

    return (
        <div className='footer'>
        
        <Font 
        font="Pretendard"
        size="16px"
        color="#FFFFFF"
        align="center"
        // paddingtop="20px"
        >
            <img src={logo} className='draggable-img' alt='홈로고' />
            <p>
               Home
            </p>
            <p>
            Our Team
            </p>
            <p>
            Contacts
            </p>
            <p>
            Social Media
            </p>
            
        </Font>
    </div>
    );
}

export default Footer;