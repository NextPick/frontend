import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditBoardPage = () => {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState({
    title: '',
    content: '',
    imageUrls: [],
  });
  const [newImages, setNewImages] = useState([]);
  const [deleteImages, setDeleteImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(process.env.REACT_APP_API_URL + `boards/${boardId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        setPost(response.data);
        setLoading(false);
      } catch (err) {
        setError('게시글 정보를 불러오는 중 오류가 발생했습니다.');
      }
    };

    fetchPost();
  }, [boardId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPost({
      ...post,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const filesArray = Array.from(e.target.files);
    const previewUrls = filesArray.map(file => URL.createObjectURL(file));

    setNewImages((prevImages) => [...prevImages, ...filesArray]);
    setImagePreviews((prevPreviews) => [...prevPreviews, ...previewUrls]);
  };

  const handleDeleteImage = (imageUrl, index, isPreview) => {
    if (isPreview) {
      setImagePreviews(imagePreviews.filter((_, idx) => idx !== index));
      setNewImages(newImages.filter((_, idx) => idx !== index));
    } else {
      setDeleteImages([...deleteImages, imageUrl]);
      setPost({
        ...post,
        imageUrls: post.imageUrls.filter((_, idx) => idx !== index),
      });
    }
  };

  const handleDeletePost = async () => {
    try {
      await axios.delete(`http://localhost:8080/boards/${boardId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      const redirectPath = post.dtype === 'QuestionBoard' ? '/boards/questions' : '/boards/reviews';
      navigate(redirectPath);
    } catch (error) {
      setError('게시글 삭제 중 오류가 발생했습니다.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', post.title);
    formData.append('content', post.content);

    newImages.forEach((file) => {
      formData.append('newImages', file);
    });

    deleteImages.forEach((imageUrl) => {
      formData.append('imagesToDelete', imageUrl);
    });

    try {
      await axios.patch(process.env.REACT_APP_API_URL + `boards/${boardId}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate(`/board/${boardId}`);
    } catch (err) {
      setError('게시글 수정 중 오류가 발생했습니다.');
    }
  };

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={container}>
      <h2 style={titleStyle}>게시글 수정</h2>
      <form onSubmit={handleSubmit} style={formStyle}>
        <div style={formGroup}>
          <label style={labelStyle}>제목</label>
          <input
            type="text"
            name="title"
            value={post.title}
            onChange={handleInputChange}
            style={inputStyle}
          />
        </div>
        <div style={formGroup}>
          <label style={labelStyle}>내용</label>
          <textarea
            name="content"
            value={post.content}
            onChange={handleInputChange}
            style={textareaStyle}
          />
        </div>
        <div style={formGroup}>
          <label style={labelStyle}>기존 이미지 및 새 이미지 미리보기</label>
          <div style={imageContainer}>
            {post.imageUrls.map((imageUrl, index) => (
              <div key={index} style={imageItemStyle}>
                <img src={imageUrl} alt={`이미지 ${index + 1}`} style={imageStyle} />
                <button type="button" onClick={() => handleDeleteImage(imageUrl, index, false)} style={deleteImageButton}>삭제</button>
              </div>
            ))}
            {imagePreviews.map((imageUrl, index) => (
              <div key={index} style={imageItemStyle}>
                <img src={imageUrl} alt={`새 이미지 ${index + 1}`} style={imageStyle} />
                <button type="button" onClick={() => handleDeleteImage(imageUrl, index, true)} style={deleteImageButton}>삭제</button>
              </div>
            ))}
          </div>
        </div>
        <div style={formGroup}>
          <label style={labelStyle}>새 이미지 추가</label>
          <input type="file" id="file-input" multiple onChange={handleFileChange} style={{ display: 'none' }} />
          <label htmlFor="file-input" style={fileInputLabelStyle}>이미지 선택</label>
        </div>
        <button type="submit" style={buttonStyle}>수정 완료</button>
      </form>

      <button onClick={handleDeletePost} style={deleteButtonStyle}>게시글 삭제</button>
    </div>
  );
};

// 스타일 정의
const container = {
 
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '30px',
  backgroundColor: '#f5f7fa',
  maxWidth: '800px',
  margin: '0 auto',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  borderRadius: '10px',
};
const titleStyle = {
  marginTop: '0px',
  fontSize: '24px',
  color: '#006AC1',
  fontWeight: 'bold',
  marginBottom: '20px',
};

const formStyle = {
  width: '100%',
};

const formGroup = {
  marginBottom: '20px',
};

const labelStyle = {
  display: 'block',
  fontSize: '16px',
  fontWeight: '500',
  color: '#333',
  marginBottom: '10px',
};

const inputStyle = {
  width: '100%',
  padding: '12px',
  fontSize: '16px',
  borderRadius: '5px',
  border: '1px solid #ddd',
  marginBottom: '10px',
  boxSizing: 'border-box',
};

const textareaStyle = {
  width: '100%',
  height: '150px',
  padding: '12px',
  fontSize: '16px',
  borderRadius: '5px',
  border: '1px solid #ddd',
  boxSizing: 'border-box',
};

const imageContainer = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '15px',
  marginBottom: '20px',
};

const imageItemStyle = {
  position: 'relative',
};

const imageStyle = {
  width: '150px',
  height: '150px',
  objectFit: 'cover',
  borderRadius: '10px',
  border: '2px solid #ddd',
};

const deleteImageButton = {
  position: 'absolute',
  top: '5px',
  right: '5px',
  backgroundColor: '#FF6347',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  padding: '5px',
  fontSize: '12px',
};

const buttonStyle = {
  padding: '12px 30px',
  backgroundColor: '#006AC1',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '16px',
  fontWeight: 'bold',
  transition: 'background-color 0.3s',
};

const deleteButtonStyle = {
  ...buttonStyle,
  backgroundColor: '#FF6347',
  marginTop: '10px',
};

const fileInputLabelStyle = {
  padding: '10px 20px',
  backgroundColor: '#006AC1',
  color: '#fff',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '16px',
  textAlign: 'center',
  fontWeight: 'bold',
  display: 'inline-block',
  transition: 'background-color 0.3s',
};

export default EditBoardPage;
