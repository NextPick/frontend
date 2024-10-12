import React, { useState } from 'react';
import { VictoryPie } from 'victory';

// 로컬 데이터 정의
const localData = [
  { x: 'Apples', y: 35 },
  { x: 'Bananas', y: 40 },
  { x: 'Oranges', y: 55 },
  { x: 'Berries', y: 30 },
  { x: 'Grapes', y: 25 },
];

const Chart = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null); // 마우스 오버된 차트 부분의 인덱스 상태

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', alignItems: 'center', justifyContent: 'flex-start' }}>
      {/* 그래프 */}
      <div style={{ flex: '0 0 auto', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }}>
        <VictoryPie
          data={localData} // 로컬 데이터 사용
          colorScale={['#FF5722', '#FF9800', '#FFC107', '#FFEB3B', '#CDDC39']}
          labels={({ datum }) => `${datum.x}: ${datum.y}`} // 레이블 설정
          innerRadius={50} // 파이 내부 빈 공간
          style={{
            parent: {
              viewBox: '0 0 800 800', // 원 그래프의 크기를 2배로 키움
              width: '360px', // 너비를 2배로 조정
              height: '300px', // 높이를 2배로 조정npm
            },
            data: {
              stroke: 'white',
              strokeWidth: 2,
              transition: 'transform 0.2s ease-in-out', // 애니메이션 적용
            },
          }}
          events={[
            {
              target: 'data',
              eventHandlers: {
                onMouseOver: (evt, props) => {
                  setHoveredIndex(props.index); // 마우스 오버 시 해당 인덱스 저장
                },
                onMouseOut: () => {
                  setHoveredIndex(null); // 마우스 아웃 시 인덱스 초기화
                },
              },
            },
          ]}
        />
      </div>

      {/* 데이터 표시 */}
      <div  style={{
    display: 'grid', // grid 레이아웃 사용
    gridTemplateColumns: 'repeat(3, 1fr)', // 1행에 2개의 열로 구성
    gridGap: '12px', // 요소 간의 간격 조정
  }}>
        {localData.map((datum, index) => (
          <div
            key={datum.x}
            style={{
              fontSize:"21px",
              fontFamily:"함박눈",
              color: index === hoveredIndex ? '#FF5722' : 'black', // 호버된 인덱스에 따라 색상 변경
              fontWeight: index === hoveredIndex ? 'bold' : 'normal', // 호버된 인덱스에 따라 굵게 표시
              cursor: 'pointer',
              padding: '5px 0',
            }}
            onMouseOver={() => setHoveredIndex(index)} // 마우스 오버 시 인덱스 설정
            onMouseOut={() => setHoveredIndex(null)} // 마우스 아웃 시 인덱스 초기화
          >
            {datum.x}: {datum.y} {/* 레이블 텍스트 유지 */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chart;
