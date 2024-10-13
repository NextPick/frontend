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
    <div style={container}>
      <h2 style={titleContainer}>
        <span style={mainTitle}>면접 질문 게시판</span>
        <span style={{ margin: '0 5px -6px', fontSize: '18px'}}>|</span>
        <span style={subTitle}>게시글 내용</span>
      </h2>
      <hr style={{ ...divider, width: '900px' }} />
      <div style={contentContainer}>
        <div style={boardContainer}>
          {/* 게시글 제목 */}
          <h2 style={title}>CONTROLLER에서 응답 객체로 사용하는 RESPONSEENTITY 이거 맞나요?</h2>
          
          {/* 구분선 */}
          <div style={titleDivider}></div>

          <div style={boardInfoContainer}>
              {/* 작성자 정보 및 날짜 */}
              <div style={infoContainer}>
              <div style={authorContainer}>
                  <div style={authorAvatar}></div>
                  <span style={author}>등록자</span>
              </div>
              <span style={date}>2024.09.29 | 110 VIEW</span>
              </div>

              {/* 게시글 내용 컨테이너 */}
              <div style={postContentContainer}>
              <p>CONTROLLER에서 응답 객체로 사용하는 RESPONSEENTITY에 대해서 설명해 주세요.</p>
              <p>→ RESPONSEENTITY는 SPRING MVC에서 HTTP 응답을 표현하는 클래스입니다. 상태 코드, 헤더, 본문을 포함할 수 있으며, 클라이언트에 대한 완전한 HTTP 응답을 제어할 수 있게 해줍니다. 해당 문제에 대한 답으로 이게 맞나요?</p>
              </div>
          </div>

          {/* 좋아요 및 댓글 */}
          <div style={interactionContainer}>
            <span style={like}>👍</span>
            <span sytle={count}> 11</span>
            <span style={comment}>💬</span>
            <span sytle={count}> 2</span>
          </div>

          {/* 구분선 */}
          <div style={commentDivider}></div>

          {/* 댓글 리스트 */}
          <div style={commentContainer}>
            <div style={commentItem}>
              <div style={avatar}></div>
              <div style={commentContent}>
                <span style={commentAuthor}>냠냠이다만</span>
                <span style={commentDate}>09/28 15:00</span>
                <p style={commentText}>저도 그렇게 생각하고 같은데 더 좋은 답변이 있을지 다른 분들의 의견도 궁금합니다.</p>
              </div>
            </div>
            <div style={commentItem}>
              <div style={avatar}></div>
              <div style={commentContent}>
                <span style={commentAuthor}>등록자</span>
                <span style={commentDate}>09/29 15:00</span>
                <p style={commentText}>네 맞아요! 감사합니다!</p>
              </div>
            </div>
          </div>

          {/* 댓글 입력 */}
          <div style={commentInputContainer}>
            <input type="text" placeholder="답글" style={commentInput} />
            <button style={commentButton}>ENTER</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const container = {
  display: 'flex',
  flexDirection: 'column',
  marginTop: '5vh',
  alignItems: 'center',
  height: '90vh',
  backgroundColor: '#FFF',
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
const boardContainer = {
  width: '100%',
  maxWidth: '800px',
  backgroundColor: '#f7f7f7',
  borderRadius: '8px',
  border: '1px solid #ccc',
  padding: '20px',
};

const boardInfoContainer = {
  margin: '0 40px 0 40px',
  padding: '10px',
  backgroundColor: '#f7f7f7',
};

const infoContainer = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '5px',
};

const authorContainer = {
  display: 'flex',
  alignItems: 'center',
};

const authorAvatar = {
  width: '50px',
  height: '50px',
  backgroundColor: '#ddd',
  borderRadius: '50%',
  marginRight: '10px',
};

const avatar = {
  width: '65px',
  height: '65px',
  backgroundColor: '#ddd',
  borderRadius: '50%',
  marginRight: '10px',
};

const title = {
  fontSize: '18px',
  fontWeight: 'bold',
  marginBottom: '15px',
};

const titleDivider = {
  width: 'calc(100% + 40px)',
  height: '1px',
  backgroundColor: '#ccc',
  margin: '15px -20px',
};

const author = {
  fontSize: '14px',
};

const date = {
  fontSize: '14px',
  position: 'relative',
  top: '27px',
  margin: '0 4px 30px 0',
};

const postContentContainer = {
  border: '1px solid #ccc',
  borderRadius: '8px',
  padding: '15px',
  backgroundColor: '#f9f9f9',
  fontSize: '14px',
  lineHeight: '1.6',
  marginBottom: '20px',
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
};

const interactionContainer = {
  display: 'flex',
  gap: '15px',
};

const like = {
  marginTop: '-5px',
  fontSize: '20px',
};

const comment = {
  marginTop: '-5px',
  fontSize: '20px',
};

const count = {
  fontSize: '12px',
}

const commentDivider = {
  width: '100%',
  height: '1px',
  backgroundColor: '#ccc',
  marginBottom: '10px',
};

const commentContainer = {
  borderRadius: '8px',
  padding: '10px',
  marginBottom: '20px',
};

const commentItem = {
  display: 'flex',
  alignItems: 'flex-start',
  marginBottom: '10px',
};

const commentContent = {
  backgroundColor: '#fff',
  padding: '10px',
  borderRadius: '4px',
  border: '1px solid #ddd',
  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
  flex: 1,
  fontSize: '11px',
};

const commentAuthor = {
  fontWeight: 'bold',
  fontSize: '14px',
  marginRight: '10px',
};

const commentDate = {
  fontSize: '12px',
  color: '#777',
};

const commentText ={
  fontSize: '12px',
}
const commentInputContainer = {
  display: 'flex',
  alignItems: 'center',
};

const commentInput = {
  flex: 1,
  padding: '10px',
  borderRadius: '7px 0 0 7px',
  border: '1px solid #ccc',
  height: '100%',
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
};

const commentButton = {
  padding: '10px',
  width: '80px',
  borderRadius: '0 7px 7px 0',
  fontSize: '12px',
  height: '100%',
  border: '1px solid #ccc',
  backgroundColor: '#E0EBF5',
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
  cursor: 'pointer',
};

const pagination = {
  marginTop: '15px',
  display: 'flex',
  gap: '6px',
  fontSize: '12px',
};

export default PostDetail;
