import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHeaderMode } from '../hooks/HeaderManager';
import { useParams, useNavigate } from 'react-router-dom';
import { emailValidation, nameValidation, nicknameValidation, passwordValidation, numberValidation } from '../utils/Validation.js';
import Swal from 'sweetalert2'; 
import '../styles/global.css';
import Button from '../components/Button.js';


const Signup = () => {
  const { type } = useParams();
  const { setHeaderMode } = useHeaderMode();
  const navigate = useNavigate();
  const [changedEmail, setChangedEmail] = useState(false);
  const [changedNickname, setChangedNickname] = useState(false);

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
    if(value==="" || value===null)
      return;
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
          url = process.env.REACT_APP_API_URL + 'verify/nickname';
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
        if (type === '이메일') setChangedEmail(true);
        else setChangedNickname(true);
      }
    } catch (error) {
      Swal.fire({
        text: ValidationResult ? `${type}이(가) 이미 사용 중입니다.` : `${type} 입력 값을 확인해 주세요.`,
        icon: 'error',
        confirmButtonText: '확인',
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === '이메일') setChangedEmail(false);
    if (name === '닉네임') setChangedNickname(false);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!nameValidation(formData.이름) || !emailValidation(formData.이메일) || !passwordValidation(formData.비밀번호)) return;

    if (!changedEmail){
        Swal.fire({
          text: '이메일 인증을 진행해 주세요.',
          icon: 'error',
          confirmButtonText: '확인'
        });
        return;
    }
    else if (!changedNickname){
        Swal.fire({
          text: '닉네임 중복 체크를 진행해 주세요.',
          icon: 'error',
          confirmButtonText: '확인'
        });
        return;
    }

    try {
      const response = await axios.post(process.env.REACT_APP_API_URL + 'members', {
        name: formData.이름,
        gender: formData.성별,
        email: formData.이메일,
        password: formData.비밀번호,
        confirmPassword: formData.비밀번호확인,
        nickname: formData.닉네임,
        occupation: formData.직군,
        career: formData.경력,
        type: formData.타입,
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 201) {
        Swal.fire({
          title: '회원가입이 완료되었습니다!',
          confirmButtonText: '확인'
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
        confirmButtonText: '확인'
      });
    }
  };


  
  return (
    <div style={container}>
      <h2 style={titleContainer}>
        <span style={mainTitle}>회원가입</span>
        <span style={{ margin: '0px 5px -6px', fontSize: '18px' }}>|</span>
        <span style={subTitle}>{type==='MENTEE'?'멘티':'멘토'} 정보 입력</span>
      </h2>
      <hr style={{ ...divider, width: '900px' }} />

      <div style={boxWrapper}>
        <h3 style={sectionTitle}>로그인 정보</h3>
        <div style={boxContainer}>
          <div style={inputGroupFull}>
            <label style={label}>이메일</label>
            <div style={inputContainer}>
              <input
                type="text"
                name="이메일"
                value={formData.이메일}
                onChange={handleInputChange}
                onBlur={handleBlur}
                style={input}
              />
              <Button
              color="#FFFFFF"
              margintop="0px"
              width="60px"
              height="40px"
              fontcolor="black"
              radius="4px"
              border="0.5px solid #c9c9c9"
              onClick={() => handleVerify('이메일')}
              >
                인증
              </Button>
            </div>
          </div>
          <div style={inputGroup}>
            <label style={label}>비밀번호</label>
            <input
              type="password"
              name="비밀번호"
              value={formData.비밀번호}
              onChange={handleInputChange}
              onBlur={handleBlur}
              style={input}
            />
          </div>
          <div style={inputGroup}>
            <label style={label}>비밀번호확인</label>
            <input
              type="password"
              name="비밀번호확인"
              value={formData.비밀번호확인}
              onChange={handleInputChange}
              onBlur={handleBlur}
              style={input}
            />
          </div>
        </div>
      </div>

      <div style={boxWrapper}>
        <h3 style={sectionTitle}>관심분야</h3>
        <div style={boxContainer}>
          <div style={inputGroup}>
            <label style={label}>직군</label>
            <select
              name="직군"
              value={formData.직군}
              onChange={handleInputChange}
              style={select}
            >
              <option value="BE">BE</option>
              <option value="FE">FE</option>
            </select>
          </div>
          <div style={inputGroup}>
            <label style={label}>경력사항</label>
            <select
              name="경력"
              value={formData.경력}
              onChange={handleInputChange}
              style={select}
            >
              <option value="ZEROTOONE">0~1년차</option>
              <option value="TWOTOTHREE">2~3년차</option>
              <option value="FOUROROVER">4년차 이상</option>
            </select>
          </div>
        </div>
      </div>

      <div style={boxWrapper}>
        <h3 style={sectionTitle}>개인정보</h3>
        <div style={boxContainer}>
          {['이름', '닉네임', '전화번호'].map((field, index) => (
            <div key={index} style={inputGroup}>
              <label style={label}>{field}</label>
              <div style={inputContainer}>
                <input
                  type="text"
                  name={field}
                  value={formData[field]}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  style={input}
                />
                {field === '닉네임' && (
                      <Button
                      color="#FFFFFF"
                      width="64px"
                      height="40px"
                      fontcolor="black"
                      radius="4px"
                      border="0.5px solid #c9c9c9"
                      padding="6px"
                      onClick={() => handleVerify('닉네임')}
                      >
                        중복체크
                      </Button>
                )}
              </div>
            </div>
          ))}
          <div style={inputGroup}>
            <label style={label}>성별</label>
            <select
              name="성별"
              value={formData.성별}
              onChange={handleInputChange}
              style={select}
            >
              <option value="M">남성</option>
              <option value="F">여성</option>
            </select>
          </div>
        </div>
      </div>

      <Button
                      color="#e0ebf5"
                      width="10vw"
                      height="3vw"
                      fontcolor="black"
                      fontsize="1.1rem"
                      radius="4px"
                      border="0.5px solid #c9c9c9"
                      padding="6px"
                      onClick={handleSignup}
                      >
                        회원가입
                      </Button>
    </div>
  );
};

const container = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginTop: '5vh',
  height: '100%',
  backgroundColor: '#FFF',
};

const titleContainer = {
  marginBottom: '-10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  width: '900px',
  marginLeft: '20px',
};

const mainTitle = {
  fontWeight: 'Bold',
  fontSize: '30px',
};

const subTitle = {
  fontSize: '18px',
  marginTop: '10px',
};

const divider = {
  borderTop: '2px solid #A0A0A0',
  marginBottom: '40px',
};

const boxWrapper = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  width: '800px',
  marginBottom: '50px',
};

const sectionTitle = {
  fontSize: '20px',
  marginBottom: '10px',
};

const boxContainer = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  backgroundColor: '#E0EBF5',
  borderRadius: '20px',
  padding: '20px',
  width: '100%',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
  gap: '20px',
};

const inputGroup = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '48%',
  marginBottom: '15px',
};

const inputGroupFull = {
  ...inputGroup,
  width: '48%',
  margin: '0 50px 0 0'
};

const label = {
  width: '100%',
  textAlign: 'left',
  paddingBottom: '5px',
  fontSize: '14px',
};

const inputContainer = {
  display: 'flex',
  width: '100%',
};

const input = {
  flex: '1',
  width: '360px',
  padding: '8px',
  fontSize: '14px',
  border: '1px solid #ccc',
  backgroundColor: '#fffefe',
  borderRadius: '5px 0 0 5px',
};

const select = {
  flex: '1',
  width: '360px',
  padding: '8px',
  fontSize: '14px',
  border: '1px solid #ccc',
  backgroundColor: '#fffefe',
  borderRadius: '5px',
};

const inlineButton = {
  padding: '8px 15px',
  fontSize: '12px',
  border: '1px solid #ccc',
  borderLeft: 'none',
  borderRadius: '0 5px 5px 0',
  cursor: 'pointer',
  backgroundColor: '#fffefe',
  fontFamily: 'inherit', // 부모 요소의 폰트를 상속받도록 설정
};

const nextButtonStyle = {
  padding: '10px 20px',
  borderRadius: '20px',
  border: '1px solid #ccc',
  fontSize: '16px',
  cursor: 'pointer',
  backgroundColor: '#E0EBF5',
};

export default Signup;
