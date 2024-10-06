import React, { useState } from 'react';
import styled from 'styled-components';

const SliderContainer = styled.div`
    display: flex; // Flexbox로 수평 정렬
    align-items: center; // 세로 중앙 정렬
    margin: 10px 0; // 위아래 마진
`;

const SliderTrack = styled.div`
    width: 100px; // 슬라이더의 길이
    height: 5px; // 슬라이더의 두께
    background: #ddd; // 슬라이더 트랙 색상
    position: relative; // 자식 요소의 절대 위치 설정을 위한 상대 위치
    cursor: pointer; // 클릭 가능한 포인터 커서
`;

const SliderThumb = styled.div`
     position: absolute; // 트랙 내에서 절대 위치 설정
    width: 10px; // thumb의 너비
    height: 10px; // thumb의 높이
    border-radius: 50%; // 둥근 모양
    border: 1px solid #000000;
    background: #FFFFFF; // thumb 색상
    top: -8px; // 슬라이더 트랙의 중앙에 위치시키기 위한 오프셋
`;

const Label = styled.span`
    margin-left: 15px;
    font-size: 10px;
`;

const options = ['신입', '3년', '5년'];

const ExperienceSlider = () => {
    const [value, setValue] = useState(0);

    const  handleClick = (e) => {
        const rect = e.target.getBoundingClientRect();
        const offsetX = e.clientX - rect.left; // 슬라이더 내의 마우스 X 위치
        const newValue = Math.min(Math.max(Math.floor((offsetX / rect.width) * options.length), 0), options.length - 1);
        setValue(newValue);
    };

    return (
        <SliderContainer>
            <SliderTrack onClick={handleClick}>
                <SliderThumb style={{ left: `${(value / (options.length - 1)) * 100}%` }} />
            </SliderTrack>
            <Label>{options[value]}</Label>
        </SliderContainer>
    );
};

export default ExperienceSlider;
