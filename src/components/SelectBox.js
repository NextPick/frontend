import React, { useState } from 'react';
import styled from 'styled-components';
import Font from '../components/Font';




// 스타일드 컴포넌트 정의
const Select = styled.select`
    padding: 5px;
    margin: 10px 6px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 8px;
    cursor: pointer;

    &:focus {
        outline: none;
        border-color: #007bff; /* 포커스 시 테두리 색상 */
        box-shadow: 0 0 5px rgba(0, 123, 255, 0.5); /* 포커스 시 그림자 효과 */
    }
`;


const SelectBox = () => {
    // 첫 번째 셀렉트 박스의 상태
    const [firstSelect, setFirstSelect] = useState('');
    // 두 번째 셀렉트 박스의 상태
    const [secondSelect, setSecondSelect] = useState('');

    // 첫 번째 셀렉트 박스의 옵션
    const firstOptions = [
        { value: '', label: 'FE/BE/CS' },
        { value: 'option1', label: 'FE' },
        { value: 'option2', label: 'BE' },
        { value: 'option3', label: 'CS' },
    ];

    // 두 번째 셀렉트 박스의 옵션을 결정
    const secondOptions = {
        option1: [
            { value: 'subOption1', label: 'FE 옵션 1-1' },
            { value: 'subOption2', label: 'FE 옵션 1-2' },
        ],
        option2: [
            { value: 'subOption3', label: 'BE 옵션 2-1' },
            { value: 'subOption4', label: 'BE 옵션 2-2' },
        ],
        option3: [
            { value: 'subOption5', label: 'CS 옵션 3-1' },
            { value: 'subOption6', label: 'CS 옵션 3-2' },
        ]
    };

    // 첫 번째 셀렉트 박스의 선택을 처리하는 함수
    const handleFirstSelectChange = (e) => {
        setFirstSelect(e.target.value);
        setSecondSelect(''); // 첫 번째 선택 변경 시 두 번째 선택 초기화
    };

    // 두 번째 셀렉트 박스의 선택을 처리하는 함수
    const handleSecondSelectChange = (e) => {
        setSecondSelect(e.target.value);
    };

    return (
        <div style={{display: 'flex', alignItems: 'center'}}>

            {/* 첫 번째 셀렉트 박스 */}
            <Select value={firstSelect} onChange={handleFirstSelectChange}>
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
         
            {/* 두 번째 셀렉트 박스 - 항상 표시 */}
            <Select value={secondSelect} onChange={handleSecondSelectChange}>
                {/* 첫 번째 선택에 따라 옵션 변경 */}
                {(firstSelect
                    ? secondOptions[firstSelect]
                    : Object.values(secondOptions).flat() // 모든 옵션 표시
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
