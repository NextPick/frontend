import Swal from "sweetalert2";

// 입력값 검증 함수
const regexValid = (input, mode) => {
    if (mode === 'password') {
        const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;
        return regex.test(input);
    } else if (mode === 'name') {
        const regex = /^[a-zA-Z가-힣]+$/;
        return regex.test(input);
    } else if (mode === 'email') {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regex.test(input);
    } else if (mode === 'number') {
        const regexPhone = /^\d{11}$/;
return regexPhone.test(input);
    }
    return false;
};

// 이메일 검증 함수
export const emailValidation = (email) => {
    if (!email) {
        Swal.fire({
            text: '이메일을 입력하세요',
            icon: 'error'
        });
        return false;
    } else if (!regexValid(email, 'email')) {
        Swal.fire({
            text: '이메일 형식을 맞춰주세요',
            icon: 'error'
        });
        return false;
    }
    return true;
};

// 이름 검증 함수
export const nameValidation = (name) => {
    if (!name) {
        Swal.fire({
            text: '이름을 입력해주세요',
            icon: 'error'
        });
        return false;
    } else if (name.length > 10) {
        Swal.fire({
            text: '이름은 10자 이하입니다',
            icon: 'error'
        });
        return false;
    } else if (!regexValid(name, 'name')) {
        Swal.fire({
            text: '이름은 한글과 영어만 가능합니다',
            icon: 'error'
        });
        return false;
    }
    return true;
};

// 닉네임 검증 함수
export const nicknameValidation = (name) => {
    if (!name) {
        Swal.fire({
            text: '닉네임을 입력해주세요',
            icon: 'error'
        });
        return false;
    } else if (name.length > 10) {
        Swal.fire({
            text: '닉네임은 10자 이하입니다',
            icon: 'error'
        });
        return false;
    } else if (!regexValid(name, 'name')) {
        Swal.fire({
            text: '닉네임은 한글과 영어만 가능합니다',
            icon: 'error'
        });
        return false;
    }
    return true;
};

// 이름 검증 함수
export const numberValidation = (phone) => {
    const regexPhone = /^\d{10,11}$/;
    if (!phone) {
        Swal.fire({
            text: '전화번호를 입력해주세요',
            icon: 'error'
        });
        return false;
    } else if (!regexPhone.test(phone)) {
        Swal.fire({
            text: '전화번호는 숫자만 포함되며 11자리여야 합니다',
            icon: 'error'
        });
        return false;
    }
    return true;
};

// 비밀번호 검증 함수
export const passwordValidation = (password) => {
    if (!password) {
        Swal.fire({
            text: '비밀번호를 입력해주세요',
            icon: 'error'
        });
        return false;
    } else if (password.length < 8) {
        Swal.fire({
            text: '비밀번호는 8자 이상입니다',
            icon: 'error'
        });
        return false;
    } else if (password.length > 16) {
        Swal.fire({
            text: '비밀번호는 16자 이내입니다',
            icon: 'error'
        });
        return false;
    } else if (!regexValid(password, 'password')) {
        Swal.fire({
            text: '비밀번호에는 영어와 숫자, 특수문자가 포함되어야 합니다',
            icon: 'error'
        });
        return false;
    }
    return true;
};
