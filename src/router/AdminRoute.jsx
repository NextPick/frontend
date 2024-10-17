import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // 로컬스토리지에서 이메일 정보 가져오기
    const userEmail = localStorage.getItem('email');

    // 이메일이 admin@naver.com이 아니면 메인 페이지로 리다이렉트
    if (userEmail !== 'admin@naver.com') {
      navigate('/');
    }
  }, [navigate]);

  return (
    <>
      {/* 이메일이 admin@naver.com이면 해당 컴포넌트 보여주기 */}
      {children}
    </>
  );
};

export default AdminRoute;
