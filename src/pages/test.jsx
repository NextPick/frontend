import React, { useState } from 'react';
import styled from 'styled-components';

const CategoryGrid = () => {
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  const categories = [
    {
      name: 'BackEnd',
      subcategories: ['Java', 'Spring', 'Node.js', 'Express.js', 'Django', 'Flask', 'Ruby', 'PHP', 'GraphQL', 'MySQL']
    },
    {
      name: 'FrontEnd',
      subcategories: ['React', 'Vue', 'Angular', 'HTML5', 'CSS3', 'JavaScript (ES6+)', 'TypeScript', 'SASS/SCSS', 'Webpack', 'Responsive Web Design']
    },
    {
      name: 'ComputerScience',
      subcategories: ['Networking', 'OS', 'Data Structure', 'Algorithms', 'Software Engineering', 'Design Patterns', 'Computer Architecture', 'Cybersecurity', 'Artificial Intelligence']
    },
  ];

  return (
    <Container>
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
    </Container>
  );
};

// Styled-components 정의
const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 80%;
  margin: auto;
  gap: 20px;
  font-family: 'Pretendard', sans-serif;
`;

const CategoryTitle = styled.div`
  font-weight: bold;
  font-size: 24px;
  margin-bottom: 10px;
`;

const SubcategoryContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
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
    width: 50%; /* 밑줄 길이 줄이기 */
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

export default CategoryGrid;
