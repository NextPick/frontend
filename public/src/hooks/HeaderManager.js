import React, { createContext, useContext, useState } from 'react';

// HeaderContext를 생성하기 위한 기본 값 설정
const HeaderContext = createContext(undefined);

// HeaderManager 컴포넌트 정의
// 이 컴포넌트는 children을 받아 HeaderContext.Provider로 감싸는 역할을 합니다.
export const HeaderManager = ({ children }) => {
    // 헤더 모드의 상태를 관리하는 useState 훅
    const [headerMode, setHeaderMode] = useState('main'); // 초기값은 'main'

    return (
        // HeaderContext.Provider를 사용하여 headerMode와 setHeaderMode를 자식 컴포넌트에 제공합니다.
        <HeaderContext.Provider value={{ headerMode, setHeaderMode }}>
            {children} {/* 자식 컴포넌트를 렌더링 */}
        </HeaderContext.Provider>
    );
};

// useHeaderMode 훅 정의
// 이 훅은 HeaderContext의 값을 사용하기 위해 만든 사용자 정의 훅입니다.
export const useHeaderMode = () => {
    // HeaderContext에서 현재 context 값을 가져옵니다.
    const context = useContext(HeaderContext);

    // context가 undefined일 경우 오류를 발생시켜 사용자가 헤더 정보를 사용할 수 없음을 알립니다.
    if (context === undefined) {
        throw new Error('헤더 정보 없음');
    }

    // context 값을 반환하여 headerMode와 setHeaderMode에 접근할 수 있게 합니다.
    return context;
};
