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
      view: "125132114",
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
    <div style={container}>
      <h2 style={titleContainer}>
        <span style={mainTitle}>면접 질문 게시판</span>
        <span style={{ margin: '0 5px -6px', fontSize: '18px'}}>|</span>
        <span style={subTitle}>게시판 목록</span>
      </h2>
      <hr style={{ ...divider, width: '900px' }} />
      <div style={contentContainer}>
        {/* 검색 바 및 정렬 버튼 */}
        <div style={searchSortContainer}>
          <div style={searchContainer}>
            <input type="text" placeholder="검색..." style={searchInput} />
            <button style={searchButton}>🔍</button>
          </div>
          <div style={dropdownContainer}>
            <button onClick={toggleDropdown} style={sortButton}>
              {sortOption} ▼
            </button>
            {isDropdownOpen && (
              <div style={dropdownMenu}>
                <div onClick={() => handleSortOptionClick("최신순")} style={dropdownItem}>최신순</div>
                <div onClick={() => handleSortOptionClick("좋아요순")} style={dropdownItem}>좋아요순</div>
                <div onClick={() => handleSortOptionClick("조회순")} style={dropdownItem}>조회순</div>
              </div>
            )}
          </div>
        </div>

        {/* 게시글 리스트 컨테이너 */}
        <div style={listContainer}>
          <div style={tableHeader}>
            <span style={titleColumn}>제목</span>
            <span style={authorColumn}>글쓴이</span>
            <span style={dateColumn}>등록일</span>
            <span style={viewColumn}>조회수</span>
            <span style={likeColumn}>추천수</span>
          </div>

          {posts.map((post) => (
            <div key={post.post_id} style={row}>
              <span style={titleColumn} title={post.title}>{post.title}</span>
              <span style={authorColumn}>{post.member_nickname}</span>
              <span style={dateColumn}>{post.created_at}</span>
              <span style={viewColumn}>{post.view}</span>
              <span style={likeColumn}>{post.like_count}</span>
            </div>
          ))}
        </div>

        {/* 페이지네이션 */}
        <div style={pagination}>
          <span>1</span>
          <span>2</span>
          <span>3</span>
          <span>4</span>
        </div>
      </div>
    </div>
  );
};

const titleContainer = {
  marginBottom: '-10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start', // Aligns content to the start of the flex container
  width: '900px', // Matches the width of the divider for alignment
  marginLeft: '20px', // Adds some space from the left edge
};

const mainTitle = {
  fontWeight: 'Bold',
  fontSize: '26px', // Updated font size
};

const subTitle = {
  fontSize: '18px', // Updated font size
  marginTop: '10px',
};

const divider = {
  borderTop: '2px solid #A0A0A0',
  marginBottom: '40px',
};
const container = {
  display: 'flex',
  flexDirection: 'column',
  marginTop: '5vh',
  alignItems: 'center',
  height: '90vh',
  backgroundColor: '#FFF',
};

const contentContainer ={
  justifyContent: 'center',
  flexDirection: 'column',
  backgroundColor: '#E0EBF5',
  alignItems: 'center',
  width: '800px',
  padding: '20px',
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
  borderRadius: '20px',
}

const searchSortContainer = {
  display: 'flex',
  width: '100%',
  maxWidth: '800px',
  marginBottom: '20px',
  gap: '10px',
};

const searchContainer = {
  position: 'relative',
  flex: 1,
};

const searchInput = {
  width: '100%',
  padding: '8px 30px 8px 10px',
  borderRadius: '4px',
  border: '1px solid #ccc',
  fontSize: '12px',
};

const searchButton = {
  position: 'absolute',
  right: '5px',
  top: '50%',
  transform: 'translateY(-50%)',
  border: 'none',
  backgroundColor: 'transparent',
  cursor: 'pointer',
  fontSize: '16px',
};

const dropdownContainer = {
  position: 'relative',
};

const sortButton = {
  padding: '8px',
  width: '100px',
  border: '1px solid #ccc',
  backgroundColor: '#fff',
  borderRadius: '20px',
  cursor: 'pointer',
  fontSize: '12px',
};

const dropdownMenu = {
  position: 'absolute',
  top: '35px',
  left: 0,
  backgroundColor: '#fff',
  border: '1px solid #ccc',
  borderRadius: '4px',
  width: '100px',
  zIndex: 1,
};

const dropdownItem = {
  padding: '8px',
  cursor: 'pointer',
  fontSize: '12px',
};

const listContainer = {
  width: '100%',
  maxWidth: '800px',
  backgroundColor: '#fff',
  borderRadius: '8px',
  border: '1px solid #ccc',
  padding: '10px',
  marginTop: '40px',
};

const tableHeader = {
  display: 'flex',
  fontWeight: 'bold',
  borderBottom: '2px solid #ddd',
  padding: '8px 0',
  fontSize: '14px',
};

const row = {
  display: 'flex',
  padding: '8px 0',
  borderBottom: '1px solid #ddd',
  alignItems: 'center',
  fontSize: '12px',
};

const titleColumn = {
  flex: 4,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  paddingRight: '8px',
};

const authorColumn = {
  flex: 1,
  textAlign: 'center',
};

const dateColumn = {
  flex: 1,
  textAlign: 'center',
};

const viewColumn = {
  flex: 1,
  textAlign: 'center',
};

const likeColumn = {
  flex: 1,
  textAlign: 'center',
};

const pagination = {
  marginTop: '15px',
  display: 'flex',
  gap: '6px',
  fontSize: '12px',
};
  
  export default Board;