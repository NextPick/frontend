import React from 'react';
import '../styles/global.css';
import styled from 'styled-components';

const StyledFont = styled.p`
    font-family: ${(props) => props.font || "PretendardB"};
  font-size: ${(props) => props.size || '1rem'}; /* 폰트 크기, 기본값은 1rem */
  color: ${(props) => props.color || '#000'}; /* 텍스트 색상, 기본값은 검정색 */
  margin-top: ${(props) => props.margintop || '0px'}; /* 마진, 기본값은 0 */
  margin-left: ${(props) => props.marginleft || 'none'};
  margin-bottom: ${(props) => props.marginbottom || '0px'};
  margin-right: ${(props) => props.marginright};
  text-align: ${(props) => props.align || 'left'}; /* 텍스트 정렬, 기본값은 왼쪽 */
  padding-top: ${(props) => props.paddingtop || "0px"};
  padding-bottom: ${(props) => props.paddingbottom || "0px"};
  padding-left: ${(props) => props.paddingleft || "0px"};
  letter-spacing: ${(props) => props.spacing}; /* 글자 사이에 2픽셀 간격 추가 */
  line-height: ${(props) => props.height};
  justify-content: ${(props) => props.justify || 'center'}; /* 수평 정렬을 중앙으로 조정 */
  align-items: ${(props) => props.alignitem};
  font-weight: ${(props) => props.weight};
`;

const Font = (props) => {
    // 1.props{} 안에 추가
    const{font, size, color, align, children, margintop, marginleft, marginright, marginbottom,  paddingtop, paddingbottom, paddingleft, spacing, height, justify, alignitem, weight} = props;

    return (
        // 3. 아래 props 받을 수 있도록 추가
        <StyledFont
        font={font} 
        size={size} 
        color={color}
        align={align}
        margintop={margintop}
        marginleft={marginleft}
        marginright={marginright}
        marginbottom={marginbottom}
        paddingtop={paddingtop}
        paddingbottom={paddingbottom}
        paddingleft={paddingleft}
        spacing={spacing}
        height={height}
        justify={justify}
        alignitem={alignitem}
        weight={weight}
        >
            {children}
        </StyledFont>
    );
  }
  
  export default Font;