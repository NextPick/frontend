
import React, { useEffect, useState, useRef } from 'react';
import Box from '../components/Box';
import '../styles/login.css';
import Button from '../components/Button';
import Font from '../components/Font';
import styled from 'styled-components';
import axios from 'axios';
import searchIcon from '../assets/search.png'; // 돋보기 아이콘 이미지 경로
import MypageSide from '../components/MypageSide';


// 버튼의 크기와 배치를 화면 크기에 맞게 조정
const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: row;
  gap: 10px; /* 버튼 간 간격 조정 */
  margin-bottom: 20px; /* 아래 컨텐츠와의 간격 */
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
`;

const MainContent_ = styled.main`
  flex: 1;
  padding: 20px;
  max-width: 40vw;  /* 전체 화면의 80% 너비로 조정 */
  height: 74vh;
  min-height: 60vh; /* 최소 높이를 설정 */
  border-radius: 15px;
  text-align: center;
  border: 0.5px solid #ccc;
  background-color: #fff;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 4px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  overflow: hidden;
  margin-left: 20px;
`;

const Title = styled.h2`
  font-size: 24px;
  margin-top: 10px;
  margin-bottom: 40px;
  text-align: left;
  font-family: 'Pretendard', sans-serif;
  color: #006AC1;
  font-weight: bold;
`;

const TableData = styled.td`
  padding: 5px;
  font-size: 14px;
  text-align: center;
`;

const TableHeader = styled.th`
  font-weight: bold;
  border-bottom: 1px solid #eee;
  position: sticky; /* 헤더를 고정 */
  top: 0; /* 상단에 고정 */
  background-color: #fff; /* 배경색을 설정하여 내용과 구분 */
  z-index: 1; /* 다른 요소 위에 표시되도록 설정 */
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #ccc;
`;

const TableContainer = styled.div`
  flex: 1; /* 남은 공간을 모두 차지하도록 설정 */
  border: 1px solid #eee;
  border-radius: 10px;
  padding: 10px;
  background-color: #fff;
  overflow-y: auto; /* 필요할 때만 스크롤 표시 */
  overflow-y: auto; /* 필요할 때만 스크롤 표시 */
  min-height: 40vh; /* 내용이 없을 때도 기본적인 높이를 유지 */
  max-height: 60vh; /* 최대 높이를 상위 컴포넌트의 비율에 맞춰 설정 */
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


const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  width: '50%';
`;

const SearchButton = styled.button`
  position: absolute;
  background: none;
  margin-top: -0px;
  border: none;
  padding: 0;
  cursor: pointer;
  position: relative;
  
  &:hover {
    background-color:#a1cdff95;
  }
  
  img {
    width: 30px;
    height: 35px;
  }
`;

const MainContent = styled.main`
 flex: 1;
  padding: 20px;
  max-width: 100%;
  background-color: #f1f7fd;
  border-radius: 15px;
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
  const [activeTab, setActiveTab] = useState('answer'); // 탭 상태를 관리
  const [sortOption, setSortOption] = useState('');
  const [page, setPage] = useState(1);
  const [type, setType] = useState("none");
  const [sort, setSort] = useState("recent");
  const [category, setCategory] = useState(-1);
  const [keyword, setKeyword] = useState("");
  const [questionData, setQuestionData] = useState([]);
  const [wrongQuestionData, setWrongQuestionData] = useState([]);
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


  const fetchQuestions = () => {

    const headers = {
      Authorization: localStorage.getItem('accessToken')
    };
    // 정답 데이터 요청
    axios.get(`${process.env.REACT_APP_API_URL}solves?size=20&page=${page}&type=none&sort=${sort}&category=${category}&keyword=${keyword}&correct=true`, { headers })
      .then(response => {
        if (response.status === 200) {
          setQuestionData(response.data.data);
        } else {
          console.error('정답 데이터 가져오기 실패:', response.status);
        }
      })
      .catch(error => {
        console.error('정답 데이터 요청 오류:', error);
      });

    // 오답 데이터 요청
    axios.get(`${process.env.REACT_APP_API_URL}solves?size=20&page=${page}&type=none&sort=${sort}&category=${category}&keyword=${keyword}&correct=false`, { headers })
      .then(response => {
        if (response.status === 200) {
          setWrongQuestionData(response.data.data);
        } else {
          console.error('오답 데이터 가져오기 실패:', response.status);
        }
      })
      .catch(error => {
        console.error('오답 데이터 요청 오류:', error);
      });
  };

  
  useEffect(() => {
    fetchQuestions();
    axios.get(`${process.env.REACT_APP_API_URL}question/category`)
      .then(response => {
        setCategories(response.data.data);
      })
      .catch(error => {
        console.error('카테고리 가져오기 오류:', error);
      });
  }, [page, sort, category, keyword]);



  // 탭을 전환하는 함수
  const switchTab = (tab) => {
    setActiveTab(tab);
  };

  const renderTabContent = () => {
    const dataToRender = activeTab === 'answer' ? questionData : wrongQuestionData;

    return (
      <MainContent>
        <SearchContainer>
          <SearchInput
            type="text"
            placeholder="검색"
            value={keyword}
            onChange={handleSearchChange}
          />
          <SearchButton onClick={fetchQuestions}>
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
              <col style={{ width: '16%' }} />
              <col style={{ width: '70%' }} />
              <col style={{ width: '14%' }} />
            </colgroup>
            <thead>
              <tr>
                <TableHeader>카테고리</TableHeader>
                <TableHeader>문제</TableHeader>
                <TableHeader>정답률</TableHeader>
              </tr>
            </thead>
            <tbody>
              {dataToRender.map((question) => (
                <TableRow key={question.questionListId}>
                  <TableData>
                    {question.questionCategory ? question.questionCategory.categoryName : '없음'}
                  </TableData>
                  <TableData>{question.question}</TableData>
                  <TableData>{question.correctRate}%</TableData>
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
};


 
  return (

    <Container>
      <MypageSide />
      <SearchContainer>
        <MainContent_>
          <Title>정답/오답노트</Title>
          <ButtonContainer>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent:'center' }}>
            <Button
              height="42px"
              width= "16vw;"  /* 버튼 크기를 화면 너비의 15%로 설정 */
              border="none"
              radius="3px"
              top="none"
              color="#0372f396"
              margintbottom="0px"
              margintop="0px"
              onClick={() => switchTab('answer')}
            >
              <Font
                font="PretendardB"
                size="24px"
                color="#000000"
                margintop="0px"
                spacing="2px"
                align="center"
                marginbottom="0px"
              >
                정답
              </Font>
            </Button>
            <Button
              height="42px"
              width="16vw"
              border="none"
              radius="3px"
              alignitem="flex-start"
              justify="flex-start"
              top="none"
              color="#0372f396"
              margintbottom="0px"
              margintop="0px"
              onClick={() => switchTab('wrong')}
            >
              <Font
                font="PretendardB"
                size="24px"
                color="#000000"
                margintop="0px"
                spacing="2px"
                align="center"
                marginbottom="0px"
              >
                오답
              </Font>
            </Button>
          </div>
          </ButtonContainer>
          {renderTabContent()}
        </MainContent_>
      </SearchContainer>

    </Container>
  );
}

export default MyNote;