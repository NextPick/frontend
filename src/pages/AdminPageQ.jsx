import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import Line from '../components/Line';
import { useMember } from '../hooks/MemberManager';
import plusbutton from '../assets/plusbutton.png';
import searchIcon from '../assets/search.png'; // 돋보기 아이콘 이미지 경로
import AdminpageSide from '../components/AdminpageSide';

const Administration = () => {
  const [questionData, setQuestionData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [type, setType] = useState("none");
  const [sort, setSort] = useState("recent");
  const [category, setCategory] = useState(-1);
  const [keyword, setKeyword] = useState("");

  const handleSearchChange = (e) => {
    setKeyword(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleSortChange = (e) => {
    setSort(e.target.value);
  };

  const handleSearchClick = () => {
    axios.get(process.env.REACT_APP_API_URL + `questions?size=20&page=${page}&type=${type}&sort=${sort}&category=${category}&keyword=${keyword}`)
      .then(response => {
        const data = response.data.data;
        setQuestionData(data);
      })
      .catch(error => {
        console.error('검색 요청 오류:', error);
      });
  };

  useEffect(() => {
    axios.get(process.env.REACT_APP_API_URL + `questions?size=20&page=${page}&type=${type}&sort=${sort}&category=${category}&keyword=${keyword}`)
      .then(response => {
        const data = response.data.data;
        setQuestionData(data);
      })
      .catch(error => {
        console.error('데이터 가져오기 오류:', error);
      });
  }, [page, sort, category, keyword]);

  useEffect(() => {
    axios.get(process.env.REACT_APP_API_URL + 'question/category')
      .then(response => {
        setCategories(response.data.data);
      })
      .catch(error => {
        console.error('카테고리 가져오기 오류:', error);
      });
  }, []);

  return (
    <Container>
     <AdminpageSide/>
      <MainContent>
        <Title>면접질문 관리
          <img src={plusbutton} alt="plusbutton" style={{ width: '25px', height: '25px', marginLeft: '10px' }} />
        </Title>
        <SearchContainer>
          <SearchInput
            type="text"
            placeholder="검색"
            value={keyword}
            onChange={handleSearchChange}
          />
          <SearchButton onClick={handleSearchClick}>
            <img src={searchIcon} alt="Search Icon" />
          </SearchButton>
          <SortDropdown value={sort} onChange={handleSortChange}>
            <option value="recent">최신순</option>
            <option value="popularity">인기순</option>
            <option value="difficulty">난이도순</option>
          </SortDropdown>
          <SortDropdown value={category} onChange={handleCategoryChange}>
            <option value={-1}>전체</option>
            {categories.map((cat) => (
              <option key={cat.questionCategoryId} value={cat.questionCategoryId}>
                {cat.categoryName}
              </option>
            ))}
          </SortDropdown>
        </SearchContainer>
        <TableContainer>
          <Table>
            <colgroup>
              <col style={{ width: '14%' }} /> {/* 2:14% */}
              <col style={{ width: '71%' }} /> {/* 10:71% */}
              <col style={{ width: '15%' }} /> {/* 1:15% */}
            </colgroup>
            <thead>
              <tr>
                <TableHeader>카테고리</TableHeader>
                <TableHeader>문제</TableHeader>
                <TableHeader>정답률</TableHeader>
              </tr>
            </thead>
            <tbody>
              {questionData.map((user) => (
                <TableRow key={user.questionListId}>
                  <TableData>{user.questionCategory.categoryName}</TableData>
                  <TableDataQuestion>{user.question}</TableDataQuestion>
                  <TableData>{user.correctRate}%</TableData>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </TableContainer>
        <Pagination>
          {[1, 2, 3, 4].map((num) => (
            <PaginationDot
              key={num}
              active={page === num}
              onClick={() => setPage(num)}
            />
          ))}
        </Pagination>
      </MainContent>
    </Container>
  );
};

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

const MainContent = styled.main`
  flex: 1;
  padding: 20px;
  max-width: 800px;
  height: 100%;
  background-color: #f1f7fd;
  border-radius: 15px;
  margin-left: 20px;
  text-align: center;
`;

const Title = styled.h2`
  font-size: 24px;
  margin-top: 0px;
  margin-bottom: 10px;
  text-align: left;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 5px 35px 8px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  position: relative;
  margin-bottom: 0px;
`;

const SearchButton = styled.button`
  position: absolute;
  right: 15px;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  
  img {
    width: 18px;
    height: 18px;
  }
`;

const SortDropdown = styled.select`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  background-color: #fff;
  margin-left: 10px;
`;

const TableContainer = styled.div`
  border: 1px solid #eee;
  border-radius: 10px;
  padding: 10px;
  height: 80%;
  background-color: #fff;
  overflow-y: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
`;

const TableHeader = styled.th`
  font-weight: bold;
  padding: 10px;
  border-bottom: 1px solid #eee;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #ccc;
`;

const TableData = styled.td`
  padding: 5px;
  font-size: 14px;
  text-align: center;
`;

const TableDataQuestion = styled.td`
  padding: 5px;
  font-size: 14px;
  text-align: left;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const PaginationDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin: 0 5px;
  cursor: pointer;
  background-color: ${({ active }) => (active ? '#000' : '#ccc')};
`;

export default Administration;
