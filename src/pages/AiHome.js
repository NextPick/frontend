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
           <Title>AI면접</Title>
            <Subtitle>AI 면접을 진행할 카테고리를 선택해 주세요</Subtitle>
            <CategoryContainer>
                    {categories.map((category, index) => (
                        <React.Fragment key={index}>
                        <CategoryTitle>{category.name}</CategoryTitle>
                        <SubcategoryContainer>
                            {category.subcategories.map((subcategory, subIndex) => (
                            <Subcategory
                                key={subIndex}
                                isSelected={selectedSubcategory === subcategory}
                                onClick={() => setSelectedSubcategory(subcategory)}
                            >
                                {subcategory}
                            </Subcategory>
                            ))}
                        </SubcategoryContainer>
                        {index < categories.length - 1 && <Divider />}
                        </React.Fragment>
                    ))}
            </CategoryContainer>
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
                      hoverTextColor="black"
                      onClick={handleStartInterviewClick} // 클릭 핸들러 추가
                    >
                        AI 면접시작하기 →
                    </Button>
                </ButtonContainer>
        </div>
    );
};

// Styled-components 정의

const CategoryContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 70%;
  margin: auto;
  gap: 20px;
  font-family: 'Pretendard', sans-serif;
`;

const CategoryTitle = styled.div`
  font-weight: bold;
  font-size: 24px;
  margin-bottom: 10px;
`;

const Subcategory = styled.div`
  font-size: 16px;
  text-align: center;
  padding: 10px;
  cursor: pointer;
  color: ${({ isSelected }) => (isSelected ? '#373f73' : 'rgb(132, 145, 167)')};
  font-weight: ${({ isSelected }) => (isSelected ? '500' : 'normal')};
  position: relative;
  
  &::after {
    content: '';
    display: block;
    width: 80%;
    height: 3px;
    background-color: ${({ isSelected }) => (isSelected ? '#006AC1' : '#FFFFFF')};
    margin: 0 auto;
    margin-top: 5px;
  }
`;

const Divider = styled.div`
  width: 100%;
  border-top: 2px solid black;
  margin: 20px 0;
`;

const Title = styled.div`
  margin-top: 50px;
  font-size: 36px;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 10px;
`;

const Subtitle = styled.div`
  font-size: 16px;
  color: #7f8c8d;
  margin-bottom: 20px;
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
      background-color: black;
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