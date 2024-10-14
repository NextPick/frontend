import React, { useState, useEffect } from 'react';
import axios from 'axios';

const QuestionBoard = () => {
  let [boards, setBoards] = useState([]);  // 게시판 데이터를 저장하는 상태
  let [page, setPage] = useState(1);  // 현재 페이지
  let [size, setSize] = useState(10);  // 한 페이지당 보여줄 게시물 수
  let [sort, setSort] = useState('recent');  // 정렬 기준 (기본값: 최근순)
  let [keyword, setKeyword] = useState('');  // 검색어
  let [totalPages, setTotalPages] = useState(1);  // 전체 페이지 수

  // 백엔드에서 데이터를 가져오는 useEffect
  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const params = {
          page,
          size,
          sort,
        };

        // 검색어가 있을 경우에만 keyword 파라미터 추가
        if (keyword.trim()) {
          params.keyword = keyword;
        }

        const response = await axios.get('http://localhost:8080/boards/Q', {
          params,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          }
        });

        // 응답에서 데이터 처리
        const boardData = response.data;
        if (boardData && boardData.length > 0) {
          setBoards(boardData);  // 게시판 데이터를 상태에 저장
          setTotalPages(Math.ceil(boardData.length / size));  // 전체 페이지 수 설정
        } else {
          setBoards([]);  // 게시판 데이터가 없을 경우 빈 배열로 초기화
        }
      } catch (error) {
        console.error('질문 게시판 데이터 가져오기 오류:', error);
      }
    };

    fetchBoards();
  }, [page, size, sort, keyword]);

  // 검색어 변경 시 처리
  const handleSearch = (e) => {
    setKeyword(e.target.value);
    setPage(1);  // 검색어가 변경되면 첫 페이지로 이동
  };

  // 페이지 변경 시 처리
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div style={styles.questionBoard}>
      <h1 style={styles.title}>질문 게시판</h1>

      {/* 검색 및 정렬 컨트롤 */}
      <div style={styles.controls}>
        <input
          type="text"
          value={keyword}
          onChange={handleSearch}
          placeholder="검색어 입력..."
          style={styles.searchInput}
        />
        <select onChange={(e) => setSort(e.target.value)} value={sort} style={styles.select}>
          <option value="recent">최신순</option>
          <option value="likes">좋아요순</option>
          <option value="views">조회수순</option>
        </select>
        <select onChange={(e) => setSize(e.target.value)} value={size} style={styles.select}>
          <option value={5}>5개씩 보기</option>
          <option value={10}>10개씩 보기</option>
          <option value={20}>20개씩 보기</option>
        </select>
      </div>

      {/* 게시판 데이터를 보여주는 테이블 */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th>제목</th>
            <th>작성자</th>
            <th>좋아요</th>
            <th>댓글 수</th>
            <th>조회수</th>
            <th>작성일</th>
          </tr>
        </thead>
        <tbody>
          {boards.length === 0 ? (
            <tr>
              <td colSpan="6">데이터가 없습니다</td>
            </tr>
          ) : (
            boards.map((board) => (
              <tr key={board.boardId}>
                <td>{board.title}</td>
                <td>{board.author}</td>
                <td>{board.likesCount}</td> {/* 좋아요 수 표시 */}
                <td>{board.commentCount}</td>
                <td>{board.viewCount}</td>
                <td>{new Date(board.createdAt).toLocaleDateString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* 페이지네이션 컨트롤 */}
      <div style={styles.pagination}>
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          style={{ ...styles.paginationButton, ...(page === 1 && styles.disabledButton) }}
        >
          이전
        </button>
        <span style={styles.paginationInfo}>페이지 {page} / {totalPages}</span>
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
          style={{ ...styles.paginationButton, ...(page === totalPages && styles.disabledButton) }}
        >
          다음
        </button>
      </div>
    </div>
  );
};

// CSS 스타일
const styles = {
  questionBoard: {
    maxWidth: '1200px',
    margin: '50px auto',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  title: {
    textAlign: 'center',
    fontSize: '2rem',
    marginBottom: '20px',
    color: '#333',
  },
  controls: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '20px',
  },
  searchInput: {
    padding: '10px',
    fontSize: '1rem',
    border: '1px solid #ccc',
    borderRadius: '5px',
    outline: 'none',
    width: '30%',
  },
  select: {
    padding: '10px',
    fontSize: '1rem',
    border: '1px solid #ccc',
    borderRadius: '5px',
    outline: 'none',
    width: '30%',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'center',
  },
  likeButton: {
    padding: '8px 12px',
    fontSize: '0.9rem',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    color: '#fff',
    backgroundColor: '#007bff',
    transition: 'background-color 0.3s ease',
  },
  likedButton: {
    backgroundColor: '#28a745',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '20px',
  },
  paginationButton: {
    padding: '10px 20px',
    margin: '0 10px',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background-color 0.3s ease',
  },
  disabledButton: {
    backgroundColor: '#ccc',
    cursor: 'not-allowed',
  },
  paginationInfo: {
    fontSize: '1rem',
    color: '#555',
  },
}; 

export default QuestionBoard;
