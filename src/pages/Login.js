import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useHeaderMode } from '../hooks/HeaderManager';
import iconImage from '../assets/logo.png'; 
import Swal from 'sweetalert2';
import logo from '../assets/mainlogo.png'; // 로고 경로
import loginImage from '../assets/loginImage.png'; // 로고 경로

const LoginPage = () => {
  const navigate = useNavigate();
  const { setHeaderMode } = useHeaderMode();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('personal');

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
    <div style={styles.container}>
      <div style={styles.leftPanel}>
        <img src={logo} alt="nextpick Logo" style={styles.logo} />
        <p style={styles.description}>
          AI 면접 서비스와 모의 화상 면접 서비스로 기술 면접 연습을 편하게 대비해 보세요!
        </p>
        <div style={styles.illustration}>
          <img src={loginImage} alt="nextpick Logo" style={styles.loginImage} />
        </div>
        <button onClick={() => navigate('/agree')} style={styles.signupButton}>회원 가입</button>
      </div>

      <div style={styles.rightPanel}>
        <div style={styles.tabs}>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === 'personal' ? styles.activeTab : {}),
            }}
            onClick={() => setActiveTab('personal')}
          >
            멘티회원
          </button>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === 'company' ? styles.activeTab : {}),
            }}
            onClick={() => setActiveTab('company')}
          >
            멘토회원
          </button>
        </div>

        <div style={styles.form}>
          <input type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} placeholder="아이디" style={styles.input} />
          <input type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호" style={styles.input} />
          <button onClick={handleLogin} style={styles.loginButton}>로그인</button>
        </div>

        <div style={styles.links}>
          <a href="#find-id" style={styles.link}>아이디 찾기</a>
          {' | '}
          <a href="#find-password" style={styles.link}>비밀번호 찾기</a>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    border: '1px solid #ddd',
    borderRadius: '10px',
    width: '1000px',
    margin: 'auto',
    marginTop: '50px',
  },
  leftPanel: {
    flex: 1,
    padding: '20px',
    textAlign: 'center',
  },
  rightPanel: {
    flex: 1,
    padding: '20px',
  },
  logo: {
    width: '150px',
  },
  loginImage: {
    width: '400px'
  },
  description: {
    fontFamily: 'Pretendard',
    lineHeight: '30px',
    padding: '30px 60px 20px 60px',
    fontSize: '20px',
    margin: '20px 0',
  },
  illustration: {
    margin: '20px 0',
  },
  saramin: {
    backgroundColor: '#3571E6',
    display: 'inline-block',
    padding: '10px',
    borderRadius: '8px',
    color: 'white',
  },
  jobplanet: {
    backgroundColor: 'black',
    display: 'inline-block',
    padding: '10px',
    borderRadius: '8px',
    color: 'white',
    marginLeft: '10px',
  },
  signupButton: {
    border: '1px solid #3571E6',
    color: '#3571E6',
    background: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    marginBottom: '20px'
  },
  tabs: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  tab: {
    flex: 1,
    padding: '10px',
    textAlign: 'center',
    cursor: 'pointer',
    fontSize: '24px',
    color: '#8491a7',
    backgroundColor: '#ffffff',
    borderBottom: '3px solid transparent',
  },
  activeTab: {
    color: '#373f73',
    borderBottom: '3px solid #006AC1',
    fontWeight: '700',
    width: '90%', // 밑줄 길이를 줄이기 위해 너비 설정
    margin: '0 auto',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    margin: '10px 0',
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #ddd',
  },
  loginButton: {
    backgroundColor: '#3571E6',
    color: 'white',
    border: 'none',
    padding: '10px',
    marginTop: '10px',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  links: {
    textAlign: 'left', // 왼쪽 정렬
    fontSize: '14px',
    margin: '20px 0',
  },
  link: {
    color: '#3571E6',
    textDecoration: 'none',
  },
  adBanner: {
    textAlign: 'center',
    marginTop: '20px',
  },
  banner: {
    width: '80%',
  },
};

export default LoginPage;
