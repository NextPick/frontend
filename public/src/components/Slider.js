import React, { useState } from 'react';
import styled from 'styled-components';

const SliderContainer = styled.div`
    display: flex;
    align-items: center;
    margin: 10px 0;
`;

const SliderTrack = styled.div`
    width: 200px;
    height: 5px;
    background: #ddd;
    position: relative;
    cursor: pointer;
`;

const SliderThumb = styled.div`
    position: absolute;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    border: 1px solid #000000;
    background: #FFFFFF;
    top: -2px;
`;

const Label = styled.span`
    margin-left: 15px;
    font-size: 14px;
`;

const options = ['0~1년', '2~3년', '4년이상'];

const ExperienceSlider = ({ onSelect }) => {
    const [value, setValue] = useState(0);

    const handleClick = (e) => {
        const rect = e.target.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const newValue = Math.min(Math.max(Math.floor((offsetX / rect.width) * options.length), 0), options.length - 1);
        setValue(newValue);
        onSelect(options[newValue]); // 선택된 옵션 값을 부모 컴포넌트로 전달
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
