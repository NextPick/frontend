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
import { MemberManager } from '../hooks/MemberManager.js';
import MyNote from '../pages/MyNote.js';
import Feedback from '../pages/Feedback.js';
import Cash from '../pages/Cash.js';
import AudioRecorder from '../pages/AudioRecorder.jsx'; // 추가한 페이지 임포트

// App 컴포넌트를 정의하는 함수형 컴포넌트
function App() {
  return (
    <MemberManager>
      <ProfileProvider>
        <BrowserRouter> {/* 라우터 설정 */}
          <div className="App"> {/* 최상위 div 요소, 클래스 이름 "App" */}
            <HeaderManager>
              <Headers />
              <Routes> {/* 경로 설정 */}
                <Route path="/" element={<Home />} />
                <Route path='/login' element={< Login />} />
                <Route path='/singupOption' element={<SignupOption />} />
                <Route path='/agree' element={<Agree />} />
                <Route path='/signup' element={<Signup />} />
                <Route path='/signupSuccess' element={<SignupSuccess />} />
                <Route path='/mypage' element={<Mypage />} />
                <Route path='/feedback' element={<Feedback />} />
                <Route path='/cash' element={<Cash />} />
                <Route path='/mynote' element={<MyNote />} />
                <Route path='/audio-recorder' element={<AudioRecorder />} /> {/* 음성인식 페이지 추가 */}
              </Routes>
            </HeaderManager>
          </div>
        </BrowserRouter>
      </ProfileProvider>
    </MemberManager>
  );
}

export default App;
