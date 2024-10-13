import { BrowserRouter, Routes, Route } from 'react-router-dom'; // react-router-dom@^6.3.0
import React from 'react';
import Home from '../pages/Home.js';
import { HeaderManager } from '../hooks/HeaderManager.js';
import Headers from './Header.js';
import Login from '../pages/Login.js';
import SignupOption from '../pages/SignupOption.js'
// import Agree from '../pages/Agree.js';
import Agree from '../pages/Agree.jsx';
// import Signup from '../pages/Signup.js';
import Signup from '../pages/Signup.jsx';
import SignupSuccess from '../pages/SignupSuccess.js';
import Mypage from '../pages/Mypage.js';
import { ProfileProvider } from '../hooks/ProfileContext.js';
import {MemberManager} from '../hooks/MemberManager.js'
import MyNote from '../pages/MyNote.js'
import Cash from '../pages/Cash.js';
import FeedbackT from '../pages/FeedbackT.js';
import FeedbackS from '../pages/FeedbackS.js';
import AdminPage from '../pages/AdminPage.js'
import AdminPageQ from '../pages/AdminPageQ.js';
import Administration from '../pages/Administration.js';
import Choice from '../pages/Choice.js';
import InterviewFeedback from '../pages/InterviewFeedback.js';
import QuestionBoard from '../pages/QuestionBoard.jsx';
import QuestionBoardDetails from '../pages/QuestionBoardContent.jsx';
import QuestionBoardPost from '../pages/QuestionBoardPost.jsx'
import ReviewBoard from '../pages/ReviewBoard.jsx';
import AiHome from '../pages/AiHome.js';
import AiInterview from '../pages/AiInterview.js';
import ResultCheck from '../pages/ResultCheck.js';


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
          <Route path='/signupOption' element={<SignupOption/>} />
          <Route path='/agree' element={<Agree/>} />
          <Route path='/signup/:type' element={<Signup/>} />
          <Route path='/signupSuccess' element={<SignupSuccess/>} />
          <Route path='/mypage' element={<Mypage/>} />
          <Route path='/feedbackT' element={<FeedbackT/>} />
          <Route path='/feedbackS' element={<FeedbackS/>} />
          <Route path='/cash' element={<Cash/>} />
          <Route path='/mynote' element={<MyNote/>} />
          <Route path='/adminpageQ' element={<AdminPageQ/>} />
          <Route path='/adminpage-service' element={<AdminPage/>} />
          <Route path='/administration' element={<Administration/>} />
          <Route path='/choice' element={<Choice/>} />
          <Route path='/interviewfeedback' element={<InterviewFeedback/>} />
          <Route path='/aihome' element={<AiHome/>} />
          <Route path='/aiInterview' element={<AiInterview/>} />
          <Route path='/resultcheck' element={<ResultCheck/>} />
          <Route path='/board/question' element={<QuestionBoard/>} />
          <Route path='/board/question/:boardId' element={<QuestionBoardDetails/>} />
          <Route path='/board/question/post' element={<QuestionBoardPost/>} />
          <Route path='/board/review/' element={<ReviewBoard/>} />
        </Routes>
        </HeaderManager>
      </div>
    </BrowserRouter>
    </ProfileProvider>
    </MemberManager>
  );
}

export default App; // App 컴포넌트를 외부로 export
