import React, { useEffect } from 'react';
import '../styles/global.css';
import Input from './Input.js';
import styled from 'styled-components';



const StyledBar = styled.div`
display: flex;
flex-direction: row;
width: ${(props) => props.width || '100%'};
    margin-top: ${(props) => props.top || '15px'};
    margin-bottom: ${(props) => props.bottom};
    margin-left: ${(props) => props.left};
    padding: ${(props) => props.padding || '0 5px'};
    align-items: ${(props) => props.alignitem ||'center'};
    height: ${(props) => props.height ||'100%'} ;
    /* 세로 중앙 정렬 */
`;

const SearchBar = (props) => {

    const{width, top, bottom, left, padding, alignitem, height} = props;

    return (
       <StyledBar
       height={height}
       width={width}
       top={top}
       bottom={bottom}
       left={left}
       padding={padding}
       alignitem={alignitem}
       >
            <Input
                placeholder='검색어를 입력하세요'
                $m_height = "10px"
                $m_width = '20vw'
                $m_fontSize = '10px'
                $w_height =  "10px"
                $w_width = '27vw'
                $w_fontSize = '10px'
                $padding="5px"
                marginTop="0px"
                marginBottom="0px"
            />
             {props.children}  {/* 내부 요소 렌더링 */}
        </StyledBar>
    );
};

export default SearchBar;
