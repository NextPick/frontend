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
        <div key={comment.boardCommentId} style={{ marginLeft: parentId ? '20px' : '0px', marginBottom: '20px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            marginBottom: '10px',
            padding: '15px',
            borderRadius: '8px',
            backgroundColor: '#F8F9FA',
            
            border: '1px solid #E0E0E0',
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#ccc',
              borderRadius: '50%',
              marginRight: '10px',
            }}></div>
            <div style={{ flex: 1, fontSize: '14px', color: '#333' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <span
                  style={currentUserNickname === comment.nickname ? {
                    color: '#006AC1',
                    fontWeight: 'bold',
                  } : {
                    fontWeight: 'bold',
                    fontSize: '14px',
                    color: '#333',
                  }}
                >
                  {comment.nickname}
                </span>
                <span style={{
                  fontSize: '12px',
                  color: '#888',
                  paddingRight: '5px'
                }}>
                  {new Date(comment.createdAt).toLocaleDateString()}

                  {currentUserNickname === comment.nickname && (
                    <span style={{ marginLeft: '10px' }}>
                      <button
                        style={{
                          backgroundColor: 'transparent', color: '#888', border: 'none', padding: '4px 8px', cursor: 'pointer', fontSize: '12px',
                          marginLeft: '5px',
                        }}
                        onClick={() => handleUpdateComment(comment.boardCommentId, prompt('댓글 수정', comment.content))}
                      >
                        수정
                      </button>
                      <button
                        style={{
                          backgroundColor: 'transparent', color: '#888', border: 'none', padding: '4px 8px', cursor: 'pointer', fontSize: '12px',
                        }}
                        onClick={() => handleDeleteComment(comment.boardCommentId)}
                      >
                        삭제
                      </button>
                    </span>
                  )}
                </span>
              </div>
              <p style={{ marginTop: '8px', fontSize: '14px', color: '#333' }}>{comment.content}</p>

              {!parentId && (
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px', marginBottom: '15px' }}>
                  <input
                    type="text"
                    placeholder="답글 달기"
                    value={newReply[comment.boardCommentId] || ''}
                    onChange={(e) => handleReplyChange(comment.boardCommentId, e.target.value)}
                    style={{
                      flex: 1,
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid #E0E0E0',
                      marginRight: '10px',
                      fontSize: '13px',
                    }}
                  />
                  <button
                    style={{
                      backgroundColor: '#006AC1', color: '#fff', border: 'none',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      marginLeft: '8px',
                    }}
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
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      backgroundColor: '#F0F2F5',
      padding: '20px',
      borderRadius: '10px',
      
    }}>
      <h2 style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        textAlign: 'center',
        marginBottom: '10px',
      }}>
        <span style={{
          fontWeight: 'bold',
          fontSize: '28px',
          color: '#333',
        }}>{post.title}</span>
      </h2>

      <hr style={{ borderTop: '1px solid #A0A0A0', marginBottom: '20px', width: '70%' }} />

      <div style={{
        justifyContent: 'center',
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        width: '65%',
        padding: '20px',
        
        borderRadius: '8px',
      }}>
        <div style={{ paddingTop: '15px', width: '100%' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '15px',
            borderBottom: '1px solid #E0E0E0',
            paddingBottom: '10px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{
                fontSize: '15px',
                fontWeight: 'bold',
                color: '#555',
              }}>작성자: {post.author}</span>
            </div>
            <span style={{
              fontSize: '13px',
              color: '#888',
            }}>작성일: {new Date(post.createdAt).toLocaleDateString()} | 조회수: {post.viewCount} | 수정일: {new Date(post.modifiedAt).toLocaleDateString()}
              {currentUserNickname === post.author && (
                <span style={{ marginLeft: '8px' }}>
                  <button onClick={handleEditPost} style={{
                    backgroundColor: 'transparent', color: '#006AC1', border: 'none', padding: '4px 8px', cursor: 'pointer', fontSize: '13px', marginRight: '5px',
                  }}>수정</button>
                  <button onClick={handleDeletePost} style={{
                    backgroundColor: 'transparent', color: '#FF6B6B', border: 'none', padding: '4px 8px',
                    cursor: 'pointer',
                    fontSize: '13px',
                  }}>삭제</button>
                </span>
              )}
            </span>
          </div>

          <div style={{
            padding: '20px',
            backgroundColor: '#FFF',
            marginBottom: '20px',
            borderRadius: '8px',
            border: '1px solid #E0E0E0',
            
          }}>
            <p style={{ fontSize: '15px', lineHeight: '1.5', color: '#333' }}>{post.content}</p>
          </div>

          <div style={{
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            overflow: 'hidden',
          }}>
            {post.imageUrls && post.imageUrls.length > 0 && (
              post.imageUrls.map((imageUrl, index) => (
                <img key={index} src={imageUrl} alt={`게시글 이미지 ${index + 1}`} style={{
                  width: '100%',
                  maxWidth: '800px',
                  maxHeight: '350px',
                  marginBottom: '15px',
                  borderRadius: '8px',
                  objectFit: 'contain',
                  
                }} />
              ))
            )}
          </div>

          {post.dtype === 'ReviewBoard' && post.boardCategory && (
            <p style={{ fontSize: '15px', color: '#555' }}>카테고리: {post.boardCategory}</p>
          )}

          <div style={{
            display: 'flex',
            gap: '10px',
            marginTop: '20px',
            alignItems: 'center',
            fontSize: '15px',
            fontWeight: 'bold',
            color: '#333',
            marginBottom: '30px'
          }}>
            <div onClick={handleLike} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <span role="img" aria-label="like" style={{ fontSize: '18px' }}>👍</span>
              <span style={{ marginLeft: '6px' }}>{likesCount}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span role="img" aria-label="comments" style={{ fontSize: '18px' }}>💬</span>
              <span style={{ marginLeft: '6px' }}>{comments.length}</span>
            </div>
          </div>

          {renderComments()}

          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginTop: '20px',
          }}>
            <input
              type="text"
              placeholder="댓글 작성"
              style={{
                flex: 1,
                padding: '15px',
                borderRadius: '8px',
                border: '1px solid #E0E0E0',
                marginRight: '10px',
                fontSize: '14px',
              }}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button style={{
              backgroundColor: '#006AC1',
              color: '#fff',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }} onClick={handleCommentSubmit}>댓글 달기</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
