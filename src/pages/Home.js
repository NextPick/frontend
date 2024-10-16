import React, { useEffect } from 'react';
import { useHeaderMode } from '../hooks/HeaderManager.js';
import '../styles/home.css';
import { Link } from 'react-router-dom';
import Button from '../components/Button.js';
import Font from '../components/Font.js';
import Arrow from '../components/Arrow.js';
import Footer from '../components/Footer.js';

const Home = () => {
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


  return (
    <div className='backgroundcolor'>
      <div className='section1'>
        <div className='maintext1'>나만의 면접 컨설턴트
          <p>취업드림</p>
          <div className='maintext2'>
            ai 서비스와 엄선된 면접코치를
            <p>바탕으로 취업에 대한 답을 찾아드립니다</p>
          </div>
            <Link to={'/login'}>
            <Button
              color="#177FF9"
              textcolor="#ffffff"
              // margintop="310px"
              padding="10px 20px;"
              radius="10px!important;"
              fontsize="20px;"
              fontcolor="#fff;"
            >
              체험하러 가기
            </Button>
          </Link>
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