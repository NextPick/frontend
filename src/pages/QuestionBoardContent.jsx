import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const PostDetail = () => {
  const { boardId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/posts/${boardId}`);
        setPost(response.data);
      } catch (err) {
        setError('게시글을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [boardId]);

  if (loading) return <p>로딩 중...</p>;
  // if (error) return <p>{error}</p>;

  return (
    <div style={styles.container}>
      <div style={styles.contentContainer}>
        {/* 게시글 제목 */}
        <h2 style={styles.title}>CONTROLLER에서 응답 객체로 사용하는 RESPONSEENTITY 이거 맞나요?</h2>
        
        {/* 구분선 */}
        <div style={styles.divider}></div>

        <div style={styles.boardInfoContainer}>
            {/* 작성자 정보 및 날짜 */}
            <div style={styles.infoContainer}>
            <div style={styles.authorContainer}>
                <div style={styles.avatar}></div>
                <span style={styles.author}>등록자</span>
            </div>
            <span style={styles.date}>2024.09.29 | 110 VIEW</span>
            </div>

            {/* 게시글 내용 컨테이너 */}
            <div style={styles.postContentContainer}>
            <p>CONTROLLER에서 응답 객체로 사용하는 RESPONSEENTITY에 대해서 설명해 주세요.</p>
            <p>→ RESPONSEENTITY는 SPRING MVC에서 HTTP 응답을 표현하는 클래스입니다. 상태 코드, 헤더, 본문을 포함할 수 있으며, 클라이언트에 대한 완전한 HTTP 응답을 제어할 수 있게 해줍니다. 해당 문제에 대한 답으로 이게 맞나요?</p>
            </div>
        </div>

        {/* 좋아요 및 댓글 */}
        <div style={styles.interactionContainer}>
          <span style={styles.like}>👍 11</span>
          <span style={styles.comment}>💬 2</span>
        </div>

        {/* 구분선 */}
        <div style={styles.commentDivider}></div>

        {/* 댓글 리스트 */}
        <div style={styles.commentContainer}>
          <div style={styles.comment}>
            <div style={styles.avatar}></div>
            <div style={styles.commentContent}>
              <span style={styles.commentAuthor}>냠냠이다만</span>
              <span style={styles.commentDate}>09/28 15:00</span>
              <p>저도 그렇게 생각하고 같은데 더 좋은 답변이 있을지 다른 분들의 의견도 궁금합니다.</p>
            </div>
          </div>
          <div style={styles.comment}>
            <div style={styles.avatar}></div>
            <div style={styles.commentContent}>
              <span style={styles.commentAuthor}>등록자</span>
              <span style={styles.commentDate}>09/29 15:00</span>
              <p>네 맞아요! 감사합니다!</p>
            </div>
          </div>
        </div>

        {/* 댓글 입력 */}
        <div style={styles.commentInputContainer}>
          <input type="text" placeholder="답글" style={styles.commentInput} />
          <button style={styles.commentButton}>ENTER</button>
        </div>
      </div>
    </div>
  );
};

// 스타일 정의
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
  contentContainer: {
    width: '100%',
    maxWidth: '800px',
    backgroundColor: '#f7f7f7',
    borderRadius: '8px',
    border: '1px solid black',
    padding: '20px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
  },
  boardInfoContainer:{
    margin: '0 40px 0 40px',
    padding: '10px',
    backgroundColor: '#f7f7f7',
  },
  infoContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '5px',
  },
  authorContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  avatar: {
    width: '70px',
    height: '70px',
    backgroundColor: '#ddd',
    borderRadius: '50%',
    marginRight: '10px',
  },
  title: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '15px',
  },
  divider: {
    width: 'calc(100% + 40px)',  // contentContainer padding 값 고려
    height: '1px',
    backgroundColor: 'black',
    margin: '15px -20px',  // 좌우 패딩을 맞추기 위해 padding만큼 offset
  },
  author: {
    fontSize: '14px',
  },
  date: {
    fontSize: '14px',
    position: 'relative',
    top: '27px', // 중앙에서 약간 아래로 이동
  },
  postContentContainer: {
    border: '1px solid black',
    borderRadius: '8px',
    padding: '15px',
    backgroundColor: '#f9f9f9',
    fontSize: '14px',
    lineHeight: '1.6',
    marginBottom: '20px',
    border: '1px solid black',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
  },
  interactionContainer: {
    display: 'flex',
    gap: '15px',
  },
  like: {
    fontSize: '14px',
  },
  comment: {
    fontSize: '14px',
  },
  commentDivider: {
    width: '100%',  // contentContainer padding 값 고려
    height: '1px',
    backgroundColor: 'black',
    marginBottom: '10px',
  },
  commentContainer: {
    backgroundColor: '#eee',
    borderRadius: '8px',
    padding: '10px',
    marginBottom: '20px',
  },
  comment: {
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: '10px',
  },
  commentContent: {
    backgroundColor: '#fff',
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    flex: 1,
    fontSize: '11px',  // 댓글 내용의 폰트 크기를 3px 줄임
  },
  commentAuthor: {
    fontWeight: 'bold',
    fontSize: '14px',
    marginRight: '10px',
  },
  commentDate: {
    fontSize: '12px',
    color: '#777',
  },
  commentInputContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  commentInput: {
    flex: 1,
    padding: '10px',
    borderRadius: '7px 0 0 7px',
    border: '1px solid black',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
  },
  commentButton: {
    padding: '10px',
    borderRadius: '0 7px 7px 0',
    border: '1px solid black',
    backgroundColor: '#fff',
    cursor: 'pointer',
  },
  pagination: {
    marginTop: '15px',
    display: 'flex',
    gap: '6px',
    fontSize: '12px',
  },
};

export default PostDetail;
