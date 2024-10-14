import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // useNavigate 사용

const QuestionBoard = () => {
  const [boards, setBoards] = useState([]);  // 게시판 데이터를 저장하는 상태
  const [page, setPage] = useState(1);  // 현재 페이지
  const [size, setSize] = useState(10);  // 한 페이지당 보여줄 게시물 수
  const [sortOption, setSortOption] = useState('최신순');  // 정렬 기준 (기본값: 최신순)
  const [keyword, setKeyword] = useState('');  // 검색어
  const [searchKeyword, setSearchKeyword] = useState('');  // 실제 검색에 사용되는 검색어
  const [totalPages, setTotalPages] = useState(1);  // 전체 페이지 수
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);  // 페이지 전환 여부를 저장
  const navigate = useNavigate();  // 페이지 이동을 위한 useNavigate 훅

  // 백엔드에서 데이터를 가져오는 useEffect
  useEffect(() => {
    // 페이지 전환 중이라면 데이터 요청을 하지 않도록 설정
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

        const response = await axios.get(process.env.REACT_APP_API_URL + 'boards/Q', {
          params,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          }
        });

        const boardData = response.data;
        if (boardData && boardData.content && boardData.content.length > 0) {
          setBoards(boardData.content);  // 게시판 데이터를 상태에 저장
          setTotalPages(boardData.totalPages);  // 전체 페이지 수 설정
        } else if (boardData && boardData.length > 0) {
          setBoards(boardData);  // 게시판 데이터를 상태에 저장
          setTotalPages(Math.ceil(boardData.length / size));  // 페이지 수 설정 (데이터 직접 계산)
        } else {
          setBoards([]);  // 게시판 데이터가 없을 경우 빈 배열로 초기화
        }
      } catch (error) {
        console.error('질문 게시판 데이터 가져오기 오류:', error);
      }
    };

    fetchBoards();
  }, [page, size, sortOption, searchKeyword, isNavigating]);  // isNavigating 추가

  // 검색어 상태 업데이트
  const handleSearch = (e) => {
    setKeyword(e.target.value);
  };

  // 검색 버튼 클릭 시 실행되는 함수
  const executeSearch = () => {
    setSearchKeyword(keyword);  // 실제 검색어를 상태로 저장
    setPage(1);  // 검색 후 첫 페이지로 이동
  };

  const handleSortOptionClick = (option) => {
    setSortOption(option);
    setDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  // 게시물 클릭 시 게시물 상세 페이지로 이동
  const handlePostClick = (boardId) => {
    setIsNavigating(true);  // 페이지 전환 중임을 표시
    navigate(`/board/${boardId}`);
  };

  return (
    <div style={styles.container}>
      <div style={styles.searchSortContainer}>
        <div style={styles.searchContainer}>
          <input
            type="text"
            value={keyword}
            onChange={handleSearch}
            placeholder="검색어 입력..."
            style={styles.searchInput}
          />
          <button onClick={executeSearch} style={styles.searchButton}>🔍</button>  {/* 검색 버튼 클릭 시 실행 */}
        </div>
        <div style={styles.dropdownContainer}>
          <button onClick={toggleDropdown} style={styles.sortButton}>
            {sortOption} ▼
          </button>
          {isDropdownOpen && (
            <div style={styles.dropdownMenu}>
              <div onClick={() => handleSortOptionClick('최신순')} style={styles.dropdownItem}>최신순</div>
              <div onClick={() => handleSortOptionClick('좋아요순')} style={styles.dropdownItem}>좋아요순</div>
              <div onClick={() => handleSortOptionClick('조회순')} style={styles.dropdownItem}>조회순</div>
            </div>
          )}
        </div>
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

        {boards.length === 0 ? (
          <div>데이터가 없습니다</div>
        ) : (
          boards.map((board) => (
            <div
              key={board.boardId}
              style={styles.row}
              onClick={() => handlePostClick(board.boardId)}  // 게시물 클릭 시 상세 페이지로 이동
            >
              <span style={styles.titleColumn} title={board.title}>{board.title}</span>
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
        <button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>이전</button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            style={index + 1 === page ? styles.activePage : {}}
          >
            {index + 1}
          </button>
        ))}
        <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}>다음</button>
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
    padding: '8px 40px 8px 10px',  // 오른쪽 패딩을 키워서 돋보기가 들어갈 공간 확보
    borderRadius: '4px',
    border: '1px solid black',
    fontSize: '12px',
  },
  searchButton: {
    position: 'absolute',
    right: '10px', 
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
