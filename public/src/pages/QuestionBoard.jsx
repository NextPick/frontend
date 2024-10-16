import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';  // 돋보기 아이콘 추가

const ReviewBoard = () => {
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
          page: 1,
          size: 1000,
          sort: sortOption === '최신순' ? 'recent' : sortOption === '좋아요순' ? 'likes' : 'views',
        };

        if (searchKeyword.trim()) {
          params.keyword = searchKeyword;
        }

        const response = await axios.get(process.env.REACT_APP_API_URL + 'boards/Q', {
          params,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          }
        });
      } catch (error) {
        console.error('질문 게시판 데이터 가져오기 오류:', error);
      }
    };

    fetchBoards();
  }, [size, sortOption, searchKeyword, isNavigating]);

  const handlePostClick = (boardId) => {
    setIsNavigating(true);
    navigate(`/board/${boardId}`);
  };

  const handleCreatePost = () => {
    navigate('/board/question/post');
  };

  const handleSearch = () => {
    setSearchKeyword(keyword);
    setPage(1);
  };

  const getCurrentPageBoards = () => {
    const startIndex = (page - 1) * size;
    const endIndex = startIndex + size;
    return boards.slice(startIndex, endIndex);
  };

  const handleHeaderClick = () => {
    window.location.reload();
  };

  // 드롭다운 항목 클릭 시 드롭다운을 닫는 함수
  const handleDropdownItemClick = (option) => {
    setSortOption(option);
    setDropdownOpen(false);  // 드롭다운을 닫음
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title} onClick={handleHeaderClick}>질문 게시판</h1>
      <div style={styles.subtitle}>궁금한 질문들을 공유해주세요</div>
      <div style={styles.searchSortContainer}>
        <div style={styles.searchContainer}>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="검색어 입력..."
            style={styles.searchInput}
          />
          <button onClick={handleSearch} style={styles.searchButton}>
            <FaSearch /> {/* 돋보기 아이콘 추가 */}
          </button>
        </div>
        <div style={styles.dropdownContainer}>
          <button onClick={() => setDropdownOpen(!isDropdownOpen)} style={styles.sortButton}>
            {sortOption} ▼
          </button>
          {isDropdownOpen && (
            <div style={styles.dropdownMenu}>
              <div onClick={() => handleDropdownItemClick('최신순')} style={styles.dropdownItem}>최신순</div>
              <div onClick={() => handleDropdownItemClick('좋아요순')} style={styles.dropdownItem}>좋아요순</div>
              <div onClick={() => handleDropdownItemClick('조회순')} style={styles.dropdownItem}>조회순</div>
            </div>
          )}
        </div>
        <button onClick={handleCreatePost} style={styles.createPostButton}>
          게시글 작성
        </button>
      </div>

      <div style={styles.listContainer}>
        <div style={styles.tableHeader}>
          <span style={styles.titleColumn}>제목</span>
          <span style={styles.authorColumn}>작성자</span>
          <span style={styles.dateColumn}>작성일</span>
          <span style={styles.viewColumn}>조회수</span>
          <span style={styles.likeColumn}>좋아요</span>
          <span style={styles.commentCount}>댓글수</span>
        </div>

        {getCurrentPageBoards().length === 0 ? (
          <div>데이터가 없습니다</div>
        ) : (
          getCurrentPageBoards().map((board) => (
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
      <div style={styles.pageInfo}>
        총 {boards.length}개 항목 중 {page} 페이지
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f9f9f9',
    minHeight: '100vh',
  },
  title: {
    marginTop: '50px',
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: '10px',
  },
  subtitle: {
    fontSize: '16px',
    color: '#7f8c8d',
    marginBottom: '20px',
  },
  searchSortContainer: {
    display: 'flex',
    width: '100%',
    maxWidth: '800px',
    marginBottom: '20px',
    gap: '20px',
    alignItems: 'center',
  },
  searchContainer: {
    display: 'flex',
    position: 'relative',
    flex: 1,
  },
  searchInput: {
    marginTop: '20px',
    width: '100%',
    Height: '15px',
    padding: '12px',
    borderRadius: '10px',
    border: '1px solid #ccc',
    fontSize: '16px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  },
  searchButton: {
    position: 'absolute',
    right: '12px',
    top: '35%',
    transform: 'translateY(-50%)',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: '18px',
    color: '#2c3e50',
  },
  dropdownContainer: {
    position: 'relative',
  },
  sortButton: {
    padding: '10px 16px',  // 둥근 스타일 제거
    width: '120px',
    border: '1px solid #ccc',
    backgroundColor: '#fff',
    borderRadius: '5px',  // 둥근 스타일을 줄이고 얇게 만듦
    cursor: 'pointer',
    fontSize: '16px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  },
  dropdownMenu: {
    position: 'absolute',
    top: '45px',
    left: 0,
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '4px',
    width: '120px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    zIndex: 1,
  },
  dropdownItem: {
    padding: '10px',
    cursor: 'pointer',
    fontSize: '14px',
    '&:hover': {
      backgroundColor: '#f0f0f0',
    },
  },
  createPostButton: {
    padding: '12px 24px',
    backgroundColor: '#4c89fc',
    color: 'white',
    borderRadius: '10px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    marginLeft: 'auto',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
    transition: 'background-color 0.3s',
    '&:hover': {
      backgroundColor: '#0e2f47',
    },
  },
  listContainer: {
    width: '100%',
    maxWidth: '800px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    border: '1px solid #ddd',
    padding: '10px',
    marginTop: '20px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
  },
  tableHeader: {
    display: 'flex',
    fontWeight: 'bold',
    borderBottom: '2px solid #ddd',
    padding: '12px 0',
    fontSize: '16px',
  },
  row: {
    display: 'flex',
    padding: '10px 0',
    borderBottom: '1px solid #ddd',
    alignItems: 'center',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  titleColumn: {
    flex: 3,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    paddingRight: '12px',
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
    marginTop: '20px',
    display: 'flex',
    gap: '10px',
    fontSize: '14px',
  },
  activePage: {
    fontWeight: 'bold',
    backgroundColor: '#4b8da6',
    color: 'white',
  },
  pageInfo: {
    marginTop: '10px',
    fontSize: '14px',
    color: '#666',
    textAlign: 'center',
  },
};

export default ReviewBoard;
