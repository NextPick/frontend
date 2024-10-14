import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PostDetail = () => {
  const { boardId } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [newReply, setNewReply] = useState({});
  const [editContent, setEditContent] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likesCount, setLikesCount] = useState(0);
  const navigate = useNavigate();

  // 게시글 가져오기
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/boards/${boardId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        setPost(response.data);
        setLikesCount(response.data.likesCount);
      } catch (err) {
        setError('게시글을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [boardId]);

  // 댓글 목록 가져오기
  const fetchComments = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/boards/${boardId}/comments`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      setComments(response.data);
    } catch (err) {
      setError('댓글을 불러오는 중 오류가 발생했습니다.');
    }
  };

  useEffect(() => {
    fetchComments();
  }, [boardId]);

  const handleLike = async () => {
    try {
      const response = await axios.post(`http://localhost:8080/boards/${boardId}/likes`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      const { likesCount, likedByUser } = response.data;
      setLikesCount(likesCount);
      setPost((prevPost) => ({
        ...prevPost,
        likedByUser: likedByUser,
      }));
    } catch (error) {
      console.error('좋아요 처리 중 오류 발생:', error);
    }
  };

  // 댓글 추가 처리
  const handleCommentSubmit = async () => {
    try {
      await axios.post(
        `http://localhost:8080/boards/${boardId}/comments`,
        { content: newComment },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          }
        }
      );
      setNewComment('');  // 댓글 입력 필드 초기화
      fetchComments();     // 댓글 목록 새로고침
    } catch (error) {
      console.error('댓글 작성 중 오류 발생:', error);
    }
  };

  // 대댓글 추가 처리
  const handleReplySubmit = async (parentCommentId) => {
    try {
      await axios.post(
        `http://localhost:8080/boards/${boardId}/comments`,
        {
          content: newReply[parentCommentId],
          parentCommentId: parentCommentId,  // 부모 댓글 ID 포함
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          }
        }
      );
      setNewReply({ ...newReply, [parentCommentId]: '' });  // 입력 필드 초기화
      fetchComments();  // 댓글 목록 새로고침
    } catch (error) {
      console.error('대댓글 작성 중 오류 발생:', error);
    }
  };

  const handleReplyChange = (parentCommentId, value) => {
    setNewReply({ ...newReply, [parentCommentId]: value });
  };

  // 댓글 수정 처리
  const handleEditCommentSubmit = async (commentId) => {
    try {
      await axios.patch(
        `http://localhost:8080/boards/${boardId}/comments/${commentId}`,
        { content: editContent[commentId] },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          }
        }
      );
      setEditContent({ ...editContent, [commentId]: '' });
      fetchComments();
    } catch (error) {
      console.error('댓글 수정 중 오류 발생:', error);
    }
  };

  const handleEditChange = (commentId, value) => {
    setEditContent({ ...editContent, [commentId]: value });
  };

  // 댓글 삭제 처리
  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`http://localhost:8080/boards/${boardId}/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      fetchComments(); // 댓글 목록 새로고침
    } catch (error) {
      console.error('댓글 삭제 중 오류 발생:', error);
    }
  };

  // 댓글 및 대댓글 렌더링
  const renderComments = (parentId = null) => {
    return comments
      .filter(comment => comment.parentCommentId === parentId)
      .map(comment => (
        <div key={comment.boardCommentId} style={{ marginLeft: parentId ? '40px' : '0px' }}>
          <div style={commentItem}>
            <div style={avatar}></div>
            <div style={commentContent}>
              <span style={commentAuthor}>{comment.nickname}</span>
              <span style={commentDate}>{new Date(comment.createdAt).toLocaleDateString()}</span>
              <p style={commentText}>{comment.content}</p>

              {/* Edit/Delete buttons */}
              <button onClick={() => handleDeleteComment(comment.boardCommentId)} style={deleteButton}>
                삭제
              </button>
              <input
                type="text"
                placeholder="댓글 수정"
                value={editContent[comment.boardCommentId] || ''}
                onChange={(e) => handleEditChange(comment.boardCommentId, e.target.value)}
                style={commentInput}
              />
              <button onClick={() => handleEditCommentSubmit(comment.boardCommentId)} style={commentButton}>
                수정
              </button>

              {/* 부모 댓글일 때만 대댓글 입력 필드 제공 */}
              {!parentId && (
                <>
                  <input
                    type="text"
                    placeholder="답글 달기"
                    value={newReply[comment.boardCommentId] || ''}
                    onChange={(e) => handleReplyChange(comment.boardCommentId, e.target.value)}
                    style={commentInput}
                  />
                  <button
                    style={commentButton}
                    onClick={() => handleReplySubmit(comment.boardCommentId)}
                  >
                    답글 달기
                  </button>
                </>
              )}

              {/* 대댓글 재귀 렌더링 */}
              {renderComments(comment.boardCommentId)}
            </div>
          </div>
        </div>
      ));
  };


  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>{error}</p>;
  if (!post) return <p>게시글이 존재하지 않습니다.</p>;

  return (
    <div style={container}>
      <h2 style={titleContainer}>
        <span style={mainTitle}>게시글 제목: {post.title}</span>
        <span style={{ margin: '0 5px -6px', fontSize: '18px' }}>|</span>
        <span style={subTitle}>작성자: {post.author}</span>
      </h2>
      <hr style={{ ...divider, width: '900px' }} />
      <div style={contentContainer}>
        <div style={boardContainer}>
          {/* 이미지 렌더링 */}
          {post.imageUrls && post.imageUrls.length > 0 && (
            <div style={imageContainer}>
              {post.imageUrls.map((imageUrl, index) => (
                <img key={index} src={imageUrl} alt={`게시글 이미지 ${index + 1}`} style={imageStyle} />
              ))}
            </div>
          )}

          <div style={boardInfoContainer}>
            <div style={infoContainer}>
              <div style={authorContainer}>
                <span style={author}>작성자: {post.author}</span>
              </div>
              <span style={date}>작성일: {new Date(post.createdAt).toLocaleDateString()} | 조회수: {post.viewCount} | 수정일: {new Date(post.modifiedAt).toLocaleDateString()}</span>
            </div>

            <div style={postContentContainer}>
              <p>{post.content}</p>
            </div>

            {post.dtype === 'ReviewBoard' && post.boardCategory && (
              <p>카테고리: {post.boardCategory}</p>
            )}

            <div style={interactionContainer}>
              <span onClick={handleLike} style={{ cursor: 'pointer' }}>👍</span>
              <span>{likesCount}</span>
              <span>💬 {comments.length}</span>
            </div>

            {/* 댓글 리스트 */}
            {renderComments()}

            {/* 새 댓글 입력 */}
            <div style={commentInputContainer}>
              <input
                type="text"
                placeholder="댓글 작성"
                style={commentInput}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button style={commentButton} onClick={handleCommentSubmit}>댓글 달기</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 스타일 (CSS-in-JS 방식)
const container = {
  display: 'flex',
  flexDirection: 'column',
  marginTop: '5vh',
  alignItems: 'center',
  backgroundColor: '#FFF',
};

const titleContainer = {
  marginBottom: '-10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  width: '900px',
  marginLeft: '20px',
};

const mainTitle = {
  fontWeight: 'Bold',
  fontSize: '26px',
};

const subTitle = {
  fontSize: '18px',
  marginTop: '10px',
};

const divider = {
  borderTop: '2px solid #A0A0A0',
  marginBottom: '40px',
};

const contentContainer = {
  justifyContent: 'center',
  flexDirection: 'column',
  backgroundColor: '#E0EBF5',
  alignItems: 'center',
  width: '800px',
  padding: '20px',
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
  borderRadius: '20px',
};

const boardContainer = {
  width: '100%',
  backgroundColor: '#f7f7f7',
  borderRadius: '8px',
  border: '1px solid #ccc',
  padding: '20px',
};

const imageContainer = {
  marginBottom: '15px',
};

const imageStyle = {
  maxWidth: '100%',
  maxHeight: '400px',
  marginBottom: '10px',
  borderRadius: '8px',
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
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
  padding: '15px',
  backgroundColor: '#f9f9f9',
  marginBottom: '20px',
};

const interactionContainer = {
  display: 'flex',
  gap: '15px',
};

const commentDivider = {
  width: '100%',
  height: '1px',
  backgroundColor: '#ccc',
  marginBottom: '10px',
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

const deleteButton = {
  backgroundColor: '#FF6B6B',
  color: '#fff',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: 'bold',
  marginTop: '20px',
};

const avatar = {
  width: '40px',
  height: '40px',
  backgroundColor: '#ccc',
  borderRadius: '50%',
  marginRight: '10px',
};

const commentDate = {
  fontSize: '12px',
  color: '#888',
  marginLeft: '10px',
};

const commentText = {
  marginTop: '5px',
  fontSize: '14px',
};

const commentInputContainer = {
  display: 'flex',
  alignItems: 'center',
  marginTop: '20px',
};

const commentInput = {
  flex: 1,
  padding: '10px',
  borderRadius: '8px',
  border: '1px solid #ccc',
  marginRight: '10px',
  fontSize: '14px',
};

const commentButton = {
  backgroundColor: '#4CAF50',
  color: '#fff',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: 'bold',
};

export default PostDetail;
