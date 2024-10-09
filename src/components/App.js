import { BrowserRouter, Routes, Route } from 'react-router-dom'; // react-router-dom@^6.3.0
import React from 'react';
import Home from '../pages/Home.js';
import { HeaderManager } from '../hooks/HeaderManager.js';
import Headers from './Header.js';
import Login from '../pages/Login.js';
import SignupOption from '../pages/SignupOption.js'
import Agree from '../pages/Agree.js';
import Signup from '../pages/Signup.js';
import SignupSuccess from '../pages/SignupSuccess.js';
import Mypage from '../pages/Mypage.js';
import { ProfileProvider } from '../hooks/ProfileContext.js';
import {MemberManager} from '../hooks/MemberManager.js'
import MyNote from '../pages/MyNote.js'
import Feedback from '../pages/Feedback.js';
import Cash from '../pages/Cash.js';
import WebRTC from "../pages/WebRTC";
import InterviewRoom from "../pages/InterviewRoom"


// App 컴포넌트를 정의하는 함수형 컴포넌트
function App() {
  return (
    <MemberManager>
      <ProfileProvider>
    <BrowserRouter> {/* 라우터 설정 */}
      <div className="App"> {/* 최상위 div 요소, 클래스 이름 "App" */}
      <HeaderManager>
      <Headers/>
        <Routes> {/* 경로 설정 */}
          <Route path="/" element={<Home />} />
          <Route path='/login' element={< Login/>} />
          <Route path='/singupOption' element={<SignupOption/>} />
          <Route path='/agree' element={<Agree/>} />
          <Route path='/signup' element={<Signup/>} />
          <Route path='/signupSuccess' element={<SignupSuccess/>} />
          <Route path='/mypage' element={<Mypage/>} />
          <Route path='/feedback' element={<Feedback/>} />
          <Route path='/cash' element={<Cash/>} />
          <Route path='/mynote' element={<MyNote/>} />
          <Route path='/webrtc' element={<WebRTC/>} />
          <Route path='/interviewRoom' element={<InterviewRoom/>} />
        </Routes>
        </HeaderManager>
      </div>
    </BrowserRouter>
    </ProfileProvider>
    </MemberManager>
  );
}

export default App; // App 컴포넌트를 외부로 export
