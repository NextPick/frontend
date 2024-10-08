import React from 'react';
import styled from 'styled-components';
import Input from './Input'; // Input 컴포넌트는 이미 정의된 것으로 가정
import Button from './Button'; // Button 컴포넌트는 이미 정의된 것으로 가정
import search from '../assets/search.png'


// 스타일링 된 검색바 컨테이너
const SearchBarContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 5px;
  width: ${(props) => props.width || '20vw'};
  height: ${(props) => props.height || '10px'};
  margin-top: ${(props) => props.top};
  margin-left: ${(props) => props.left};
`;

// SearchBar 컴포넌트
const SearchBar = ({ width, height, placeholder, onSearch, top, left,  value, onChange }) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  return (
    <SearchBarContainer width={width} height={height} top={top} left={left}>
      <Input
        type="text"
        placeholder={placeholder || '검색어를 입력하세요...'}
        value={value} // 전달받은 value를 Input에 바인딩
        onChange={onChange} // 전달받은 onChange 핸들러를 Input에 연결
        $w_width="30vw"
        $w_height="5px"
        $w_fontSize="10px"
      />
      <Button
        color="transparent"
        radius="5px"
        hoverColor="#FFFFFF"
        onClick={handleSearch} // 버튼 클릭 시 검색 실행
      >
        <img src={search} alt="search" style={{ width: '18px', height: '20px' }} />
      </Button>
    </SearchBarContainer>
  );
};

export default SearchBar;
