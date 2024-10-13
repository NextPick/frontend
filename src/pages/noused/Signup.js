import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHeaderMode } from '../hooks/HeaderManager';
import '../styles/login.css';
import Button from '../components/Button';
import Font from '../components/Font.js';
import Box from '../components/Box.js';
import Input from '../components/Input.js';
import Slider from '../components/Slider.js';
import { emailValidation, nameValidation, nicknameValidation, passwordValidation, numberValidation } from '../utils/Validation.js';
import { useMember } from '../hooks/MemberManager'; // 회원 정보를 관리하는 훅
import { useNavigate } from 'react-router-dom'; // 페이지 이동을 위한 훅 추가
import Swal from 'sweetalert2'; // 알림을 위한 라이브러리
// import { postMember } from '../services/MemberService.js';

const Signup = () => {

    const { setHeaderMode } = useHeaderMode();
    const navigate = useNavigate(); // 페이지 이동을 위한 navigate 훅
    const { setProfileData } = useMember(); // 프로필 데이터를 업데이트하는 함수
    const labels = ['닉네임', '전화번호', '이름', '이메일', '아이디', '비밀번호', '비밀번호 확인', '직군'];
    const [password, setPassword] = useState('');
    const [repassword, setRepassword] = useState('');
    const [experience, setExperience] = useState(''); // 선택된 경력사항 상태 관리

    // 입력 값 상태 관리
    const [formData, setFormData] = useState({
        nickname: '',
        phone: '',
        name: '',
        email: '',
        username: '',
        password: '',
        repassword: '',
        occupation: 'BE', // 기본값 설정
        career: 'ZEROTOONE', // 기본값 설정
        type: 'MENTEE' // 기본값 설정
    });

    useEffect(() => {
        setHeaderMode('signup');
    }, []);

    // 입력 값 변경 핸들러
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;

        if (name === 'email') {
            emailValidation(value);
        } else if (name === 'name') {
            nameValidation(value);
        } else if (name === 'password') {
            passwordValidation(value);
        } else if (name === 'nickname') {
            nicknameValidation(value);
        } else if (name === 'phone') {
            numberValidation(value);
        }
    };

    // 경력 사항을 서버에 전달할 형식으로 변환하는 함수
    const handleExperienceChangeToAxios = (e) => {
        switch(e) {
            case '0~1년':
                return 'ZEROTOONE';
            case '2~3년':
                return 'TWOTOTHREE';
            default:
                return 'FOUROROVER';
        }
    };

    // 회원가입 버튼 클릭 핸들러
    const handleSignup = async () => {
        const { nickname, email, password, name, phone } = formData;
        console.log('눌려짐');
        
        const formattedExperience = handleExperienceChangeToAxios(experience);
        console.log(formattedExperience);

        if (!nameValidation(name)) return;  // 이름이 유효하지 않으면 종료
        if (!emailValidation(email)) return; // 이메일이 유효하지 않으면 종료
        if (!passwordValidation(password)) return; // 비밀번호가 유효하지 않으면 종료

        console.log('test2');

        // 회원 정보 상태 업데이트
        setProfileData({ name, email, nickname, phone });

        // 서버에 POST 요청 보내기
        try {
            console.log('test3');   
            console.log(name, email, nickname, phone,password,repassword,formData.occupation,formattedExperience,formData.type);   
            const response = await axios.post(process.env.REACT_APP_BASED_URL+'/members', {
                name,
                gender: 'M',
                email,
                password,
                confirmPassword: password, // 비밀번호 확인 필드 추가
                nickname,
                occupation: formData.occupation,
                career: formattedExperience, // 경력 사항 값 전달
                type: formData.type,
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('test4');   

            if (response.status === 201) { // 상태 코드가 201일 경우 성공
                Swal.fire({
                    title: '회원가입이 완료되었습니다!',
                    confirmButtonText: '확인'
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate('/mypage'); // 회원가입 완료 후 마이페이지로 이동
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

    const verifyPassword = password === repassword ? '일치합니다' : '불일치합니다';

    return (
        <div className='wrap'>
            <Box height="100%">
                {/* 각 입력 필드를 묶어주는 div */}
                {Array.from({ length: labels.length }, (_, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'flex-start' }}>
                        <div style={{ width: '80px', textAlign: 'left'}}>
                            <Font
                                font="PretendardL"
                                size="14px"
                                color="#000000"
                                align="left"
                                margintop="12px"
                            >
                                {labels[index]} {/* 배열의 내용을 사용 */}
                            </Font>
                        </div>
                        <div>
                            <Input
                                name={['nickname', 'phone', 'name', 'email', 'username', 'password', 'repassword','occupation'][index]}
                                value={formData[['nickname', 'phone', 'name', 'email', 'username', 'password', 'repassword','occupation'][index]]}
                                onChange={handleInputChange}
                                onBlur={handleBlur} //
                                marginTop="10px"
                                $w_height="2px" // 입력 박스의 높이
                                $w_width="130px" // 입력 박스의 너비
                                $w_fontSize="8px" // 입력 글자의 크기
                                border="0.5px solid black" // 입력 박스의 테두리
                                style={{ marginLeft: '10px' }} // 입력 박스와 레이블 간의 간격 조정
                            />
                        </div>
                    </div>
                ))}
                {/* 경력사항과 슬라이더를 수평으로 나열하기 위해 div로 감싸기 */}
                <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <div style={{ width: '80px', textAlign: 'left' }}>
                        <Font
                            font="PretendardL"
                            size="14px"
                            color="#000000"
                            align="left"
                            margintop="13px"
                        > 경력사항
                        </Font>
                    </div>
                    <Slider onSelect={setExperience} />
                </div>
                <Button
                    color="#FFFFFF"
                    width="25vh"
                    textcolor="#000000"
                    margintbottom="10px"
                    height="25px"
                    border="0.5px solid black;"
                    radius="5px"
                    hoverColor="#A0AFC1"
                    fontfamily="PretendardL"
                    onClick={handleSignup}
                >
                    회원가입하기
                </Button>
            </Box>
        </div>
    );
};

export default Signup;
