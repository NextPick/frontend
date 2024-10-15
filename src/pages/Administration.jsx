import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import Line from '../components/Line';
import { useMember } from '../hooks/MemberManager'; // 회원 정보를 관리하는 훅
import AdminpageSide from '../components/AdminpageSide';



const Administration = () => {
  const [mentorData, setMentorData] = useState([]);
  const { profileUrl, setProfileUrl, nickname, email } = useMember();
  const [page, setPage] = useState(1);

  useEffect(() => {
    axios.get(process.env.REACT_APP_API_URL + `members/mentor?page=${page}&size=20`)
      .then(response => {
        const data = response.data.data;
        setMentorData(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, [page]);

  const handleAccept = (memberId) => {
    const accessToken = localStorage.getItem('accessToken');
    axios.patch(
      process.env.REACT_APP_API_URL + `members/admin/${memberId}`,
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
      setMentorData(prevData => prevData.filter(user => user.memberId !== memberId));
    })
    .catch(error => {
      console.error('Error accepting mentor request:', error);
    });
  };

  const handleReject = (memberId) => {
    const accessToken = localStorage.getItem('accessToken');
    axios.delete(process.env.REACT_APP_API_URL + `members/admin/${memberId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    .then(() => {
      setMentorData(prevData => prevData.filter(user => user.memberId !== memberId));
    })
    .catch(error => {
      console.error('Error rejecting mentor request:', error);
    });
  };

  return (
    <Container>
       <AdminpageSide/>
      <MainContent>
        <Title>멘토가입 신청관리</Title>
        <TableContainer>
          <Table>
            <thead>
              <tr>
                <TableHeader>이름</TableHeader>
                <TableHeader>이메일</TableHeader>
                <TableHeader>직군</TableHeader>
                <TableHeader>신청일</TableHeader>
                <TableHeader>처리</TableHeader>
              </tr>
            </thead>
            <tbody>
              {mentorData.map((user) => (
                <TableRow key={user.memberId}>
                  <TableData>{user.name}</TableData>
                  <TableData>{user.email}</TableData>
                  <TableData>{user.occupation}</TableData>
                  <TableData>{user.createdAt}</TableData>
                  <TableData>
                    <ActionButton onClick={() => handleAccept(user.memberId)}>수락</ActionButton>
                    <ActionButton onClick={() => handleReject(user.memberId)}>거절</ActionButton>
                  </TableData>
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
