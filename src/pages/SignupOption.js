import React from 'react';
import { useNavigate } from 'react-router-dom';
import tuty from './../assets/tuty.png'; // Replace with the actual path to your image
import tuter from './../assets//tuter.png'; // Replace with the actual path to your image

const ImageButtons = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/agree');
  };

  return (
    <div style={container}>
        <div style={containerStyle}>
        <div
            style={buttonStyle}
            onClick={handleClick}
            onMouseEnter={(e) => (e.currentTarget.firstChild.style.transform = 'scale(1.1)')}
            onMouseLeave={(e) => (e.currentTarget.firstChild.style.transform = 'scale(1)')}
        >
            <img src={tuty} alt="Tuty" style={imageStyle} />
        </div>
        <div
            style={buttonStyle}
            onClick={handleClick}
            onMouseEnter={(e) => (e.currentTarget.firstChild.style.transform = 'scale(1.1)')}
            onMouseLeave={(e) => (e.currentTarget.firstChild.style.transform = 'scale(1)')}
        >
            <img src={tuter} alt="Tuter" style={imageStyle} />
        </div>
        </div>
    </div>
  );
};

const container = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#FFF',
  };
const containerStyle = {
    display: 'flex',
    gap: '20px',
    justifyContent: 'center',
    alignItems: 'center',
  };

const buttonStyle = {
display: 'flex',
flexDirection: 'column',
alignItems: 'center',
cursor: 'pointer',
};

const imageStyle = {
width: '555px', // Adjust the size as needed
height: '444px',
transition: 'transform 0.3s ease',
};

export default ImageButtons;
