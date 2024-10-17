import React, { useEffect } from 'react';
import { useHeaderMode } from '../hooks/HeaderManager.js';
import '../styles/home.css';
import Button from '../components/Button.js';
import Font from '../components/Font.js';
import Arrow from '../components/Arrow.js';
import Footer from '../components/Footer.js';
import { useNavigate } from 'react-router-dom'; // useNavigate 추가

const Home = () => {
  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 훅 사용

  // 특정 섹션으로 부드럽게 스크롤하는 함수
  const scrollToSection = (index) => {
    const section = document.querySelector(`.section${index}`);
    if (section) {
      section.scrollIntoView({ behavior: `smooth` });
    }
  };


  useEffect(() => {
    const handleScroll = (event) => {
      if (event.deltaV > 0) {
        //아래로 스크롤
        scrollToSection(2); // 다음 섹션으로 스크롤
      } else {
        //위로 스크롤
        scrollToSection(1); // 이전 섹션으로 스크롤
      }
    };
    // 스크롤 이벤트 리스너 추가
    window.addEventListener(`wheel`, handleScroll);
    return () => {
      window.removeEventListener(`wheel`, handleScroll);
    };
  }, []);

  const { headerMode, setHeaderMode } = useHeaderMode();
  useEffect(() => {
    setHeaderMode('main'); // 헤더 상태
  }, [setHeaderMode]);


  // 로그인 상태 확인 함수
  const isLoggedIn = () => {
    const accessToken = localStorage.getItem('accessToken'); // 예시로 accessToken 확인
    return !!accessToken; // 토큰이 있으면 true 반환
  };


   // 체험하기 버튼 클릭 핸들러
   const handleExperienceClick = () => {
    if (isLoggedIn()) {
      navigate('/choice'); // 로그인 상태면 /choice 페이지로 이동
    } else {
      navigate('/login'); // 로그아웃 상태면 /login 페이지로 이동
    }
  };


  return (
    <div className='backgroundcolor'>
      <div className='section1'>
        <div className='maintext1'>나만의 면접 컨설턴트
          <p>취업드림</p>
          <div className='maintext2'>
            ai 서비스와 엄선된 면접코치를
            <p>바탕으로 취업에 대한 답을 찾아드립니다</p>
          </div>
            <Button
              color="#177FF9"
              textcolor="#ffffff"
              // margintop="310px"
              padding="10px 20px;"
              radius="10px!important;"
              fontsize="20px;"
              fontcolor="#fff;"
               onClick={handleExperienceClick} // 링크 대신 onClick 핸들러로 제어
            >
              체험하러 가기
            </Button>
        </div>
        <div className='mainimg'>
          
        </div>
      </div>
      <Arrow/>
      <div className="section2">
        <Font
        font="PretendardB"
        size="40px"
        color="#000000"
        align="center"
        paddingtop="20px"
        >
        간편하고 효과적인 면접 경험
        </Font>
        <div className='section2photo'/>
      </div>
      <Arrow/>
      <div className="section3">
      <Font
        font="PretendardB"
        size="35px"
        color="#000000"
        align="center"
        paddingtop="5px"
        >
          <p style={{ lineHeight:'60px' }}>
            누적 면접 촬영 건수 10,000,000건<br/>
            FE/BE/CS 총 질문 10,000+<br/>
            관리자가 엄선한 튜터의 프라이빗한<br/>
            1대1 면접 피드백까지
          </p>
        </Font>
        <div className='section3photo'/>
      </div>
      <Footer/>
    </div>
  );
}

export default Home;