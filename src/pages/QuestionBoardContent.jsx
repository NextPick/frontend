import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PostDetail = () => {
  const { boardId } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [newReply, setNewReply] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likesCount, setLikesCount] = useState(0);
  const currentUserNickname = localStorage.getItem('nickname');
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

  const handleDeletePost = async () => {
    try {
      const boardType = post.dtype;
      await axios.delete(`http://localhost:8080/boards/${boardId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (boardType === 'ReviewBoard') {
        navigate('/board/review');
      } else if (boardType === 'QuestionBoard') {
        navigate('/board/question');
      }
    } catch (error) {
      console.error('게시글 삭제 중 오류 발생:', error);
    }
  };

  const handleEditPost = () => {
    navigate(`/board/edit/${boardId}`);
  };

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

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`http://localhost:8080/boards/${boardId}/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        }
      });
      fetchComments();
    } catch (error) {
      console.error('댓글 삭제 중 오류 발생:', error);
    }
  };

  const handleUpdateComment = async (commentId, updatedContent) => {
    try {
      await axios.patch(
        `http://localhost:8080/boards/${boardId}/comments/${commentId}`,
        { content: updatedContent },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          }
        }
      );
      fetchComments();
    } catch (error) {
      console.error('댓글 수정 중 오류 발생:', error);
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
      console.error('대댓글 작성 중 오류 발생:', error);
    }
  };

  const handleReplyChange = (parentCommentId, value) => {
    setNewReply({ ...newReply, [parentCommentId]: value });
  };

  const renderComments = (parentId = null) => {
    return comments
      .filter(comment => comment.parentCommentId === parentId)
      .map(comment => (
        <div key={comment.boardCommentId} style={{ marginLeft: parentId ? '40px' : '0px' }}>
          <div style={commentItem}>
            <div style={avatar}></div>
            <div style={commentContent}>
              <div style={commentHeader}>
                <span
                  style={currentUserNickname === comment.nickname ? currentUserNicknameStyle : commentAuthor}
                >
                  {comment.nickname}
                </span>
                <span style={commentDate}>
                  {new Date(comment.createdAt).toLocaleDateString()}

                  {currentUserNickname === comment.nickname && (
                    <span style={commentActions}>
                      <button
                        style={editButton}
                        onClick={() => handleUpdateComment(comment.boardCommentId, prompt('댓글 수정', comment.content))}
                      >
                        수정
                      </button>
                      <button
                        style={deleteButton}
                        onClick={() => handleDeleteComment(comment.boardCommentId)}
                      >
                        삭제
                      </button>
                    </span>
                  )}
                </span>
              </div>
              <p style={commentText}>{comment.content}</p>

              {!parentId && (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="text"
                    placeholder="답글 달기"
                    value={newReply[comment.boardCommentId] || ''}
                    onChange={(e) => handleReplyChange(comment.boardCommentId, e.target.value)}
                    style={replyInput}
                  />
                  <button
                    style={replyButton}
                    onClick={() => handleReplySubmit(comment.boardCommentId)}
                  >
                    답글 달기
                  </button>
                </div>
              )}

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
        <span style={mainTitle}>{post.title}</span>
        <span style={subTitle}>작성자: {post.author}</span>
      </h2>
      
      <hr style={{ ...divider, width: '1000px' }} />
      
      <div style={contentContainer}>
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

          <div style={imageContainer}>
            {post.imageUrls && post.imageUrls.length > 0 && (
              post.imageUrls.map((imageUrl, index) => (
                <img key={index} src={imageUrl} alt={`게시글 이미지 ${index + 1}`} style={imageStyle} />
              ))
            )}
          </div>

          {post.dtype === 'ReviewBoard' && post.boardCategory && (
            <p>카테고리: {post.boardCategory}</p>
          )}

          <div style={interactionContainer}>
            <span onClick={handleLike} style={{ cursor: 'pointer' }}>👍</span>
            <span>{likesCount}</span>
            <span>💬 {comments.length}</span>
          </div>

          {currentUserNickname === post.author && (
            <div style={{ marginTop: '20px', textAlign: 'left' }}>
              <button onClick={handleEditPost} style={commentButton}>
                수정
              </button>
              <button onClick={handleDeletePost} style={deleteButton}>
                삭제
              </button>
            </div>
          )}

          {renderComments()}

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
  );
};

// 스타일 정의
const container = {
  display: 'flex',
  flexDirection: 'column',
  marginTop: '5vh',
  alignItems: 'center',
  backgroundColor: '#F8F9FA',
  padding: '30px',
  borderRadius: '10px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
};

const currentUserNicknameStyle = {
  color: '#006AC1',
  fontWeight: 'bold',
};

const editButton = {
  backgroundColor: '#006AC1',
  color: '#fff',
  border: 'none',
  padding: '4px 8px',
  borderRadius: '3px',
  cursor: 'pointer',
  fontSize: '12px',
  marginLeft: '5px',
};

const replyButton = {
  backgroundColor: '#4CAF50',
  color: '#fff',
  border: 'none',
  padding: '6px 12px',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '12px',
  marginLeft: '10px',
};

const titleContainer = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '1000px',
};

const mainTitle = {
  fontWeight: 'bold',
  fontSize: '30px',
  color: '#333',
};

const subTitle = {
  fontSize: '18px',
  marginTop: '10px',
  color: '#888',
};

const divider = {
  borderTop: '1px solid #A0A0A0',
  marginBottom: '40px',
  width: '100%',
};

const contentContainer = {
  justifyContent: 'center',
  flexDirection: 'column',
  backgroundColor: '#FFF',
  alignItems: 'center',
  width: '1000px',
  padding: '30px',
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
  borderRadius: '10px',
};

const boardInfoContainer = {
  paddingTop: '20px',
  margin: '0 40px',
  padding: '10px',
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
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#333',
};

const date = {
  fontSize: '14px',
  color: '#888',
  marginTop: '5px',
};

const postContentContainer = {
  padding: '20px',
  backgroundColor: '#FFF',
  marginBottom: '20px',
  borderRadius: '8px',
  border: '1px solid #E0E0E0',
  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
};

const interactionContainer = {
  display: 'flex',
  gap: '15px',
  marginTop: '20px',
  alignItems: 'center',
};

const commentItem = {
  display: 'flex',
  alignItems: 'flex-start',
  marginBottom: '10px',
  padding: '15px',
  borderRadius: '8px',
  backgroundColor: '#F8F9FA',
  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
  border: '1px solid #E0E0E0',
};

const avatar = {
  width: '40px',
  height: '40px',
  backgroundColor: '#ccc',
  borderRadius: '50%',
  marginRight: '10px',
};

const commentContent = {
  flex: 1,
  fontSize: '14px',
  color: '#333',
};

const commentHeader = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const commentAuthor = {
  fontWeight: 'bold',
  fontSize: '14px',
  color: '#333',
};

const commentDate = {
  fontSize: '12px',
  color: '#888',
  paddingRight: '5px'
};

const commentActions = {
  marginLeft: '10px',
};

const commentText = {
  marginTop: '5px',
  fontSize: '14px',
  color: '#333',
};

const replyInput = {
  flex: 1,
  padding: '10px',
  borderRadius: '8px',
  border: '1px solid #E0E0E0',
  marginRight: '10px',
  fontSize: '14px',
};

const commentInputContainer = {
  display: 'flex',
  alignItems: 'center',
  marginTop: '20px',
};

const commentInput = {
  flex: 1,
  padding: '15px',
  borderRadius: '8px',
  border: '1px solid #E0E0E0',
  marginRight: '10px',
  fontSize: '14px',
};

const commentButton = {
  backgroundColor: '#006AC1',
  color: '#fff',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '5px',
  cursor: 'pointer',
  fontWeight: 'bold',
};

const deleteButton = {
  backgroundColor: '#FF6B6B',
  color: '#fff',
  border: 'none',
  padding: '4px 8px',
  borderRadius: '3px',
  cursor: 'pointer',
  fontSize: '12px',
};

const imageContainer = {
  marginBottom: '20px',
  display: 'flex',
  justifyContent: 'center',
  flexWrap: 'wrap',
  overflow: 'hidden',
};

const imageStyle = {
  width: '100%',
  maxWidth: '900px',
  maxHeight: '400px',
  marginBottom: '15px',
  borderRadius: '8px',
  objectFit: 'contain',
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
};

export default PostDetail;
