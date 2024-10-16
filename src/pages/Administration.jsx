import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import AdminpageSide from '../components/AdminpageSide';
import { useMember } from '../hooks/MemberManager';

const Administration = () => {
  const [mentorData, setMentorData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const { profileUrl, setProfileUrl, nickname, email } = useMember();
  const [page, setPage] = useState(1);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}members/mentor`, {
      params: { page, size: 20 }
    })
      .then(response => {
        const data = response.data.data;
        setMentorData(data);
        setTotalPages(response.data.pageInfo.totalPages);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, [page]);

  const handleAccept = (memberId) => {
    const accessToken = localStorage.getItem('accessToken');
    axios.patch(
      `${process.env.REACT_APP_API_URL}members/admin/${memberId}`,
      { status: "ACTIVE", guiltyScore: -6 },
      { headers: { Authorization: `Bearer ${accessToken}` } }
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
    axios.delete(`${process.env.REACT_APP_API_URL}members/admin/${memberId}`, {
      headers: { Authorization: `Bearer ${accessToken}` }
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
      <AdminpageSide />
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
  gap: 10px;
  font-size: 14px;
`;

const activePageStyle = {
  fontWeight: 'bold',
  backgroundColor: '#4b8da6',
  color: 'white',
};

export default Administration;
