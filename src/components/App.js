import { BrowserRouter, Routes, Route } from 'react-router-dom'; // react-router-dom@^6.3.0
import React from 'react';
import Home from '../pages/Home.js';
import { HeaderManager } from '../hooks/HeaderManager.js';
import Headers from './Header.js';
import Login from '../pages/Login.js';
import SignupOption from '../pages/SignupOption.js'
import Agree from '../pages/Agree.jsx';
import Signup from '../pages/Signup.jsx';
import SignupSuccess from '../pages/SignupSuccess.js';
import Mypage from '../pages/Mypage.jsx';
import { ProfileProvider } from '../hooks/ProfileContext.js';
import { MemberManager } from '../hooks/MemberManager.js';
import MyNote from '../pages/MyNote.jsx';
import Cash from '../pages/Cash.js';
import AudioRecorder from '../pages/AudioRecorder.jsx'; 
import FeedbackT from '../pages/FeedbackT.js';
import FeedbackS from '../pages/FeedbackS.js';
import AdminPage from '../pages/AdminPage.js'
import AdminPageQx from '../pages/AdminPageQ.jsx';
import AdministrationX from '../pages/Administration.jsx';
import Choice from '../pages/Choice.js';
import InterviewFeedback from '../pages/InterviewFeedback.js';
import QuestionBoard from '../pages/QuestionBoard.jsx';
import QuestionBoardDetails from '../pages/QuestionBoardContent.jsx';
import QuestionBoardPost from '../pages/QuestionBoardPost.jsx'
import ReviewBoard from '../pages/ReviewBoard.jsx';
import AiHome from '../pages/AiHome.js';
import AiInterview from '../pages/AiInterview.js';
import ResultCheck from '../pages/ResultCheck.js';
import ResultPage from '../pages/ResultPage.js';
import WebRTC from "../pages/WebRTC";
import InterviewRoom from "../pages/InterviewRoom";
import ReviewBoardPost from "../pages/ReviewBoardPost.jsx";
import EditBoardPage from '../pages/EditBoardPage.jsx';  // 새로 추가된 수정 페이지 컴포넌트
import '../styles/global.css';

function App() {
  return (
    <MemberManager>
      <ProfileProvider>
        <BrowserRouter> 
          <div className="App"> 
          <HeaderManager>
          <Headers/>
            <Routes> 
              <Route path="/" element={<Home />} />
              <Route path='/login' element={<Login/>} />
              <Route path='/signupOption' element={<SignupOption/>} />
              <Route path='/agree' element={<Agree/>} />
              <Route path='/signup/:type' element={<Signup/>} />
              <Route path='/signupSuccess' element={<SignupSuccess/>} />
              <Route path='/mypage' element={<Mypage/>} />
              <Route path='/feedbackT' element={<FeedbackT/>} />
              <Route path='/feedbackS' element={<FeedbackS/>} />
              <Route path='/cash' element={<Cash/>} />
              <Route path='/mynote' element={<MyNote/>} />
              <Route path='/adminpageQ' element={<AdminPageQx/>} />
              <Route path='/adminpage-service' element={<AdminPage/>} />
              <Route path='/choice' element={<Choice/>} />
              <Route path='/interviewfeedback' element={<InterviewFeedback/>} />
              <Route path='/aihome' element={<AiHome/>} />
              <Route path='/administration' element={<AdministrationX/>} />
              <Route path='/resultcheck' element={<ResultCheck/>} />
              <Route path='/resultpage' element={<ResultPage/>} />
              <Route path='/aiInterview' element={<AiInterview/>} />
              <Route path='/audio-recorder' element={<AudioRecorder />} />
              <Route path='/board/question' element={<QuestionBoard/>} />
              <Route path='/board/:boardId' element={<QuestionBoardDetails/>} />
              <Route path='/board/edit/:boardId' element={<EditBoardPage/>} /> {/* 수정 페이지 경로 설정 */}
              <Route path='/board/question/post' element={<QuestionBoardPost/>} />
              <Route path='/board/review/post' element={<ReviewBoardPost/>} />
              <Route path='/board/review' element={<ReviewBoard/>} />
              <Route path='/webrtc' element={<WebRTC/>} />
              <Route path='/interviewRoom' element={<InterviewRoom/>} />
              <Route path="/board/question" element={<QuestionBoard />} />
              <Route path="/board/question/post" element={<QuestionBoardPost />} /> {/* 질문 게시판 작성 경로 */}
              <Route path="/board/review/post" element={<ReviewBoardPost />} /> {/* 리뷰 게시판 작성 경로 */}
            </Routes>
          </HeaderManager>
          </div>
        </BrowserRouter>
      </ProfileProvider>
    </MemberManager>
  );
}

export default App;
