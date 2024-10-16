// components/AdminPage.js
import React, { useEffect, useState } from 'react';
import { useHeaderMode } from '../hooks/HeaderManager';
import Chart from '../components/Chart';
import BarChart from '../components/BarChart';
import AdminpageSide from '../components/AdminpageSide';
import styled from 'styled-components';

const AdminPage = () => {
    const { setHeaderMode } = useHeaderMode();
    const [activeTab, setActiveTab] = useState('chart');
    const [selectedCategory, setSelectedCategory] = useState(null);

    useEffect(() => {
        setHeaderMode('main');
    }, [setHeaderMode]);

    const renderTabContent = () => {
        if (activeTab === 'chart') {
            return (
                <ChartContainer>
                    <ChartWrapper>
                        <Chart onSelectCategory={setSelectedCategory} />
                    </ChartWrapper>
                    <ChartWrapper>
                        {selectedCategory && <BarChart category={selectedCategory} />}
                    </ChartWrapper>
                </ChartContainer>
            );
        }
    };

    return (
        <Container>
            <AdminpageSide />
            <MainContent>
                <Title>서비스 이용비율</Title>
                {renderTabContent()}
            </MainContent>
        </Container>
    );
};

export default AdminPage;

// Styled Components
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 100px;
  background-color: #FFF;
  height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 20px;
  max-width: 800px;
  height: 100%;
  border-radius: 15px;
  margin-left: 20px;
  border: 0.5px solid #ccc;
  background-color: #fff;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 4px;
`;

const Title = styled.h2`
  font-size: 24px;
  margin-top: 10px;
  margin-bottom: 10px;
  text-align: left;
  font-family: 'Pretendard', sans-serif;
  color: #006AC1;
  font-weight: bold;
`;

const ChartContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 800px;
  margin-top: 100px;
`;

const ChartWrapper = styled.div`
  width: 45%;
  height: 400px;
`;
