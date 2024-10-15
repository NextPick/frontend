import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useHeaderMode } from '../hooks/HeaderManager';
import iconImage from '../assets/logo.png'; 
import Swal from 'sweetalert2';

const Login = () => {
  const navigate = useNavigate();
  const { setHeaderMode } = useHeaderMode();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    setHeaderMode('signup');
  }, []);
  
  const handleLogin = async () => {
    try {
      const response = await axios.post(
        process.env.REACT_APP_API_URL + 'members/login',
        { username, password },
        {
          validateStatus: function (status) {
            return status >= 200 && status < 500; 
          },
        }
      );
  
      if (response.status === 200) {
        console.log('로그인 성공');
        Swal.fire({
          text: `로그인 성공`,
          icon: 'success',
          confirmButtonText: '확인'
        });
        const accessToken = response.headers['authorization'];
        const Type = response.headers['type'];
        const nickname = response.data.nickname; // 응답 본문에서 한글 닉네임 가져오기
        console.log(Type);
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('type', Type);
        localStorage.setItem('nickname', nickname);
        localStorage.setItem('email', username);
        navigate("/")
      } else if (response.status === 401) {
        console.error('로그인 실패');
        Swal.fire({
          text: `ID와 PW를 확인해 주세요`,
          icon: 'error',
          confirmButtonText: '확인'
        });
      } else if (response.status === 500) {
        console.error('서버 오류');
        Swal.fire({
          text: `서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.`,
          icon: 'error',
          confirmButtonText: '확인'
        });
      } else {
        console.error('알 수 없는 오류');
        Swal.fire({
          text: `알 수 없는 오류가 발생했습니다.`,
          icon: 'error',
          confirmButtonText: '확인'
        });
      }
    } catch (error) {
      console.error('네트워크 오류 또는 기타 오류 발생:', error);
      Swal.fire({
        text: `네트워크 오류가 발생했습니다. 인터넷 연결을 확인해 주세요.`,
        icon: 'error',
        confirmButtonText: '확인'
      });
    }
  };

  return (
    <div style={container}>
      <div style={wrap}>
        <div style={backgroundBox}>
          <div style={inputContainer}>
            <div style={inputField}>
              <label style={label}>ID</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={input}
              />
            </div>
            <div style={inputField}>
              <label style={label}>PW</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={input}
              />
            </div>
            <button onClick={handleLogin} style={loginButton}>로그인</button>
          </div>
        </div>
        <div style={footerLinks}>
          <button onClick={() => navigate('/signupOption')} style={linkButton}>회원가입</button>
          <button style={linkButton}>아이디/비밀번호 찾기</button>
        </div>
      </div>
    </div>
  );
};

export default Login;

// 스타일 정의
const container = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  backgroundColor: '#FFF',
  fontFamily:"Pretendard"
};

const wrap = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};



const backgroundBox = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center', // Vertical center alignment
  alignItems: 'center',
  padding: '30px',
  borderRadius: '8px',
  backgroundColor: '#d3e0ea',
  width: '550px',
  height: '400px',
  marginBottom: '20px', // Space between the box and footer links
};

const inputContainer = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center', // Center items within the container
  width: '85%',
  marginTop: "113px",
  gap: "30px",
};

const inputField = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: '20px',
  width: '100%',
  height: "25px",
};

const label = {
  fontSize: '20px',
  marginRight: '10px',
  width: '70px', // Align labels with inputs
  textAlign: 'center',
};

const input = {
  padding: '12px',
  border: '1px solid #ccc',
  borderRadius: '4px',
  width: '100%', // Full width of the container
};

const loginButton = {
  backgroundColor: '#ffffff',
  padding: '10px 20px',
  border: '1px solid #ccc',
  borderRadius: '15px',
  marginTop: '65px',
  width: '50%',
  cursor: 'pointer',
  color: '#000000', // 글자색 추가
};

const footerLinks = {
  display: 'flex',
  justifyContent: 'space-between',
  width: '300px', // Adjust width to fit below the box
  marginBottom: '20vh',
};

const linkButton = {
  backgroundColor: 'transparent',
  border: 'none',
  cursor: 'pointer',
  color: '#000000',
  fontSize: '14px',
  textDecoration: 'underline',
};
