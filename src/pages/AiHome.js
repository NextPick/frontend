import React, { useEffect, useState } from 'react';
import { useHeaderMode } from '../hooks/HeaderManager';
import { useNavigate } from 'react-router-dom';
import Box from '../components/Box';
import Font from '../components/Font';
import styled from 'styled-components';
import { useMember } from '../hooks/MemberManager'; // 회원 정보를 관리하는 훅
import Line from '../components/Line';

const AiHome = () => {
    const { setHeaderMode } = useHeaderMode();
    const { profileUrl, nickname } = useMember();
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState(null); // 선택된 카테고리 상태

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

    const handleCategoryClick = (categoryName) => {
        if (selectedCategory === categoryName) {
            setSelectedCategory(null); // 이미 선택된 카테고리를 다시 클릭하면 하위 카테고리 숨기기
        } else {
            setSelectedCategory(categoryName); // 다른 카테고리를 클릭하면 선택된 카테고리 변경
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <Box
                height="80vh"
                width="70vw"
                border="none"
                alignItems="flex-start"
                justify="flex-start"
            >
                <Font
                    font="PretendardL"
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
                <Box
                height="60vh"
                width="60vw"
                border="none"
                alignItems="flex-start"
                justify="flex-start"
            >
                <div style={{ display: 'flex', flexDirection: 'row', height: '100%', alignSelf:'flex-start', marginLeft:'40px' }}>
                    <CategoryContainer>
                        {categories.map((category) => (
                            <CategoryButton
                                key={category.name}
                                onClick={() => handleCategoryClick(category.name)}
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
                                        <SubcategoryItem key={subcategory}>
                                            {subcategory}
                                        </SubcategoryItem>
                                    ))}
                            </SubcategoryContainer>
                        )}
                    </div>
                </div>
                </Box>
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
`;

export default AiHome;
