import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import tuty from './../assets/tuty_sq.png'; // Replace with the actual path to your image
import tuter from './../assets/tuter_sq.png'; // Replace with the actual path to your image

const ImageButtons = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  const handleSelect = (role) => {
    setSelected(role);
  };

  const handleNext = () => {
    if (selected) {
      navigate(`/signup/${selected}`);
    }
  };

  return (
    <div style={container}>
      <h2 style={titleContainer}>
        <span style={mainTitle}>회원가입</span>
        <span style={{ margin: '0 5px -6px', fontSize: '18px'}}>|</span>
        <span style={subTitle}>멘토 / 멘티 선택</span>
      </h2>
      <hr style={{ ...divider, width: '900px' }} />
      <div style={containerStyle}>
        <div
          style={buttonStyle}
          onClick={() => handleSelect('MENTEE')}
          onMouseEnter={(e) => (e.currentTarget.firstChild.style.transform = 'scale(1.1)')}
          onMouseLeave={(e) => (e.currentTarget.firstChild.style.transform = 'scale(1)')}
        >
          <img
            src={tuty}
            alt="Tuty"
            style={{ ...imageStyle, filter: selected === 'MENTEE' ? 'none' : 'grayscale(100%)' }}
          />
          <p style={labelStyle}>멘티로 가입</p>
        </div>
        <div
          style={buttonStyle}
          onClick={() => handleSelect('MENTOR')}
          onMouseEnter={(e) => (e.currentTarget.firstChild.style.transform = 'scale(1.1)')}
          onMouseLeave={(e) => (e.currentTarget.firstChild.style.transform = 'scale(1)')}
        >
          <img
            src={tuter}
            alt="Tuter"
            style={{ ...imageStyle, filter: selected === 'MENTOR' ? 'none' : 'grayscale(100%)' }}
          />
          <p style={labelStyle}>멘토로 가입</p>
        </div>
      </div>
      <button
        onClick={handleNext}
        style={{ ...nextButtonStyle, backgroundColor: selected ? '#E0EBF5' : '#FFF' }}
        disabled={!selected}
      >
        다음
      </button>
    </div>
  );
};

const container = {
  display: 'flex',
  flexDirection: 'column',
  marginTop: '5vh',
  alignItems: 'center',
  height: '100vh',
  backgroundColor: '#FFF',
};

const titleContainer = {
  marginBottom: '-10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start', // Aligns content to the start of the flex container
  width: '900px', // Matches the width of the divider for alignment
  marginLeft: '20px', // Adds some space from the left edge
};

const mainTitle = {
  fontWeight: 'Bold',
  fontSize: '26px', // Updated font size
};

const subTitle = {
  fontSize: '18px', // Updated font size
  marginTop: '10px',
};

const divider = {
  borderTop: '2px solid #ccc',
  marginBottom: '40px',
};

const containerStyle = {
  display: 'flex',
  gap: '60px',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: '30px',
};

const buttonStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  cursor: 'pointer',
};

const imageStyle = {
  width: '400px', // Adjust the size as needed
  height: '400px',
  borderRadius: '20px',
  transition: 'transform 0.3s ease',
  marginBottom: '10px',
};

const labelStyle = {
  marginTop: '15px',
  fontSize: '16px',
};

const nextButtonStyle = {
  padding: '10px 20px',
  borderRadius: '20px',
  border: '1px solid #ccc',
  fontSize: '16px',
  cursor: 'pointer',
};

export default ImageButtons;
