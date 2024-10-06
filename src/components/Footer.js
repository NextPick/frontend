import React from 'react';
import '../styles/global.css';  
import { Link } from 'react-router-dom';  
import '../styles/footer.css';
import Font from './Font';

const Footer = () => {
    

    return (
        <div className='footer'>
        <Font 
        font="PretendardB"
        size="13px"
        color="#FFFFFF"
        align="center"
        paddingtop="20px"
        >
            <p style={{ margin: '7px 0' }}>
               Home
            </p>
            <p style={{ margin: '7px 0' }}>
            Our Team
            </p>
            <p style={{ margin: '7px 0' }}>
            Contacts
            </p>
            <p style={{ margin: '7px 0' }}>
            Social Media
            </p>
            
        </Font>
    </div>
    );
}

export default Footer;