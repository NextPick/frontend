import React from 'react';
import '../styles/global.css';
import styled from 'styled-components';

const StyledLine = styled.line`
// 2. 커스텀하고 싶은 부분을 아래 형식 처럼 변경
    border-bottom: ${(props) => props.borderbottom|| "0.5px solid #aaa9a97a"}; /* 줄 색상 및 두께 */
    margin-top: ${(props) => props.margintop|| ' none'}; /* 줄 간격 조정 */
    margin-bottom: ${(props) => props.marginbottom|| ' none'};
    width: ${(props) => props.width ||'100%'}; /* 줄의 너비 설정 */
`;

const Line = (props) => {
    // 1. props {} 안에 추가
    const { borderbottom, margintop, marginbottom, width, children} = props;
    return (
        // 3 아래 props 받을 수 있도록 추가
        <StyledLine
            borderbottom={borderbottom}
            margintop={margintop}
            marginbottom={marginbottom}
            width={width}
        >
            {children}
        </StyledLine>
    );
}

export default Line;