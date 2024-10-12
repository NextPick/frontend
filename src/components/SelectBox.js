import React, { useState } from 'react';
import styled from 'styled-components';
import Font from '../components/Font';




// 스타일드 컴포넌트 정의
const Select = styled.select`
    padding: 5px;
    margin: 10px 6px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: ${(props) => props.size || "8px"};
    cursor: pointer;

    &:focus {
        outline: none;
        border-color: #007bff; /* 포커스 시 테두리 색상 */
        box-shadow: 0 0 5px rgba(0, 123, 255, 0.5); /* 포커스 시 그림자 효과 */
    }
`;


const SelectBox = ({ firstOptions, secondOptions, onFirstChange, onSecondChange, size }) => {
    const [firstSelect, setFirstSelect] = useState('');
    const [secondSelect, setSecondSelect] = useState('');

    const handleFirstSelectChange = (e) => {
        const value = e.target.value;
        setFirstSelect(value);
        setSecondSelect(''); // 첫 번째 선택 변경 시 두 번째 선택 초기화
        if (onFirstChange) {
            onFirstChange(value); // 부모 컴포넌트로 선택값 전달
        }
    };

    const handleSecondSelectChange = (e) => {
        const value = e.target.value;
        setSecondSelect(value);
        if (onSecondChange) {
            onSecondChange(value); // 부모 컴포넌트로 선택값 전달
        }
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <Select 
            size={size}
            value={firstSelect} onChange={handleFirstSelectChange}>
                {firstOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                    
                ))}
            </Select>

            <Font
                font="PretendardL"
                size="10px"
                color="#000000"
                align="center"
                margintop="none"
                justify="center"
                paddingleft="5px"
                paddingtop="15px"
            >
                〉
            </Font>

            <Select value={secondSelect} onChange={handleSecondSelectChange}>
                {(firstSelect
                    ? secondOptions[firstSelect]
                    : Object.values(secondOptions).flat()
                ).map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </Select>
        </div>
    );
};

export default SelectBox;
