import React from 'react';
import '../styles/global.css';
import styled from 'styled-components';

const StyledButton = styled.button`
// 2. 커스텀하고 싶은 부분을 아래 형식 처럼 변경
background-color: ${(props) => (props.active ? '#137df696' : props.color || 'transparent')};
transition: background-color 0.3s ease, color 0.3s ease, transform 0.3s ease;    
width: ${(props) => props.width};
  color: ${(props) => props.textcolor}; /* 텍스트 색상 */
  margin-top: ${(props) => props.margintop || "0px"};
  margin-bottom: ${(props) => props.margintbottom || "0px"};
  margin-right: ${(props) => props.marginright};
  margin-left: ${(props) => props.marginleft};
  height: ${(props) => props.height};
  border: ${(props) => props.border || 'none'}; /* 기본 테두리 제거 */
  border-radius: ${(props) => props.radius || '25px'}; /* 둥근 테두리 */
  font-size: ${(props) => props.fontsize || '0.9rem'}; /* 폰트 크기 */
  font-family: ${(props) => props.fontfamily || '"Pretendard"'};
  cursor: pointer; /* 커서 모양 변경 */
  align-items: ${(props) => props.align || 'center'}; /* 수직 정렬을 중앙으로 조정 */
    justify-content: ${(props) => props.justify || 'center'}; /* 수평 정렬을 중앙으로 조정 */
    margin-left: ${(props) => props.left};
    margin-right: ${(props) => props.right};
    padding: ${(props) => props.padding};
    display: ${(props) => props.display};
    color: ${(props) => props.fontcolor || "black"};
    text-align: ${(props) => props.textalign};

  &:hover {
    background-color: ${(props) => props.hoverColor || '#0077ff96'};
    color: ${(props) => props.hoverTextColor || '#ffffff'};
    transform: scale(${(props) => props.scale || 1.1});
  }
`;

const Button = (props) => {
  // 1. props {} 안에 추가
  const {    hoverTextColor, active, color,textalign, fontcolor, width, children, textcolor, margintop, margintbottom, marginleft, marginright, height, right, radius, border, hoverColor, fontsize, fontfamily, onClick, align, justify, left, padding, display } = props;
  return (
    // 3 아래 props 받을 수 있도록 추가
    <StyledButton
    active={active}
      color={color}
      fontcolor={fontcolor}
      hoverTextColor={hoverTextColor} 
      width={width}
      textalign={textalign}
      textcolor={textcolor}
      margintop={margintop}
      margintbottom={margintbottom}
      marginright={marginright}
      marginleft={marginleft}
      height={height}
      radius={radius}
      border={border}
      right={right}
      hoverColor={hoverColor}
      fontsize={fontsize}
      fontfamily={fontfamily}
      onClick={onClick} // StyledButton에 onClick 전달
      align={align}
      justify={justify}
      left={left}
      padding={padding}
      display={display}
    >
      {children}
    </StyledButton>
  );
}

export default Button;