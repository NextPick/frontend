import React, { useEffect, useState } from 'react';
import { useHeaderMode } from '../hooks/HeaderManager';
import { useNavigate } from 'react-router-dom';
import Box from '../components/Box';
import Font from '../components/Font';
import styled from 'styled-components';
import { useMember } from '../hooks/MemberManager'; // 회원 정보를 관리하는 훅
import Button from '../components/Button';

const AiHome = () => {
    const { setHeaderMode } = useHeaderMode();
    const { profileUrl, nickname } = useMember();
    const navigate = useNavigate();
    
    // 기본 카테고리 BE와 하위 카테고리 초기화
    const [selectedCategory, setSelectedCategory] = useState('BE'); // 선택된 상위 카테고리 상태 (기본값 BE)
    const [selectedSubcategory, setSelectedSubcategory] = useState(null); // 선택된 하위 카테고리 상태

    useEffect(() => {
        setHeaderMode('main');
    }, [setHeaderMode]);

    const categories = [
        {
            name: 'BE',
            subcategories: ['Java', 'Spring', 'Node.js', 'Express.js', 'Django', 'Flask', 'Ruby', 'PHP', 'GraphQL', 'MySQL']
        },
        {
            name: 'CS',
            subcategories: ['Networking', 'OS', 'Data Structure', 'Algorithms', 'Software Engineering', 'Design Patterns', 'Computer Architecture', 'Cybersecurity', 'Artificial Intelligence']
        },
        {
            name: 'FE',
            subcategories: ['React', 'Vue', 'Angular', 'HTML5', 'CSS3', 'JavaScript (ES6+)', 'TypeScript', 'SASS/SCSS', 'Webpack', 'Responsive Web Design']
        }
    ];

    useEffect(() => {
        // 초기화 시 하위 카테고리 기본 선택 메시지 설정
        setSelectedSubcategory(null); // 하위 카테고리는 초기화
    }, []); // 컴포넌트가 마운트될 때만 실행

    const handleCategoryClick = (categoryName) => {
        if (selectedCategory === categoryName) {
            setSelectedCategory(null); // 이미 선택된 카테고리를 다시 클릭하면 하위 카테고리 숨기기
            setSelectedSubcategory(null); // 하위 카테고리 선택 초기화
        } else {
            setSelectedCategory(categoryName); // 다른 카테고리를 클릭하면 선택된 카테고리 변경
            setSelectedSubcategory(null); // 하위 카테고리 선택 초기화
        }
    };

    const handleSubcategoryClick = (subcategory) => {
        setSelectedSubcategory(subcategory); // 선택된 하위 카테고리 상태 업데이트
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <Box
                height="90vh"
                width="70vw"
                border="none"
                alignItems="flex-start"
                justify="flex-start"
            >
                <Font
                    font="PretendardM"
                    size="30px"
                    color="#000000"
                    margintop="5px"
                    spacing="2px"
                    paddingleft="13px"
                    paddingtop="5px"
                    marginbottom="8px"
                >
                    AI면접연습
                </Font>
                {/* 선택된 하위 카테고리 표시, 선택된 하위 카테고리가 없을 때 기본 메시지 */}
                <SelectedSubcategoryBox>
                    <CheckMark>{selectedSubcategory ? '✔' : ''}</CheckMark> {/* 체크 표시 */}
                    {selectedSubcategory ? selectedSubcategory : '하위 카테고리를 선택하세요.'} {/* 기본 메시지 */}
                </SelectedSubcategoryBox>
                <Box
                    height="60vh"
                    width="60vw"
                    border="none"
                    alignItems="flex-start"
                    justify="flex-start"
                >
                    <div style={{ display: 'flex', flexDirection: 'row', height: '100%', alignSelf: 'flex-start', marginLeft: '40px' }}>
                        <CategoryContainer>
                            {categories.map((category) => (
                                <CategoryButton
                                    key={category.name}
                                    onClick={() => handleCategoryClick(category.name)}
                                    isSelected={selectedCategory === category.name} // 선택된 카테고리 확인
                                >
                                    {category.name}
                                </CategoryButton>
                            ))}
                        </CategoryContainer>
                        <div style={{ flex: 1, paddingLeft: '20px', display: 'flex', flexDirection: 'column' }}>
                            {/* 하위 카테고리 */}
                            {selectedCategory && (
                                <SubcategoryContainer>
                                    {categories
                                        .find(category => category.name === selectedCategory)
                                        .subcategories.map((subcategory) => (
                                            <SubcategoryItem
                                                key={subcategory}
                                                onClick={() => handleSubcategoryClick(subcategory)}
                                            >
                                                {subcategory}
                                            </SubcategoryItem>
                                        ))}
                                </SubcategoryContainer>
                            )}
                        </div>
                    </div>
                </Box>
                <ButtonContainer>
                    <Button
                      color="transparent"
                      width="12vw"
                      textcolor="#000000"
                      height="52px"
                      hoverColor="#ffffff"
                      margintbottom="10px"
                      fontsize="20px"
                      marginright="15px"
                      >
                        AI 면접시작하기 →
                    </Button>
                </ButtonContainer>
            </Box>
        </div>
    );
};

// Styled-components 정의
const CategoryContainer = styled.div`
  display: flex;
  flex-direction: column; /* 상위 카테고리들이 수직으로 나열됨 */
  width: 20vw; /* 카테고리의 너비 설정 */
  background-color: transparent; /* 배경 투명 설정 */
`;

const CategoryButton = styled.button`
  padding: 15px;
  border: 0px solid #ccc;
  border-radius: 5px;
  cursor: pointer;
  font-size: 65px;
  font-family: 함박눈;
  text-align: left; /* 왼쪽 정렬 */
  background-color: transparent; /* 버튼의 배경을 투명하게 설정 */
  margin-bottom: 15px; /* 각 상위 카테고리 버튼 아래에 여백 추가 */
  margin-top: 10px;
  width: 120px;

  /* 호버 스타일 추가 */
  &:hover {
      background-color: white; /* 호버 시 배경색 흰색으로 변경 */
      transition: background-color 0.3s; /* 부드러운 전환 효과 */
  }

  /* 선택된 카테고리에 대한 스타일 */
  ${({ isSelected }) => isSelected && `
      background-color: white; /* 선택된 카테고리는 흰색 배경 */
      transition: background-color 0.3s; /* 부드러운 전환 효과 */
  `}
`;

const SubcategoryContainer = styled.div`
  display: flex;
  flex-wrap: wrap; /* 하위 카테고리를 3행으로 정렬 */
  gap: 10px; /* 항목 사이의 간격을 추가 */
  margin-top: 20px; /* 상위 카테고리와 하위 카테고리 간의 간격 */
`;

const SubcategoryItem = styled.div`
  width: 30%; /* 각 하위 카테고리 항목의 너비 설정 */
  padding: 8px;
  border: 0px solid #ddd;
  border-radius: 4px;
  text-align: center;
  font-size: 22px;
  background-color: transparent; /* 하위 카테고리 배경 투명하게 설정 */
  margin-bottom: 10px; /* 각 하위 카테고리 버튼 아래에 여백 추가 */
  cursor: pointer; /* 포인터 커서로 변경 */
  
  &:hover {
      transform: scale(1.1); /* 호버 시 약간 커지기 */
      transition: transform 0.2s; /* 부드러운 전환 효과 */
  }
`;

const SelectedSubcategoryBox = styled.div`
  margin-top: 25px; /* 하위 카테고리와의 간격 */
  padding: 5px;
  font-size: 23px; /* 폰트 크기 설정 */
  text-align: left; /* 왼쪽 정렬 */
  font-family: PretendardB;
  display: flex; /* flexbox 사용 */
  align-items: center; /* 수직 가운데 정렬 */
`;

const CheckMark = styled.span`
  margin-right: 5px; /* 체크 표시와 텍스트 간의 간격 */
  font-size: 23px; /* 체크 표시 크기 조정 */
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end; /* 버튼을 오른쪽으로 정렬 */
  width: 100%; /* 전체 너비 사용 */
  margin-top: 20px; /* 버튼과 상자의 간격 */
`;

export default AiHome;
