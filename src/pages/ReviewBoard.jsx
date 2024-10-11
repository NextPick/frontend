import React, { useState } from 'react';

const Board = () => {
    const [sortOption, setSortOption] = useState("정렬");
    const [isDropdownOpen, setDropdownOpen] = useState(false);
  
    const handleSortOptionClick = (option) => {
      setSortOption(option);
      setDropdownOpen(false);
      // 여기에 정렬 기능을 추가할 수 있습니다.
    };
  
    const toggleDropdown = () => {
      setDropdownOpen(!isDropdownOpen);
    };
  // 더미 데이터 생성
  const posts = [
    {
      post_id: 1,
      title: "면접 준비 팁",
      member_nickname: "작성자1",
      view: "74071",
      like_count: 28,
      created_at: "10-04",
    },
    {
      post_id: 2,
      title: "자기소개서 작성법",
      member_nickname: "작성자2",
      view: "125114",
      like_count: 25,
      created_at: "10-04",
    },
    {
      post_id: 3,
      title: "제목이 너무 길면 상단 제목 길이에 맞춰 줄임표 사용하기",
      member_nickname: "작성자3",
      view: "43120",
      like_count: 124,
      created_at: "09-05",
    },
    {
      post_id: 4,
      title: "제목이 너무 길면 상단 제목 길이에 맞춰 줄임표 사용하기",
      member_nickname: "작성자4",
      view: "2151",
      like_count: 1,
      created_at: "10-02",
    },
    {
      post_id: 5,
      title: "아래처럼 이렇게 말줄임표가 나옵니다 와라라라라라라라라라라라라라라라라라",
      member_nickname: "작성자3",
      view: "43120",
      like_count: 124,
      created_at: "09-05",
    },
    {
      post_id: 6,
      title: "요를레히요를레리요를레히요를레릴호호오료를리레리요를레히요를레릴호호오료를리레리",
      member_nickname: "작성자4",
      view: "2151",
      like_count: 1,
      created_at: "10-02",
    },
    {
      post_id: 7,
      title: "아래처럼 이렇게 말줄임표가 나옵니다 와라라라라라라라라라라라라라라라라라",
      member_nickname: "작성자3",
      view: "43120",
      like_count: 124,
      created_at: "09-05",
    },
    {
      post_id: 8,
      title: "요를레히요를레리요를레히요를레릴호호오료를리레리요를레히요를레릴호호오료를리레리",
      member_nickname: "작성자4",
      view: "2151",
      like_count: 1,
      created_at: "10-02",
    },
    {
      post_id: 9,
      title: "아래처럼 이렇게 말줄임표가 나옵니다 와라라라라라라라라라라라라라라라라라",
      member_nickname: "작성자3",
      view: "43120",
      like_count: 124,
      created_at: "09-05",
    },
    {
      post_id: 10,
      title: "요를레히요를레리요를레히요를레릴호호오료를리레리요를레히요를레릴호호오료를리레리",
      member_nickname: "작성자4",
      view: "2151",
      like_count: 1,
      created_at: "10-02",
    },
  ];

  return (
    <div style={styles.container}>
      {/* 검색 바 및 정렬 버튼 */}
      <div style={styles.searchSortContainer}>
        <div style={styles.searchContainer}>
          <input type="text" placeholder="검색..." style={styles.searchInput} />
          <button style={styles.searchButton}>🔍</button>
        </div>
        <div style={styles.dropdownContainer}>
          <button onClick={toggleDropdown} style={styles.sortButton}>
            {sortOption} ▼
          </button>
          {isDropdownOpen && (
            <div style={styles.dropdownMenu}>
              <div onClick={() => handleSortOptionClick("최신순")} style={styles.dropdownItem}>최신순</div>
              <div onClick={() => handleSortOptionClick("좋아요순")} style={styles.dropdownItem}>좋아요순</div>
              <div onClick={() => handleSortOptionClick("조회순")} style={styles.dropdownItem}>조회순</div>
            </div>
          )}
        </div>
      </div>

      {/* 게시글 리스트 컨테이너 */}
      <div style={styles.listContainer}>
        <div style={styles.tableHeader}>
          <span style={styles.titleColumn}>제목</span>
          <span style={styles.authorColumn}>글쓴이</span>
          <span style={styles.dateColumn}>등록일</span>
          <span style={styles.viewColumn}>조회수</span>
          <span style={styles.likeColumn}>추천수</span>
        </div>

        {posts.map((post) => (
          <div key={post.post_id} style={styles.row}>
            <span style={styles.titleColumn} title={post.title}>{post.title}</span>
            <span style={styles.authorColumn}>{post.member_nickname}</span>
            <span style={styles.dateColumn}>{post.created_at}</span>
            <span style={styles.viewColumn}>{post.view}</span>
            <span style={styles.likeColumn}>{post.like_count}</span>
          </div>
        ))}
      </div>

      {/* 페이지네이션 */}
      <div style={styles.pagination}>
        <span>1</span>
        <span>2</span>
        <span>3</span>
        <span>4</span>
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
    },
    titleColumn: {
      flex: 4,
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
    pagination: {
      marginTop: '15px',
      display: 'flex',
      gap: '6px',
      fontSize: '12px',
    },
  };
  
  export default Board;