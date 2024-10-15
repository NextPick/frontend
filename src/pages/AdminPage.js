import React, { useEffect, useState, useRef } from 'react';
import { useHeaderMode } from '../hooks/HeaderManager';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Box from '../components/Box';
import '../styles/login.css';
import Font from '../components/Font';
import styled from 'styled-components';
import defaultProfile from '../assets/img-non-login.png';
import Chart from '../components/Chart';
import AdminpageSide from '../components/AdminpageSide';





// Styled Components
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 100px;
  background-color: #FFF;
  height: 100vh;
  font-family: Arial, sans-serif;
`;


const AdminPage = () => {
    const { headerMode, setHeaderMode } = useHeaderMode();
    const [activeTab, setActiveTab] = useState('chart'); // 탭 상태를 관리


    useEffect(() => {
        setHeaderMode('main');
    }, [setHeaderMode]);

  


 // 탭에 따라 표시할 콘텐츠를 정의
 const renderTabContent = () => {
    if (activeTab === 'chart') {
        return (
            <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center' }}>
                     <div style={{ alignSelf: 'flex-start' , marginBottom: '10px', width:"35vw" }}> {/* 왼쪽 정렬을 위한 스타일 */}
                    <Font
                        font="PretendardL"
                        size="22px"
                        color="#000000"
                        margintop="5px"
                        spacing="2px"
                        paddingtop="5px"
                        paddingleft="13px"
                        marginbottom="2px"
                    >
                        서비스 이용비율
                    </Font>
                </div>
                       {/* 여기에 차트 컴포넌트를 추가합니다 */}
                <div style={{ width: '75%', marginTop: '10px' }}>
                <Chart /> {/* 'answer' 탭에서만 차트가 렌더링됩니다 */}
          </div>
        </div>
      );
    } 
  };

    return (
        <Container>
           <AdminpageSide/>
            <Box
                height="73vh"
                width="35vw"
                border="none"
                left="20px"
                justify="flex-start"
                direction="column"
                alignitem="center"
                padding="0px"
                color="#e7f0f9"
                style={{ display: 'flex'}} // 자식 박스에서 정렬
            >
              
                {renderTabContent()} 
            </Box>
            </Container>
    );
  }
  
export default AdminPage;