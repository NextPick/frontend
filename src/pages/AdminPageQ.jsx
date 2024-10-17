import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import AdminpageSide from '../components/AdminpageSide';
import plusbutton from '../assets/plusbutton.png';
import searchIcon from '../assets/search.png';

const Administration = () => {
  const [questionData, setQuestionData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
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
    fetchQuestions();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      fetchQuestions();
    }
  };

  const fetchQuestions = () => {
    axios.get(`${process.env.REACT_APP_API_URL}questions`, {
      params: { size: 15, page, type, sort, category, keyword }
    })
      .then(response => {
        const data = response.data.data;
        setQuestionData(data);
        setTotalPages(response.data.pageInfo.totalPages);
      })
      .catch(error => {
        console.error('Error fetching questions:', error);
      });
  };

  useEffect(() => {
    fetchQuestions();
  }, [page, sort, category]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}question/category`)
      .then(response => {
        setCategories(response.data.data);
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
      });
  }, []);

  return (
    <Container>
      <AdminpageSide />
      <MainContent>
        <Header>
          <Title>면접질문 관리</Title>
          <Link to="/admin/question/add">
            <PlusButton src={plusbutton} alt="plusbutton" />
          </Link>
        </Header>
        <SearchContainer>
          <SearchWrapper>
            <SearchInput
              type="text"
              placeholder="검색"
              value={keyword}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
            />
            <SearchButton onClick={handleSearchClick}>
              <img src={searchIcon} alt="Search Icon" />
            </SearchButton>
          </SearchWrapper>
          <SortDropdown value={category} onChange={handleCategoryChange}>
            <option value={-1}>전체</option>
            {categories.map((cat) => (
              <option key={cat.questionCategoryId} value={cat.questionCategoryId}>
                {cat.categoryName}
              </option>
            ))}
          </SortDropdown>
          <SortDropdown value={sort} onChange={handleSortChange}>
            <option value="recent">최신순</option>
            <option value="correct_percent_acs">정답률▼</option>
            <option value="correct_percent_desc">정답률▲</option>
          </SortDropdown>
        </SearchContainer>
        <TableContainer>
          <Table>
            <colgroup>
              <col style={{ width: '14%' }} />
              <col style={{ width: '71%' }} />
              <col style={{ width: '15%' }} />
            </colgroup>
            <thead>
              <tr>
                <TableHeader>카테고리</TableHeader>
                <TableHeader>문제</TableHeader>
                <TableHeader>정답률</TableHeader>
              </tr>
            </thead>
            <tbody>
              {questionData.map((question) => (
                <TableRow key={question.questionListId}>
                  <TableData>{question.questionCategory.categoryName}</TableData>
                  <TableDataQuestion>
                    <StyledLink to={`/Admin/question/${question.questionListId}`}>
                      {question.question}
                    </StyledLink>
                  </TableDataQuestion>
                  <TableData>{question.correctRate}%</TableData>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </TableContainer>
        <Pagination>
          <button onClick={() => setPage(page - 1)} disabled={page === 1}>이전</button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => setPage(index + 1)}
              style={index + 1 === page ? activePageStyle : {}}
            >
              {index + 1}
            </button>
          ))}
          <button onClick={() => setPage(page + 1)} disabled={page === totalPages}>다음</button>
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
  border-radius: 15px;
  margin-left: 20px;
  text-align: center;
  border: 0.5px solid #ccc;
  background-color: #fff;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 4px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  font-size: 24px;
  margin-top: 10px;
  text-align: left;
  font-family: 'Pretendard', sans-serif;
  color: #006AC1;
  font-weight: bold;
`;

const PlusButton = styled.img`
  width: 25px;
  height: 25px;
  cursor: pointer;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const SearchWrapper = styled.div`
  position: relative;
  flex: 1;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 5px 35px 8px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
`;

const SearchButton = styled.button`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
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
  height: 70%;
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

const StyledLink = styled(Link)`
  color: #000;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const Pagination = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 10px;
  font-size: 14px;
`;

const activePageStyle = {
  fontWeight: 'bold',
  backgroundColor: '#4b8da6',
  color: 'white',
};

export default Administration;
