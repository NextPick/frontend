import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Button from '../components/Button.js';
import {
  emailValidation,
  nameValidation,
  nicknameValidation,
  passwordValidation,
  numberValidation,
} from '../utils/Validation.js';

const Signup = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerificationInput, setShowVerificationInput] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const [formData, setFormData] = useState({
    이름: '',
    닉네임: '',
    이메일: '',
    비밀번호: '',
    비밀번호확인: '',
    전화번호: '',
    성별: '',
    직군: 'BE',
    경력: 'ZEROTOONE',
    타입: type,
  });

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (value === '' || value === null) return;
    switch (name) {
      case '이메일':
        emailValidation(value);
        break;
      case '이름':
        nameValidation(value);
        break;
      case '비밀번호':
        passwordValidation(value);
        break;
      case '닉네임':
        nicknameValidation(value);
        break;
      case '전화번호':
        numberValidation(value);
        break;
      default:
        break;
    }
  };

  const handleVerify = async (type) => {
    let ValidationResult = true;
    try {
      let url, body;
      if (type === '이메일') {
        if (!emailValidation(formData.이메일)) ValidationResult = false;
        else {
          url = process.env.REACT_APP_API_URL + 'members/verify/email';
          body = { email: formData.이메일 };
        }
      } else if (type === '닉네임') {
        if (!nicknameValidation(formData.닉네임)) ValidationResult = false;
        else {
          url = process.env.REACT_APP_API_URL + 'members/verify/nickname';
          body = { nickname: formData.닉네임 };
        }
      }
      const response = await axios.post(url, body, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.status === 200) {
        Swal.fire({
          text: `${type}이(가) 사용 가능합니다.`,
          icon: 'success',
          confirmButtonText: '확인',
        });
        if (type === '이메일') {
          setIsEmailChecked(true);
          setIsEmailVerified(false);
        } else {
          setIsNicknameChecked(true);
        }
      }
    } catch (error) {
      Swal.fire({
        text: ValidationResult ? `${type}이(가) 이미 사용 중입니다.` : `${type} 입력 값을 확인해 주세요.`,
        icon: 'error',
        confirmButtonText: '확인',
      });
    }
  };

  const handleEmailVerification = async () => {
    if (!isEmailChecked) {
      Swal.fire({
        text: '이메일 중복 확인을 먼저 진행해 주세요.',
        icon: 'error',
        confirmButtonText: '확인',
      });
      return;
    }

    try {
      const response = await axios.post(
        process.env.REACT_APP_API_URL + 'members/auth-code',
        {
          email: formData.이메일,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.status === 202) {
        Swal.fire({
          text: '이메일로 인증 코드를 전송했습니다.',
          icon: 'success',
          confirmButtonText: '확인',
        });
        setShowVerificationInput(true);
      }
    } catch (error) {
      Swal.fire({
        text: '이메일 전송 중 오류가 발생했습니다. 다시 시도해 주세요.',
        icon: 'error',
        confirmButtonText: '확인',
      });
    }
  };

  const handleEmailCodeVerification = async () => {
    if (!verificationCode) {
      Swal.fire({
        text: '인증 코드를 입력해 주세요.',
        icon: 'error',
        confirmButtonText: '확인',
      });
      return;
    }

    try {
      const response = await axios.post(
        process.env.REACT_APP_API_URL + 'members/verify-auth-code',
        {
          email: formData.이메일,
          authCode: verificationCode,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.status === 200) {
        Swal.fire({
          text: '이메일 인증이 완료되었습니다.',
          icon: 'success',
          confirmButtonText: '확인',
        });
        setIsEmailVerified(true);
      }
    } catch (error) {
      Swal.fire({
        text: '인증 코드가 올바르지 않습니다.',
        icon: 'error',
        confirmButtonText: '확인',
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === '비밀번호' || name === '비밀번호확인') {
      setPasswordsMatch(formData.비밀번호 === value || formData.비밀번호확인 === value);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!isEmailVerified) {
      Swal.fire({
        text: '이메일 인증을 완료해 주세요.',
        icon: 'error',
        confirmButtonText: '확인',
      });
      return;
    }

    if (!isNicknameChecked) {
      Swal.fire({
        text: '닉네임 중복 확인을 먼저 진행해 주세요.',
        icon: 'error',
        confirmButtonText: '확인',
      });
      return;
    }

    if (!passwordsMatch) {
      Swal.fire({
        text: '비밀번호가 일치하지 않습니다.',
        icon: 'error',
        confirmButtonText: '확인',
      });
      return;
    }

    try {
      const response = await axios.post(
        process.env.REACT_APP_API_URL + 'members',
        {
          name: formData.이름,
          gender: formData.성별,
          email: formData.이메일,
          password: formData.비밀번호,
          confirmPassword: formData.비밀번호확인,
          nickname: formData.닉네임,
          occupation: formData.직군,
          career: formData.경력,
          type: formData.타입,
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (response.status === 201) {
        Swal.fire({
          title: '회원가입이 완료되었습니다!',
          confirmButtonText: '확인',
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/login');
          }
        });
      }
    } catch (error) {
      Swal.fire({
        text: '회원가입 중 오류가 발생했습니다. 다시 시도해 주세요.',
        icon: 'error',
        confirmButtonText: '확인',
      });
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.titleContainer}>
        <span style={styles.mainTitle}>회원가입</span>
        <span style={styles.divider}>|</span>
        <span style={styles.subTitle}>{type === 'MENTEE' ? '멘티' : '멘토'} 정보 입력</span>
      </h2>

      {/* 로그인 정보 */}
      <div style={styles.sectionContainer}>
        <h3 style={styles.sectionTitle}>로그인 정보</h3>
        <div style={styles.inputGroup}>
          <label style={styles.label}>이메일</label>
          <div style={styles.inputContainer}>
            <input
              type="text"
              name="이메일"
              value={formData.이메일}
              onChange={handleInputChange}
              style={isEmailVerified ? { ...styles.input, ...styles.disabledInput } : styles.input}
              placeholder="이메일을 입력하세요"
              disabled={isEmailVerified}
            />
            {!isEmailVerified && (
              <Button
                color="#007BFF"
                width="100px"
                height="40px"
                fontcolor="white"
                radius="4px"
                onClick={() => handleVerify('이메일')}
              >
                중복검사
              </Button>
            )}
          </div>
        </div>
        {!isEmailVerified && (
          <div style={styles.inputGroup}>
            <Button
              color="#007BFF"
              width="150px"
              height="40px"
              fontcolor="white"
              radius="4px"
              onClick={handleEmailVerification}
            >
              인증 코드 발송
            </Button>
          </div>
        )}
        {showVerificationInput && (
          <div style={styles.inputGroup}>
            <label style={styles.label}>인증 코드를 입력하세요</label>
            <div style={styles.inputContainer}>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                style={styles.input}
                placeholder="인증 코드를 입력하세요"
              />
              <Button
                color="#28A745"
                width="100px"
                height="40px"
                fontcolor="white"
                radius="4px"
                onClick={handleEmailCodeVerification}
              >
                인증 확인
              </Button>
            </div>
          </div>
        )}
        <div style={styles.inputGroup}>
          <div style={styles.inputContainer}>
            <div style={{ flex: '1' }}>
              <label style={styles.label}>비밀번호</label>
              <input
                type="password"
                name="비밀번호"
                value={formData.비밀번호}
                onChange={handleInputChange}
                style={{ ...styles.input, width: '95%' }}
                placeholder="비밀번호를 입력하세요"
              />
            </div>
            <div style={{ flex: '1', marginLeft: '20px' }}>
              <label style={styles.label}>비밀번호 확인</label>
              <input
                type="password"
                name="비밀번호확인"
                value={formData.비밀번호확인}
                onChange={handleInputChange}
                style={{ ...styles.input, width: '95%' }}
                placeholder="비밀번호를 다시 입력하세요"
              />
              {!passwordsMatch && (
                <span style={styles.errorText}>비밀번호가 일치하지 않습니다.</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 관심분야 */}
      <div style={styles.sectionContainer}>
        <h3 style={styles.sectionTitle}>관심분야</h3>
        <div style={styles.inputGroup}>
          <label style={styles.label}>직군</label>
          <select
            name="직군"
            value={formData.직군}
            onChange={handleInputChange}
            style={styles.select}
          >
            <option value="BE">BE</option>
            <option value="FE">FE</option>
          </select>
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>경력사항</label>
          <select
            name="경력"
            value={formData.경력}
            onChange={handleInputChange}
            style={styles.select}
          >
            <option value="ZEROTOONE">0~1년차</option>
            <option value="TWOTOTHREE">2~3년차</option>
            <option value="FOUROROVER">4년차 이상</option>
          </select>
        </div>
      </div>

      {/* 개인정보 */}
      <div style={styles.sectionContainer}>
        <h3 style={styles.sectionTitle}>개인정보</h3>
        <div style={styles.inputGroup}>
          <label style={styles.label}>이름</label>
          <input
            type="text"
            name="이름"
            value={formData.이름}
            onChange={handleInputChange}
            style={styles.input}
            placeholder="이름을 입력하세요"
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>닉네임</label>
          <div style={styles.inputContainer}>
            <input
              type="text"
              name="닉네임"
              value={formData.닉네임}
              onChange={handleInputChange}
              style={styles.input}
              placeholder="닉네임을 입력하세요"
            />
            <Button
              color="#007BFF"
              width="100px"
              height="40px"
              fontcolor="white"
              radius="4px"
              onClick={() => handleVerify('닉네임')}
            >
              중복검사
            </Button>
          </div>
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>전화번호</label>
          <input
            type="text"
            name="전화번호"
            value={formData.전화번호}
            onChange={handleInputChange}
            style={styles.input}
            placeholder="전화번호를 입력하세요"
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>성별</label>
          <select
            name="성별"
            value={formData.성별}
            onChange={handleInputChange}
            style={styles.select}
          >
            <option value="M">남성</option>
            <option value="F">여성</option>
          </select>
        </div>
      </div>

      {/* 회원가입 버튼 */}
      <div style={{ textAlign: 'center', marginTop: '30px' }}>
        <Button
          color="#007BFF"
          width="180px"
          height="50px"
          fontcolor="white"
          radius="4px"
          onClick={handleSignup}
        >
          회원가입
        </Button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    marginTop: '50px',
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  },
  titleContainer: {
    textAlign: 'center',
    marginBottom: '30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainTitle: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#333',
  },
  subTitle: {
    fontSize: '16px',
    color: '#888',
    marginLeft: '10px',
  },
  divider: {
    fontSize: '24px',
    color: '#888',
    marginLeft: '10px',
  },
  sectionContainer: {
    marginBottom: '40px',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#333',
  },
  inputGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    color: '#555',
  },
  inputContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  input: {
    flex: '1',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '14px',
    color: '#333',
  },
  disabledInput: {
    backgroundColor: '#f0f0f0',
    color: '#999',
  },
  select: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '14px',
    color: '#333',
  },
  errorText: {
    color: 'red',
    fontSize: '12px',
    marginTop: '5px',
  },
};

export default Signup;
