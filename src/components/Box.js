import React from 'react';
import '../styles/global.css';
import { Link } from 'react-router-dom';
import styled from 'styled-components';



const StyledBox = styled.div`
background-color: ${(props) => props.color || '#579ef03a'} ;
    /* 첫 번째 섹션 배경색 */
    padding: ${(props) => props.padding || '0 5px'};
    /* 좌우 패딩 추가 (선택 사항) */
    display: flex;
    /* Flexbox 사용 */
    align-items: ${(props) => props.alignitem ||'center'};
    /* 세로 중앙 정렬 */
    justify-content: ${(props) => props.justify || 'center'};
    /* 세로 중앙 정렬 */
    flex-direction: ${(props) => props.direction ||'column'};
    height: ${(props) => props.height ||'60vh'} ;
    /* 내용에 맞게 높이 조정 */
    width: ${(props) => props.width || '40vw'};
    margin-top: ${(props) => props.top || '30px'};
    margin-bottom: ${(props) => props.bottom};
    margin-left: ${(props) => props.left};
    border-radius: ${(props) => props.radius|| '10px'};
    border: ${(props) => props.border || '0.2px solid rgb(80, 80, 80)'} ;
    overflow: ${(props) => props.overflow || 'visible'}; /* 필요시 overflow 추가 */

`;

const Box = (props) => {
    const {color, padding, alignitem, justify, direction, height, width, top, bottom, left, radius, border, overflow} = props;
    return (
        <StyledBox
        color={color}
        padding={padding}
        alignitem={alignitem}
        justify={justify}
        direction={direction}
        height={height}
        width={width}
        top={top}
        bottom={bottom}
        left={left}
        radius={radius}
        border={border}
        overflow={overflow}  // overflow prop 추가
        >
            {props.children}  {/* 내부 요소 렌더링 */}
        </StyledBox>
    );
}

export default Box;