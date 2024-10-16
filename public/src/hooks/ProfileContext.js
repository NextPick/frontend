import React, { createContext, useContext, useState } from 'react';

// ProfileContext를 생성합니다. 초기값은 undefined로 설정합니다.
const ProfileContext = createContext(undefined);

// ProfileProvider 컴포넌트를 생성합니다.
export const ProfileProvider = ({ children }) => {
    // 상태를 관리하기 위해 useState를 사용하여 profileImage와 setProfileImage를 정의합니다.
    const [profileImage, setProfileImage] = useState(null);
    
    return (
        // ProfileContext.Provider를 사용하여 자식 컴포넌트에 상태를 제공합니다.
        <ProfileContext.Provider value={{ profileImage, setProfileImage }}>
            {children} {/* 자식 컴포넌트를 렌더링합니다. */}
        </ProfileContext.Provider>
    );
};

// ProfileContext를 사용하는 커스텀 훅을 생성합니다.
export const useProfile = () => {
    // useContext를 사용하여 ProfileContext의 값을 가져옵니다.
    const context = useContext(ProfileContext);
    
    // context가 없으면 오류를 발생시킵니다.
    if (!context) {
        throw new Error("useProfile must be used within a ProfileProvider");
    }
    
    return context; // ProfileContext의 값을 반환합니다.
};
