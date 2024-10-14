import React, { useEffect, useState, useRef } from 'react';
import { useHeaderMode } from '../hooks/HeaderManager';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Box from '../components/Box';
import '../styles/login.css';
import Button from '../components/Button';
import Font from '../components/Font';
import styled from 'styled-components';
import defaultProfile from '../assets/img-non-login.png';
import { useProfile } from '../hooks/ProfileContext'; // 프로필 컨텍스트
import { useMember } from '../hooks/MemberManager'; // 회원 정보를 관리하는 훅
import Line from '../components/Line';
import SearchBar from '../components/SearchBar';
import SelectBox from '../components/SelectBox';
import axios from 'axios';
import searchIcon from '../assets/search.png'; // 돋보기 아이콘 이미지 경로
import MypageSide from '../components/MypageSide';




const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
`;


const TableData = styled.td`
  padding: 5px;
  font-size: 14px;
  text-align: center;
`;

const TableHeader = styled.th`
  font-weight: bold;
  padding: 10px;
  border-bottom: 1px solid #eee;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #ccc;
`;

const TableContainer = styled.div`
  border: 1px solid #eee;
  border-radius: 10px;
  padding: 10px;
  height: 80%;
  background-color: #fff;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 8px 35px 8px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  position: relative;
`;


const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
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

const SortDropdown = styled.select`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  background-color: #fff;
  margin-left: 10px;
`;

// Styled Components
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 100px;
  background-color: #FFF;
  height: 100vh;
  font-family: Arial, sans-serif;
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



const MyNote = () => {
    const fileInputRef = useRef(null); // 파일 입력을 참조할 ref 생성
    const [activeTab, setActiveTab] = useState('answer'); // 탭 상태를 관리
    const [sortOption, setSortOption] = useState('');
    const [page, setPage] = useState(1);
    const [type, setType] = useState("none");
    const [sort, setSort] = useState("recent");
    const [category, setCategory] = useState(-1);
    const [keyword, setKeyword] = useState("");
    const [questionData, setQuestionData] = useState([]);
    const [categories, setCategories] = useState([]);


   
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
                setCategories(response.data);
            })
            .catch(error => {
                console.error('카테고리 가져오기 오류:', error);
            });
    }, []);



    // 탭을 전환하는 함수
    const switchTab = (tab) => {
        setActiveTab(tab);
    };
    // 옵션 정의
    const firstOptions = [
        { value: '', label: 'FE/BE/CS' },
        { value: 'high', label: 'FE' },
        { value: 'low', label: 'BE' },
        { value: 'new', label: 'CS' },
    ];

    const secondOptions = {
        high: [{ value: 'subHigh1', label: 'FE 옵션 1-1' },
        { value: 'subHigh1', label: 'FE 옵션 1-2' }
        ],
        low: [{ value: 'subLow1', label: 'BE 옵션 2-1' },
        { value: 'subLow1', label: 'BE 옵션 2-2' },
        ],
        new: [{ value: 'subNew1', label: 'CS 옵션 3-1' },
        { value: 'subNew1', label: 'CS 옵션 3-2' },
        ],
    };

    // 탭에 따라 표시할 콘텐츠를 정의
    const renderTabContent = () => {
        if (activeTab === 'answer') {
            return (
                <MainContent>
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

            );
        } else if (activeTab === 'wrong') {
            return (
                <MainContent>
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
            );
        }
    };

    return (

        <Container>
           <MypageSide/>
            <SearchContainer>
                <Box
                    padding="0px"
                    height="50%"
                    width="33vw"
                    border="none"
                    color="#f1f7fd"
                    justify="space-between"
                    radius="15px"
                    left="20px"
                >
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <Button
                            height="11vh"
                            width="16.5vw"
                            border="none"
                            radius="3px"
                            top="none"
                            color="#0372f396"
                            margintbottom="0px"
                            onClick={() => switchTab('answer')}
                        >
                            <Font
                                font="PretendardB"
                                size="24px"
                                color="#000000"
                                margintop="0px"
                                paddingtop="7px"
                                spacing="2px"
                                align="center"
                                marginbottom="0px"
                            >
                                정답
                            </Font>
                        </Button>
                        <Button
                            height="11vh"
                            width="16.5vw"
                            border="none"
                            radius="3px"
                            alignitem="flex-start"
                            justify="flex-start"
                            top="none"
                            color="#0372f396"
                            margintbottom="0px"
                            onClick={() => switchTab('wrong')}
                        >
                            <Font
                                font="PretendardB"
                                size="24px"
                                color="#000000"
                                margintop="0px"
                                paddingtop="7px"
                                spacing="2px"
                                align="center"
                                marginbottom="0px"
                            >
                                오답
                            </Font>
                        </Button>
                    </div>
                    {renderTabContent()}
                </Box>
                 </SearchContainer>

        </Container>
    );
}

export default MyNote;