import React from 'react';

const LoginPage = () => {
  return (
    <div style={styles.container}>
      <div style={styles.leftPanel}>
        <img src="logo1.png" alt="Saramin Logo" style={styles.logo} />
        <img src="logo2.png" alt="Jobplanet Logo" style={styles.logo} />
        <p style={styles.description}>
          다양한 사람인 서비스를 로그인 한 번으로 편하게 이용하세요!
        </p>
        <div style={styles.illustration}>
          <div style={styles.saramin}>saramin</div>
          <div style={styles.jobplanet}>잡플래닛</div>
        </div>
        <button style={styles.signupButton}>개인 통합회원 가입</button>
      </div>

      <div style={styles.rightPanel}>
        <div style={styles.tabs}>
          <button style={{ ...styles.tab, ...styles.activeTab }}>개인회원</button>
          <button style={styles.tab}>기업회원</button>
        </div>

        <div style={styles.form}>
          <input type="text" placeholder="아이디" style={styles.input} />
          <input type="password" placeholder="비밀번호" style={styles.input} />
          <div style={styles.checkboxContainer}>
            <label>
              <input type="checkbox" /> 로그인 유지
            </label>
            <label>
              <input type="checkbox" /> 아이디 저장
            </label>
          </div>
          <button style={styles.loginButton}>로그인</button>
        </div>

        <div style={styles.links}>
          <a href="#find-id" style={styles.link}>아이디 찾기</a>
          {' | '}
          <a href="#find-password" style={styles.link}>비밀번호 찾기</a>
        </div>
        
        <div style={styles.adBanner}>
          <img src="ad-banner.png" alt="Ad Banner" style={styles.banner} />
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
    width: '80%',
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
  description: {
    fontSize: '18px',
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
    borderBottom: '2px solid transparent',
  },
  activeTab: {
    borderBottom: '2px solid #3571E6',
    fontWeight: 'bold',
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
  checkboxContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '20px',
  },
  loginButton: {
    backgroundColor: '#3571E6',
    color: 'white',
    border: 'none',
    padding: '10px',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  links: {
    textAlign: 'center',
    margin: '20px 0',
  },
  link: {
    color: '#3571E6',
    textDecoration: 'none',
  },
  socialLogin: {
    textAlign: 'center',
    margin: '20px 0',
  },
  socialIcons: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
  },
  icon: {
    width: '30px',
    cursor: 'pointer',
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
