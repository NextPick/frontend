import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHeaderMode } from '../hooks/HeaderManager';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Slider from '../components/Slider';
import { emailValidation, nameValidation, nicknameValidation, passwordValidation, numberValidation } from '../utils/Validation.js';
import iconImage from '../assets/logo.png'; 

const Signup = () => {
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
    타입: 'MENTEE'
  });

  const [experience, setExperience] = useState(''); 

  useEffect(() => {
    setHeaderMode('signup');
  }, [setHeaderMode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if(name === '이메일'){
        setChangedEmail(false);
    }
    else if(name === '닉네임'){
        setChangedNickname(false);
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
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

  const handleExperienceChangeToAxios = (experience) => {
    switch(experience) {
      case '0~1년':
        return 'ZEROTOONE';
      case '2~3년':
        return 'TWOTOTHREE';
      default:
        return 'FOUROROVER';
    }
  };

  const handleVerify = async (type) => {
    let ValidationResult = true;
    try {
      let url, body;
      if (type === '이메일') {
        if(!emailValidation(formData.이메일))
            ValidationResult = false;
        else{
            url = 'http://localhost:8080/members/verify/email';
            body = { email: formData.이메일 };
        }
      } else if (type === '닉네임') {
        if(!nicknameValidation(formData.닉네임))
            ValidationResult = false;
        else{
        url = 'http://localhost:8080/members/verify/nickname';
        body = { nickname: formData.닉네임 };
        }
      }
      const response = await axios.post(url, body, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.status === 200) {
        Swal.fire({
          text: `${type}이(가) 사용 가능합니다.`,
          icon: 'success',
          confirmButtonText: '확인'
        });
        if(type === '이메일')
            setChangedEmail(true);
        else
            setChangedNickname(true);
      }
    } catch (error) {
        if(ValidationResult){
            Swal.fire({
                    text: `${type}이(가) 이미 사용 중입니다.`,
                    icon: 'error',
                    confirmButtonText: '확인'
            });
        }else{
            Swal.fire({
                    text: `${type} 입력 값을 확인해 주세요.`,
                    icon: 'error',
                    confirmButtonText: '확인'
            });
        }
    }
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

    const formattedExperience = handleExperienceChangeToAxios(experience);

    try {
      const response = await axios.post('http://localhost:8080/members', {
        name: formData.이름,
        gender: formData.성별,
        email: formData.이메일,
        password: formData.비밀번호,
        confirmPassword: formData.비밀번호확인,
        nickname: formData.닉네임,
        occupation: formData.직군,
        career: formattedExperience,
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
    <div style={styles.container}>
      <img src={iconImage} alt="아이콘" style={styles.icon} /> 
      <div style={SignupTitle}>회원가입</div>
      <div style={styles.formContainer}>
        <form onSubmit={handleSignup}>
          {['이름', '닉네임', '이메일', '비밀번호', '비밀번호확인', '전화번호', '성별', '직군'].map((field, index) => (
            <div key={index} style={styles.inputGroup}>
              <label style={styles.label}>{field.toUpperCase()}</label>
              <div style={styles.inputContainer}>
                <input 
                  type={field.includes('비밀번호') ? 'password' : 'text'}
                  name={field}
                  value={formData[field]}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  style={styles.input}
                />
                {(field === '닉네임' || field === '이메일') && (
                  <button type="button" style={styles.inlineButton} onClick={() => handleVerify(field)}>
                    {field === '이메일' ? '인증' : '중복체크'}
                  </button>
                )}
              </div>
            </div>
          ))}

          <div style={styles.inputGroup}>
            <label style={styles.label}>경력사항</label>
            <Slider onSelect={setExperience} />
          </div>

          <button type="submit" style={styles.submitButton}>회원가입</button>
        </form>
      </div>
    </div>
  );
};

const SignupTitle = {
    textAlign: 'center',
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
  };
const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#FFF',
    },
    icon: {
      marginBottom: '20px',
    },
    formContainer: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#D3E2ED',
      padding: '50px 30px 30px 30px',
      borderRadius: '10px',
      width: '40vw',
      minWidth: '400px',
      maxWidth: '600px',
      textAlign: 'center',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      marginBottom: '10vh',
    },
    inputGroup: {
      width: '100%',
      marginBottom: '15px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    label: {
      width: '80px',
      textAlign: 'left',
      paddingRight: '10px',
      fontSize: '14px',
    },
    inputContainer: {
      display: 'flex',
      justifyContent: 'center',
      flexGrow: 1,
      maxWidth: '300px',
    },
    input: {
      flex: '1',
      padding: '8px',
      fontSize: '14px',
      border: '1px solid #ccc',
      backgroundColor: '#fffefe',
      borderRadius: '5px 0 0 5px',
    },
    inlineButton: {
      padding: '8px 15px',
      width: '80px',
      fontSize: '12px',
      border: '1px solid #ccc',
      borderLeft: 'none',
      borderRadius: '0 5px 5px 0',
      cursor: 'pointer',
      backgroundColor: '#fffefe',
    },
    submitButton: {
      backgroundColor: '#fffefe',
      border: 'none',
      padding: '10px 0',
      width: '100%',
      fontSize: '14px',
      cursor: 'pointer',
      borderRadius: '5px',
      marginTop: '15px',
    }
  };
  
  export default Signup;
