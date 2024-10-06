import React, { useEffect, useState } from 'react';
import { useHeaderMode } from '../hooks/HeaderManager';
import '../styles/login.css';
import Button from '../components/Button';
import Font from '../components/Font.js';
import Box from '../components/Box.js'
import Input from '../components/Input.js'
import Slider from '../components/Slider.js'
import { emailValidation, nameValidation, nicknameValidation, passwordValidation, numberValidation } from '../utils/Validation.js'
import { useMember } from '../hooks/MemberManager'; // 회원 정보를 관리하는 훅
import { useNavigate } from 'react-router-dom'; // 페이지 이동을 위한 훅 추가
import Swal from 'sweetalert2'; // 알림을 위한 라이브러리
// import { postMember } from '../services/MemberService.js';


const Signup = () => {

    const { setHeaderMode } = useHeaderMode();
    const navigate = useNavigate(); // 페이지 이동을 위한 navigate 훅
    const { setProfileData } = useMember(); // 프로필 데이터를 업데이트하는 함수
    const labels = ['닉네임', '전화번호', '이름', '이메일', '아이디', '비밀번호', '비밀번호 확인'];
    // const [nickname, setNickname] = useState('');
    // const [email, setEmail] = useState(''); --> 백엔드 연결할 때 씀
    const [password, setPassword] = useState('');
    const [repassword, setRepassword] = useState('');

    // 입력 값 상태 관리
    const [formData, setFormData] = useState({
        nickname: localStorage.getItem('nickname') || '',
        phone: localStorage.getItem('phone') || '', // 초기값 로컬 스토리지에서 가져오기
        name: localStorage.getItem('name') || '', // 초기값 로컬 스토리지에서 가져오기
        email: localStorage.getItem('email') || '', // 초기값 로컬 스토리지에서 가져오기
        username: '',
        password: '',
        repassword: '',
    });

    useEffect(() => {
        setHeaderMode('signup');

        // 입력 값 로컬 스토리지에서 설정
        const storedValues = {
            nickname: localStorage.getItem('nickname') || '',
            phone: localStorage.getItem('phone') || '',
            name: localStorage.getItem('name') || '',
            email: localStorage.getItem('email') || '',
        };
       
        setFormData(prevState => ({
            ...prevState,
            ...storedValues, // 모든 필드를 한번에 업데이트
        }));
    }, []); // 의존성 배열을 빈 배열로 설정하여 컴포넌트가 마운트될 때만 실행

    // 입력 값 변경 핸들러
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
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

    // 회원가입 버튼 클릭 핸들러
    const handleSignup = async () => {
        const { nickname, email, password, name, phone } = formData;
        console.log('눌려짐')


        if (!nameValidation(name)) return;  // 이름이 유효하지 않으면 종료
        if (!emailValidation(email)) return; // 이메일이 유효하지 않으면 종료
        if (!passwordValidation(password)) return; // 비밀번호가 유효하지 않으면 종료

        // 회원 정보 상태 업데이트
        setProfileData({ name, email, nickname, phone });

        // **로컬 스토리지에 사용자 정보 저장**
        localStorage.setItem('nickname', nickname); // 추가
        localStorage.setItem('email', email); // 추가
        localStorage.setItem('name', name); // 추가
        localStorage.setItem('phone', phone); // 추가

        Swal.fire({
            title: '회원가입이 완료되었습니다!',
            confirmButtonText: '확인'
        }).then((result) => {
            if (result.isConfirmed) {
                navigate('/mypage'); // 회원가입 완료 후 마이페이지로 이동
            }
        });

        // 회원가입 API 요청 처리 백엔드 연결할 때 사용하고 지금 정보 어쳐피 계속 저장 안됨 상태 그래서 백엔드 연결할 때 다시 상태 갖고 있도록 함
        // const response = await postMember(email, password, nickname);

        // if (response?.status === 201) {
        //     Swal.fire({
        //         title: '회원가입이 완료되었습니다!',
        //         confirmButtonText: '확인'
        //     }).then((result) => {
        //         if (result.isConfirmed) {
        //             navigate('/mypage'); // 회원가입 완료 후 마이페이지로 이동
        //         }
        //     });
        // } else if (response?.status === 409) {
        //     Swal.fire({
        //         text: '이미 존재하는 이메일입니다.',
        //         icon: 'error',
        //         confirmButtonText: '확인'
        //     });
        // } else if (response?.status >= 500) {
        //     Swal.fire({
        //         text: '회원가입 중 오류가 발생했습니다. 다시 시도해 주세요.',
        //         icon: 'error',
        //         confirmButtonText: '확인'
        //     });
    }
    const verifyPassword = password === repassword ? '일치합니다' : '불일치합니다';


    return (
        <div className='wrap'>
            <Box height="100%">
                {/* 각 입력 필드를 묶어주는 div */}
                {Array.from({ length: labels.length }, (_, index) => (
                    // 반복문을 통해 8개의 필드를 생성
                    <div key={index} style={{ display: 'flex', alignItems: 'flex-start' }}>
                        <div style={{ width: '65px', textAlign: 'left' }}>
                            <Font
                                font="PretendardL"
                                size="9px"
                                color="#000000"
                                align="left"
                                margintop="12px"
                            >
                                {labels[index]} {/* 배열의 내용을 사용 */}
                            </Font>
                        </div>
                        <div>
                            <Input
                                name={['nickname', 'phone', 'name', 'email', 'username', 'password', 'repassword'][index]}
                                value={formData[['nickname', 'phone', 'name', 'email', 'username', 'password', 'repassword'][index]]}
                                onChange={handleInputChange}
                                onBlur={handleBlur} //
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
                            size="9px"
                            color="#000000"
                            align="left"
                            margintop="13px"
                        > 경력사항
                        </Font>
                    </div>
                    <Slider></Slider>
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

}
export default Signup;


