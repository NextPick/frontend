import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const QuestionBoard = () => {
  const [boards, setBoards] = useState([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [sortOption, setSortOption] = useState('최신순');
  const [keyword, setKeyword] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isNavigating) return;

    const fetchBoards = async () => {
      try {
        const params = {
          page,
          size,
          sort: sortOption === '최신순' ? 'recent' : sortOption === '좋아요순' ? 'likes' : 'views',
        };

        if (searchKeyword.trim()) {
          params.keyword = searchKeyword;
        }

        const response = await axios.get(process.env.REACT_APP_API_URL + 'boards/R', {
          params,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });

        const boardData = response.data;
        if (boardData && boardData.content) {
          setBoards(boardData.content);
          setTotalPages(boardData.totalPages);
        } else {
          setBoards([]);
        }
      } catch (error) {
        console.error('질문 게시판 데이터 가져오기 오류:', error);
      }
    };

    fetchBoards();
  }, [page, size, sortOption, searchKeyword, isNavigating]);

  const handlePostClick = (boardId) => {
    setIsNavigating(true);
    navigate(`/board/${boardId}`);
  };

  const handleCreatePost = () => {
    navigate('/board/question/post');  // Navigate to the post creation page for QuestionBoard
  };

  return (
    <div style={styles.container}>
      <div style={styles.searchSortContainer}>
        <div style={styles.searchContainer}>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="검색어 입력..."
            style={styles.searchInput}
          />
          <button onClick={() => setSearchKeyword(keyword)} style={styles.searchButton}>🔍</button>
        </div>
        <div style={styles.dropdownContainer}>
          <button onClick={() => setDropdownOpen(!isDropdownOpen)} style={styles.sortButton}>
            {sortOption} ▼
          </button>
          {isDropdownOpen && (
            <div style={styles.dropdownMenu}>
              <div onClick={() => setSortOption('최신순')} style={styles.dropdownItem}>최신순</div>
              <div onClick={() => setSortOption('좋아요순')} style={styles.dropdownItem}>좋아요순</div>
              <div onClick={() => setSortOption('조회순')} style={styles.dropdownItem}>조회순</div>
            </div>
          )}
        </div>
      </div>

      {/* Add Create Post Button */}
      <button onClick={handleCreatePost} style={styles.createPostButton}>
        게시글 작성
      </button>

      <div style={styles.listContainer}>
        {boards.length === 0 ? (
          <div>데이터가 없습니다</div>
        ) : (
          boards.map((board) => (
            <div
              key={board.boardId}
              style={styles.row}
              onClick={() => handlePostClick(board.boardId)}
            >
              <span style={styles.titleColumn}>{board.title}</span>
              <span style={styles.authorColumn}>{board.author}</span>
              <span style={styles.dateColumn}>{new Date(board.createdAt).toLocaleDateString()}</span>
              <span style={styles.viewColumn}>{board.viewCount}</span>
              <span style={styles.likeColumn}>{board.likesCount}</span>
              <span style={styles.commentCount}>{board.commentCount}</span>
            </div>
          ))
        )}
      </div>

      <div style={styles.pagination}>
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>이전</button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => setPage(index + 1)}
            style={index + 1 === page ? styles.activePage : {}}
          >
            {index + 1}
          </button>
        ))}
        <button onClick={() => setPage(page + 1)} disabled={page === totalPages}>다음</button>
      </div>
    </div>
  );
};

// 스타일을 업데이트하여 정렬을 맞춥니다.
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f7f7f7',
    minHeight: '100vh',
  },
  searchSortContainer: {
    display: 'flex',
    width: '100%',
    maxWidth: '800px',
    marginBottom: '20px',
    gap: '10px',
  },
  searchContainer: {
    position: 'relative',
    flex: 1,
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', 
  },
  searchInput: {
    width: '100%',
    padding: '8px 30px 8px 10px',
    borderRadius: '4px',
    border: '1px solid black',
    fontSize: '12px',
  },
  searchButton: {
    position: 'absolute',
    right: '5px',
    top: '50%',
    transform: 'translateY(-50%)',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    fontSize: '16px',
  },
  dropdownContainer: {
    position: 'relative',
  },
  sortButton: {
    padding: '8px',
    width: '100px',
    border: '1px solid black',
    backgroundColor: '#fff',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  dropdownMenu: {
    position: 'absolute',
    top: '35px',
    left: 0,
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '4px',
    width: '100px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    zIndex: 1,
  },
  dropdownItem: {
    padding: '8px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  listContainer: {
    width: '100%',
    maxWidth: '800px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    border: '1px solid black', 
    padding: '10px',
    marginTop: '10px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
  },
  tableHeader: {
    display: 'flex',
    fontWeight: 'bold',
    borderBottom: '2px solid #ddd',
    padding: '8px 0',
    fontSize: '14px',
  },
  row: {
    display: 'flex',
    padding: '8px 0',
    borderBottom: '1px solid #ddd',
    alignItems: 'center',
    fontSize: '12px',
    cursor: 'pointer',  // 클릭 가능한 포인터 추가
  },
  titleColumn: {
    flex: 3,  // 제목을 약간 더 넓게 설정
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    paddingRight: '8px',
  },
  authorColumn: {
    flex: 1,
    textAlign: 'center',
  },
  dateColumn: {
    flex: 1,
    textAlign: 'center',
  },
  viewColumn: {
    flex: 1,
    textAlign: 'center',
  },
  likeColumn: {
    flex: 1,
    textAlign: 'center',
  },
  commentCount: {
    flex: 1,
    textAlign: 'center',
  },
  pagination: {
    marginTop: '15px',
    display: 'flex',
    gap: '6px',
    fontSize: '12px',
  },
  activePage: {
    fontWeight: 'bold',
    backgroundColor: '#ddd',
  },
};

export default QuestionBoard;
