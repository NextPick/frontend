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
        setSelectedSubcategory(null); // 하위 카테고리는 초기화
    }, []);

    const handleCategoryClick = (categoryName) => {
        if (selectedCategory === categoryName) {
            setSelectedCategory(null);
            setSelectedSubcategory(null);
        } else {
            setSelectedCategory(categoryName);
            setSelectedSubcategory(null);
        }
    };

    const handleSubcategoryClick = (subcategory) => {
        setSelectedSubcategory(subcategory);
    };

    // "AI 면접 시작하기" 버튼 클릭 핸들러
    const handleStartInterviewClick = () => {
        // 선택된 카테고리 및 하위 카테고리를 state로 전달하며 페이지 이동
        navigate('/aiInterview', { state: { selectedCategory, selectedSubcategory } });
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <Box height="90vh" width="70vw" border="none" alignItems="flex-start" justify="flex-start">
                <Font font="PretendardM" size="30px" color="#000000" margintop="5px" spacing="2px" paddingleft="13px" paddingtop="5px" marginbottom="8px">
                    AI면접연습
                </Font>
                <SelectedSubcategoryBox>
                    <CheckMark>{selectedSubcategory ? '✔' : ''}</CheckMark>
                    {selectedSubcategory ? selectedSubcategory : '하위 카테고리를 선택하세요.'}
                </SelectedSubcategoryBox>
                <Box height="60vh" width="60vw" border="none" alignItems="flex-start" justify="flex-start">
                    <div style={{ display: 'flex', flexDirection: 'row', height: '100%', alignSelf: 'flex-start', marginLeft: '40px' }}>
                        <CategoryContainer>
                            {categories.map((category) => (
                                <CategoryButton
                                    key={category.name}
                                    onClick={() => handleCategoryClick(category.name)}
                                    isSelected={selectedCategory === category.name}
                                >
                                    {category.name}
                                </CategoryButton>
                            ))}
                        </CategoryContainer>
                        <div style={{ flex: 1, paddingLeft: '20px', display: 'flex', flexDirection: 'column' }}>
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
                      onClick={handleStartInterviewClick} // 클릭 핸들러 추가
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
  flex-direction: column;
  width: 20vw;
  background-color: transparent;
`;

const CategoryButton = styled.button`
  padding: 15px;
  border: 0px solid #ccc;
  border-radius: 5px;
  cursor: pointer;
  font-size: 65px;
  font-family: 함박눈;
  text-align: left;
  background-color: transparent;
  margin-bottom: 15px;
  margin-top: 10px;
  width: 120px;

  &:hover {
      background-color: white;
      transition: background-color 0.3s;
  }

  ${({ isSelected }) => isSelected && `
      background-color: white;
      transition: background-color 0.3s;
  `}
`;

const SubcategoryContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 20px;
`;

const SubcategoryItem = styled.div`
  width: 30%;
  padding: 8px;
  border: 0px solid #ddd;
  border-radius: 4px;
  text-align: center;
  font-size: 22px;
  background-color: transparent;
  margin-bottom: 10px;
  cursor: pointer;

  &:hover {
      transform: scale(1.1);
      transition: transform 0.2s;
  }
`;

const SelectedSubcategoryBox = styled.div`
  margin-top: 25px;
  padding: 5px;
  font-size: 23px;
  text-align: left;
  font-family: PretendardB;
  display: flex;
  align-items: center;
`;

const CheckMark = styled.span`
  margin-right: 5px;
  font-size: 23px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  margin-top: 20px;
`;

export default AiHome;
