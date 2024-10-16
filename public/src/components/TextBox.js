import React from 'react';
import '../styles/global.css';  
import styled from 'styled-components';
import { Link } from 'react-router-dom';  



const StyledTextBox = styled.textarea`
    width: 22.5vw; /* 너비 100% */
    height: 14vh; /* 기본 높이 */
    border: 0.5px solid #ccc; /* 테두리 스타일 */
    border-radius: 5px; /* 모서리 둥글게 */
    padding: 5px; /* 패딩 추가 */
    resize: vertical; /* 세로로 크기 조절 가능 */
    font-size: 7px;
    overflow-y: auto; /* 세로 방향 스크롤 자동 생성 */
    font-family: "PretendardL";
`;

const TextBox = ( {value, onChange, placeholder, readOnly}) => {
    return (
        <StyledTextBox
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            readOnly={readOnly}
        />
    );
}

export default TextBox;