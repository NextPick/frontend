import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PostDetail = () => {
  const { boardId } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [newReply, setNewReply] = useState({});
  const [editContent, setEditContent] = useState({});
  const [showReplyInput, setShowReplyInput] = useState({});
  const [showEditInput, setShowEditInput] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likesCount, setLikesCount] = useState(0);
  const currentNickname = localStorage.getItem('nickname');
  const navigate = useNavigate();

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
      setNewComment('');
      fetchComments();
    } catch (error) {
      console.error('댓글 작성 중 오류 발생:', error);
    }
  };

  const handleReplySubmit = async (parentCommentId) => {
    try {
      await axios.post(
        `http://localhost:8080/boards/${boardId}/comments`,
        {
          content: newReply[parentCommentId],
          parentCommentId: parentCommentId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          }
        }
      );
      setNewReply({ ...newReply, [parentCommentId]: '' });
      fetchComments();
    } catch (error) {
      console.error('답글 작성 중 오류 발생:', error);
    }
  };

  const handleReplyChange = (parentCommentId, value) => {
    setNewReply({ ...newReply, [parentCommentId]: value });
  };

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
      setShowEditInput({ ...showEditInput, [commentId]: false });
      fetchComments();
    } catch (error) {
      console.error('댓글 수정 중 오류 발생:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`http://localhost:8080/boards/${boardId}/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      fetchComments();
    } catch (error) {
      console.error('댓글 삭제 중 오류 발생:', error);
    }
  };

  const toggleReplyInput = (parentCommentId) => {
    setShowReplyInput((prevState) => ({
      ...prevState,
      [parentCommentId]: !prevState[parentCommentId]
    }));
  };

  const toggleEditInput = (commentId) => {
    setShowEditInput((prevState) => ({
      ...prevState,
      [commentId]: !prevState[commentId]
    }));
  };

  const renderComments = (parentId = null) => {
    return comments
      .filter(comment => comment.parentCommentId === parentId)
      .map(comment => (
        <div key={comment.boardCommentId} style={parentId ? replyStyle : commentStyle}>
          <div style={comment.nickname === currentNickname ? { ...commentItem, ...myCommentStyle } : commentItem}>
            <div style={commentContent}>
              <span style={commentAuthor}>
                {comment.nickname}
              </span>
              <span style={commentDate}>{new Date(comment.createdAt).toLocaleDateString()}</span>
              <p style={commentText}>{comment.content}</p>

              {/* 댓글 수정 버튼 */}
              {comment.nickname === currentNickname && (
                <>
                  <button onClick={() => toggleEditInput(comment.boardCommentId)} style={smallButton}>
                    수정
                  </button>
                  <button onClick={() => handleDeleteComment(comment.boardCommentId)} style={smallButton}>
                    삭제
                  </button>
                  {showEditInput[comment.boardCommentId] && (
                    <>
                      <input
                        type="text"
                        placeholder="댓글 수정"
                        value={editContent[comment.boardCommentId] || ''}
                        onChange={(e) => setEditContent({ ...editContent, [comment.boardCommentId]: e.target.value })}
                        style={commentInput} 
                      />
                      <button onClick={() => handleEditCommentSubmit(comment.boardCommentId)} style={smallButton}>
                        저장
                      </button>
                    </>
                  )}
                </>
              )}

              {/* 답글 달기 버튼 */}
              {!parentId && (
                <>
                  <button style={smallButton} onClick={() => toggleReplyInput(comment.boardCommentId)}>
                    답글 달기
                  </button>
                  {showReplyInput[comment.boardCommentId] && (
                    <>
                      <input
                        type="text"
                        placeholder="답글 작성"
                        value={newReply[comment.boardCommentId] || ''}
                        onChange={(e) => handleReplyChange(comment.boardCommentId, e.target.value)}
                        style={commentInput}
                      />
                      <button style={smallButton} onClick={() => handleReplySubmit(comment.boardCommentId)}>
                        답글 작성
                      </button>
                    </>
                  )}
                </>
              )}

              {/* 대댓글 렌더링 */}
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
      <h1 style={boardTitle}>
        {post.dtype === 'QuestionBoard' ? '면접 질문 게시판' : '면접 리뷰 게시판'}
      </h1>
      <h2 style={titleContainer}>
        <span style={mainTitle}>게시글 제목: {post.title}</span>
        <span style={{ margin: '0 5px -6px', fontSize: '18px' }}>|</span>
        <span style={subTitle}>작성자: {post.author}</span>
      </h2>
      <hr style={{ ...divider, width: '900px' }} />
      <div style={contentContainer}>
        <div style={boardContainer}>
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

            {renderComments()}

            <div style={commentInputContainer}>
              <input
                type="text"
                placeholder="댓글 작성"
                style={commentInput}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button style={smallButton} onClick={handleCommentSubmit}>댓글 달기</button>
            </div>
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
  backgroundColor: '#F9FAFB', // 부드러운 배경색
};

const boardTitle = {
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '20px 0',
  textAlign: 'center',
  color: '#333', // 텍스트 색상
};

const titleContainer = {
  marginBottom: '20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
};

const mainTitle = {
  fontWeight: 'Bold',
  fontSize: '24px',
  color: '#111',
};

const subTitle = {
  fontSize: '16px',
  color: '#888',
  marginLeft: '8px',
};

const divider = {
  borderTop: '1px solid #E5E7EB',
  marginBottom: '40px',
  width: '100%',
};

const contentContainer = {
  backgroundColor: '#FFF',
  width: '90%',
  maxWidth: '900px',
  padding: '20px',
  borderRadius: '10px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  marginBottom: '20px',
};

const boardContainer = {
  width: '100%',
  padding: '20px',
  backgroundColor: '#FAFAFA',
  borderRadius: '8px',
  border: '1px solid #E5E7EB',
};

const imageContainer = {
  marginBottom: '15px',
};

const imageStyle = {
  maxWidth: '100%',
  maxHeight: '400px',
  borderRadius: '10px',
  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
  objectFit: 'cover',
};

const boardInfoContainer = {
  padding: '10px 20px',
  backgroundColor: '#FAFAFA',
  borderRadius: '8px',
  marginBottom: '20px',
};

const infoContainer = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontSize: '14px',
  color: '#666',
};

const authorContainer = {
  display: 'flex',
  alignItems: 'center',
};

const author = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#222',
};

const date = {
  fontSize: '14px',
  color: '#888',
};

const postContentContainer = {
  backgroundColor: '#FAFAFA',
  padding: '20px',
  borderRadius: '8px',
  fontSize: '16px',
  color: '#333',
};

const interactionContainer = {
  display: 'flex',
  gap: '15px',
  alignItems: 'center',
  marginTop: '15px',
};

const commentStyle = {
  display: 'flex',
  flexDirection: 'column',
  padding: '15px 20px',
  marginBottom: '15px',
  backgroundColor: '#FFFFFF',
  borderRadius: '8px',
  border: '1px solid #E5E7EB',
  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
};

const replyStyle = {
  ...commentStyle,
  marginLeft: '40px', // 대댓글 들여쓰기
  backgroundColor: '#F9FAFB', // 대댓글 배경색
};

const commentItem = {
  display: 'flex',
  flexDirection: 'column',
  padding: '10px',
  borderRadius: '8px',
};

const commentContent = {
  marginBottom: '10px',
  fontSize: '14px',
  color: '#333',
};

const commentAuthor = {
  fontWeight: 'bold',
  fontSize: '14px',
  marginBottom: '5px',
  color: '#111',
};

const commentDate = {
  fontSize: '12px',
  color: '#888',
};

const commentText = {
  marginTop: '5px',
  color: '#333',
  lineHeight: '1.6',
};

const commentInputContainer = {
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  marginTop: '20px',
};

const commentInput = {
  flex: 1,
  padding: '8px',
  fontSize: '14px',
  borderRadius: '6px',
  border: '1px solid #E5E7EB',
  marginRight: '8px',
};

const smallButton = {
  backgroundColor: '#4CAF50',
  color: '#fff',
  border: 'none',
  padding: '8px 12px',
  borderRadius: '5px',
  fontSize: '12px',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease',
};

const myCommentStyle = {
  backgroundColor: '#F0F4FF',
  border: '1px solid #C1D3FF',
};

export default PostDetail;