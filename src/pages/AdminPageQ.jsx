import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import Line from '../components/Line';
import { useMember } from '../hooks/MemberManager'; // 회원 정보를 관리하는 훅
import plusbutton from '../assets/plusbutton.png'

const Administration = () => {
  const [questionData, setQuestionData] = useState([]);
  const { profileUrl, setProfileUrl, nickname, email } = useMember();
  const [page, setPage] = useState(1);
  const [type, setType] = useState("none");
  const [sort, setSort] = useState("recent");
  const [category, setCategory] = useState(-1);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    axios.get(`http://localhost:8080/questions?size=20&page=${page}&type=${type}&sort=${sort}&category=${category}&keyword=${keyword}`)
      .then(response => {
        const data = response.data.data;
        setQuestionData(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, [page]);

  const handleAccept = (memberId) => {
    const accessToken = localStorage.getItem('accessToken');
    axios.patch(
      `http://localhost:8080/members/admin/${memberId}`,
      {
        status: "ACTIVE",
        guiltyScore: -6
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    )
    .then(() => {
      setQuestionData(prevData => prevData.filter(user => user.memberId !== memberId));
    })
    .catch(error => {
      console.error('Error accepting mentor request:', error);
    });
  };

  const handleReject = (memberId) => {
    const accessToken = localStorage.getItem('accessToken');
    axios.delete(`http://localhost:8080/members/admin/${memberId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    .then(() => {
      setQuestionData(prevData => prevData.filter(user => user.memberId !== memberId));
    })
    .catch(error => {
      console.error('Error rejecting mentor request:', error);
    });
  };

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
            <img src={plusbutton} alt="plusbotton" style={{ width: '25px', height: '25px', marginLeft: '10px'}} />
        </Title>
        <TableContainer>
          <Table>
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

// Styled Components with hover animations
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
  background-color: ${({ active }) => (active ? '#0372f396' : 'transparent')};
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

const ActionButton = styled.button`
  padding: 5px 10px;
  margin-right: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  cursor: pointer;
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
