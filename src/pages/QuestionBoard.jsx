import React, { useState, useEffect } from 'react';
import axios from 'axios';

const QuestionBoard = () => {
  const [boards, setBoards] = useState([]);  // 빈 배열로 초기화
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10); // default page size
  const [sort, setSort] = useState('recent'); // default sort by recent
  const [keyword, setKeyword] = useState('');
  const [totalPages, setTotalPages] = useState(1);

  // API에서 데이터를 가져오는 useEffect
  useEffect(() => {
    axios.get('http://localhost:8080/boards/Q', {
        params: {
          page,
          size,
          sort,
          keyword
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        }
      })
      .then(response => {
        const boardData = response.data.content;
        if (boardData && boardData.length > 0) {
          setBoards(boardData); // Set the fetched boards
          setTotalPages(response.data.totalPages || 1); // Set total pages
        }
      })
      .catch(error => {
        console.error('Error fetching question boards:', error);
      });
  }, [page, size, sort, keyword]);
  
  

  // React 상태가 변경될 때마다 로그 출력
  useEffect(() => {
    console.log('Boards:', boards);
    console.log('Total Pages:', totalPages);
  }, [boards, totalPages]);

  // 검색어 변경 핸들러
  const handleSearch = (e) => {
    setKeyword(e.target.value);
    setPage(1); // 검색어가 변경되면 첫 페이지로 이동
  };

  // 페이지 변경 핸들러
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  // 좋아요 토글 핸들러
  const handleLikeToggle = async (boardId) => {
    try {
      await axios.post(`http://localhost:8080/boards/${boardId}/likes`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        }
      });
      // 좋아요 후 데이터를 다시 불러오기
      const response = await axios.get('http://localhost:8080/boards/Q', {
        params: { page, size, sort, keyword },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        }
      });
      setBoards(response.data.content || []);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  return (
    <div style={styles.questionBoard}>
      <h1 style={styles.title}>Question Boards</h1>

      <div style={styles.controls}>
        <input
          type="text"
          value={keyword}
          onChange={handleSearch}
          placeholder="Search by keyword..."
          style={styles.searchInput}
        />
        <select onChange={(e) => setSort(e.target.value)} value={sort} style={styles.select}>
          <option value="recent">Recent</option>
          <option value="likes">Most Liked</option>
          <option value="views">Most Viewed</option>
        </select>
        <select onChange={(e) => setSize(e.target.value)} value={size} style={styles.select}>
          <option value={5}>5 per page</option>
          <option value={10}>10 per page</option>
          <option value={20}>20 per page</option>
        </select>
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Likes</th>
            <th>Comments</th>
            <th>Views</th>
            <th>Date</th>
            <th>Like</th>
          </tr>
        </thead>
        <tbody>
          {boards.length === 0 ? (
            <tr>
              <td colSpan="7">No data available</td>
            </tr>
          ) : (
            boards.map((board) => (
              <tr key={board.boardId}>
                <td>{board.title}</td>
                <td>{board.author}</td>
                <td>{board.likesCount}</td>
                <td>{board.commentCount}</td>
                <td>{board.viewCount}</td>
                <td>{new Date(board.createdAt).toLocaleDateString()}</td>
                <td>
                  <button
                    style={{
                      ...styles.likeButton,
                      ...(board.likedByCurrentUser ? styles.likedButton : {}),
                    }}
                    onClick={() => handleLikeToggle(board.boardId)}
                  >
                    {board.likedByCurrentUser ? 'Unlike' : 'Like'}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div style={styles.pagination}>
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          style={{ ...styles.paginationButton, ...(page === 1 && styles.disabledButton) }}
        >
          Previous
        </button>
        <span style={styles.paginationInfo}>Page {page} of {totalPages}</span>
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
          style={{ ...styles.paginationButton, ...(page === totalPages && styles.disabledButton) }}
        >
          Next
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
