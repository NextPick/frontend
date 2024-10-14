import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import Line from '../components/Line';
import { useMember } from '../hooks/MemberManager';
import plusbutton from '../assets/plusbutton.png';
import searchIcon from '../assets/search.png'; // 돋보기 아이콘 이미지 경로

const Administration = () => {
  const [questionData, setQuestionData] = useState([]);
  const [categories, setCategories] = useState([]);
  const { profileUrl, setProfileUrl, nickname, email } = useMember();
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
    axios.get(`http://localhost:8080/questions?size=20&page=${page}&type=${type}&sort=${sort}&category=${category}&keyword=${keyword}`)
      .then(response => {
        const data = response.data.data;
        setQuestionData(data);
      })
      .catch(error => {
        console.error('검색 요청 오류:', error);
      });
  };

  useEffect(() => {
    axios.get(`http://localhost:8080/questions?size=20&page=${page}&type=${type}&sort=${sort}&category=${category}&keyword=${keyword}`)
      .then(response => {
        const data = response.data.data;
        setQuestionData(data);
      })
      .catch(error => {
        console.error('데이터 가져오기 오류:', error);
      });
  }, [page, sort, category, keyword]);

  useEffect(() => {
    axios.get('http://localhost:8080/question/category')
      .then(response => {
        setCategories(response.data); 
      })
      .catch(error => {
        console.error('카테고리 가져오기 오류:', error);
      });
  }, []);

  return (
    <Container>
      <Sidebar>
        <Profile>
          <Avatar></Avatar>
          <Username>{nickname || '닉네임'}</Username>
          <Email>{email || '이메일'}</Email>
        </Profile>
        <StyledLine />
        <Menu>
          <MenuItem>서비스 이용비율</MenuItem>
          <MenuItem active>면접질문 관리</MenuItem>
          <MenuItem>멘토가입 신청관리</MenuItem>
          <MenuItem>사용자 신고목록 관리</MenuItem>
        </Menu>
        <StyledLine />
        <LogoutButton>로그아웃</LogoutButton>
      </Sidebar>
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
                  <TableData>{user.question}</TableData>
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

const Sidebar = styled.aside`
  width: 250px;
  padding: 20px;
  height: 100%;
  background-color: #e7f0f9;
  border-radius: 15px;
  text-align: center;
`;

const Profile = styled.div`
  margin-bottom: 20px;
`;

const Avatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #ccc;
  margin: 0 auto;
`;

const Username = styled.h3`
  font-size: 18px;
  font-weight: bold;
  margin: 10px 0;
`;

const Email = styled.p`
  font-size: 14px;
  color: #666;
`;

const StyledLine = styled(Line)`
  border-bottom: 1px solid #aaa;
  margin-top: 10px;
  width: 100%;
`;

const Menu = styled.div`
  margin-top: 20px;
  text-align: left;
  margin-bottom: 20px;
  font-size: 16px;
`;

const MenuItem = styled.p`
  padding: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;
  background-color: ${({ active }) => (active ? '#137df696' : 'transparent')};
  color: ${({ active }) => (active ? '#ffffff' : '#000')};

  &:hover {
    background-color: #0372f396;
    color: #ffffff;
  }
`;

const LogoutButton = styled.button`
  border: none;
  background-color: transparent;
  color: #333;
  cursor: pointer;
  margin-top: 20px;
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
  margin-top: 10px;
  margin-bottom: 40px;
  text-align: left;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 8px 35px 8px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  position: relative;
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
