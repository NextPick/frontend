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
import AdminPageQadd from '../pages/AdminPageQadd.jsx';
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
import ReviewBoardPost from "../pages/ReviewBoardPost.jsx";
import EditBoardPage from '../pages/EditBoardPage.jsx'; 
import InterviewRoom from "../pages/InterviewRoom"
import '../styles/global.css';
import Not from '../pages/Not.js';

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
                <Route path='/signupOption' element={<SignupOption />} />
                <Route path='/not' element={<Not />} />

                {/* 회원가입 페이지 */}
                <Route path='/agree' element={<Agree />} />
                <Route path='/signup/:type' element={<Signup />} />
                <Route path='/signupSuccess' element={<SignupSuccess />} />
                
                {/* 마이 페이지 */}
                <Route path='/mypage' element={<Mypage />} />
                <Route path='/feedbackT' element={<FeedbackT />} />
                <Route path='/feedbackS' element={<FeedbackS />} />
                <Route path='/cash' element={<Cash />} />
                <Route path='/mynote' element={<MyNote />} />

                {/* 관리자 페이지 */}
                <Route path='/admin/question' element={<AdminPageQx />} />
                <Route path='/admin/question/:questionId' element={<AdminPageQadd />} />
                <Route path='/admin/service' element={<AdminPage />} />
                <Route path='/admin' element={<AdministrationX />} />

                {/* 화상면접 페이지 */}
                <Route path='/choice' element={<Choice />} />
                <Route path='/webrtc' element={<WebRTC />} />
                <Route path='/interviewRoom' element={<InterviewRoom />} />
                <Route path='/interviewfeedback' element={<InterviewFeedback />} />
                
                {/* AI면접 페이지 */}
                <Route path='/aihome' element={<AiHome />} />
                <Route path='/aiInterview' element={<AiInterview />} />
                <Route path='/resultcheck' element={<ResultCheck />} />
                <Route path='/resultpage' element={<ResultPage />} />

                {/* 게시판 페이지 */}
                <Route path='/board/question' element={<QuestionBoard />} />
                <Route path='/board/:boardId' element={<QuestionBoardDetails />} />
                <Route path='/board/edit/:boardId' element={<EditBoardPage />} /> {/* 수정 페이지 경로 설정 */}
                <Route path='/board/review' element={<ReviewBoard />} />
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
