// import logo from './logo.svg'; // 로고 이미지를 import
// import './App.css'; // CSS 스타일 시트를 import
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // react-router-dom@^6.3.0
import React from 'react';
import Home from '../pages/Home.js';
import { HeaderManager } from '../hooks/HeaderManager.js';
import Headers from './Header.js';

// App 컴포넌트를 정의하는 함수형 컴포넌트
function App() {
  return (
    <BrowserRouter> {/* 라우터 설정 */}
      <div className="App"> {/* 최상위 div 요소, 클래스 이름 "App" */}
      <HeaderManager>
      <Headers/>
        <Routes> {/* 경로 설정 */}
          <Route path="/" element={<Home />} />
        </Routes>
        </HeaderManager>
      </div>
    </BrowserRouter>
  );
}

export default App; // App 컴포넌트를 외부로 export
