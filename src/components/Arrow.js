import React from 'react';
import styled, { keyframes } from 'styled-components';

const bounce = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(5px); /* 위로 이동 */
  }
`;

const Arrow = styled.div`
  display: inline-block;
    width: 0px;
    height: 0px;
    border-left: 35px solid transparent; /* 왼쪽 경계 투명 */
  border-right: 35px solid transparent; /* 오른쪽 경계 투명 */
  border-top: 35px solid #ffd67a; /* 위쪽 경계 - 화살표 색상 */
    transform: rotate(-45deg);
  animation: ${bounce} 0.9s infinite; /* 애니메이션 설정 */
  margin: 10px 0; /* 위아래 여백 */
`;

const ScrollArrow = () => {
    return <Arrow />;
};

export default ScrollArrow;
