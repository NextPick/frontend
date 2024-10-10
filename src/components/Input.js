 import React, { useRef } from 'react';
import '../styles/global.css';  
import { Link } from 'react-router-dom';  
import styled from 'styled-components';


const InputContainer = styled.div`
 display: flex;
 flex-direction: column; /* 세로 방향으로 정렬 */
 position: relative; //상대위치 지정
`;


// 입력 폼 스타일 정의
const InputForm = styled.input`
    height: ${(props) => props.$w_height}; // 일반 높이 설정
    width: ${(props) => props.$w_width}; // 일반 너비 설정
    border: ${(props) => props.border || '1px solid black'}; // 테두리 스타일 설정
    padding: ${(props) => props.$padding || "10px"}; // 패딩 설정
    font-size: ${(props) => props.$w_fontSize}; // 폰트 크기 설정
    margin-bottom: ${(props) => props.marginBottom || '5px'}; // 아래 여백 설정
    margin-top: ${(props) => props.marginTop || '5px'}; // 위 여백 설정
    resize: none; // 크기 조절 비활성화
    position: relative; // 상대 위치 지정
    border-radius: ${(props)=> props.radius};

    @media all and (max-width: 430px) {
        height: ${(props) => props.$m_height}; // 모바일 높이 설정
        width: ${(props) => props.$m_width}; // 모바일 너비 설정
        font-size: ${(props) => props.$m_fontSize}; // 모바일 폰트 크기 설정
    }

    ${(props) =>
        props.readonly &&
        `
        background-color: #e9ecef; // 읽기 전용일 경우 배경색 변경
        cursor: not-allowed; // 커서를 비활성화 스타일로 변경
    `}
`;

const TextArea = ({
    onChange, // 입력 변화 핸들러
    onBlur,
    onKeyDown, // 키다운 핸들러
    type = 'text', // 기본 입력 타입 설정
    placeholder, // 플레이스홀더
    $m_height, // 모바일 높이
    $m_width, // 모바일 너비
    $m_fontSize, // 모바일 폰트 크기
    $w_height, // 일반 높이
    $w_width, // 일반 너비
    $w_fontSize, // 일반 폰트 크기
    readonly, // 읽기 전용 여부
    value, // 입력 값
    marginBottom,
    marginTop,
    border,
    name,
    $padding,
    radius,

}) => {
    const deleteRef = useRef(null); // 입력필드 참조 생성
    // useKeyboardAvoider(); // 키보드 회피 훅 사용 -> 사용여부 나중 결정
    

    return (
         <InputContainer>
            <InputForm
                className="PretendardL" // 일반 폰트 클래스 적용
                placeholder={placeholder} // 플레이스홀더 설정
                onChange={onChange} // 입력 변화 핸들러 설정
                onBlur={onBlur}
                ref={deleteRef} // 참조 설정
                $m_height={$m_height} // 모바일 높이 속성 설정
                $m_width={$m_width} // 모바일 너비 속성 설정
                $m_fontSize={$m_fontSize} // 모바일 폰트 크기 속성 설정
                $w_height={$w_height} // 일반 높이 속성 설정
                $w_width={$w_width} // 일반 너비 속성 설정
                $w_fontSize={$w_fontSize} // 일반 폰트 크기 속성 설정
                onKeyDown={onKeyDown} // 키다운 핸들러 설정
                type={type} // 타입 설정
                readOnly={readonly} // 읽기 전용 여부 설정
                value={value} // 값 설정
                marginBottom={marginBottom}
                marginTop={marginTop}
                border={border}
                name={name} // name 속성 추가
                $padding={$padding}
                radius={radius}
            />
       
        </InputContainer>
    );
}
export default TextArea;