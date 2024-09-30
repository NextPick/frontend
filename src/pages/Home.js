import React from 'react';
import { useHeaderMode } from '../hooks/HeaderManager.js';
// import '../styles/home.css';

const Home = () => {

  const { headerMode, setHeaderMode } = useHeaderMode();
  setHeaderMode('main'); // 헤더 상태



    return (
        <div id='background-color'>
          <div id='startview'/>
        </div>
    );
  }
  
export default Home;