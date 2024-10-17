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
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h2 style={titleStyle}>게시글 수정</h2>
      </div>
      <form onSubmit={handleSubmit} style={formStyle}>
        <div style={formGroupStyle}>
          <label style={labelStyle}>제목</label>
          <input
            type="text"
            name="title"
            value={post.title}
            onChange={handleInputChange}
            style={inputStyle}
          />
        </div>
        <div style={formGroupStyle}>
          <label style={labelStyle}>내용</label>
          <textarea
            name="content"
            value={post.content}
            onChange={handleInputChange}
            style={textareaStyle}
          />
        </div>
        <div style={formGroupStyle}>
          <label style={labelStyle}>이미지 미리보기</label>
          <div style={imageContainerStyle}>
            {post.imageUrls.map((imageUrl, index) => (
              <div key={index} style={imageItemStyle}>
                <img src={imageUrl} alt={`이미지 ${index + 1}`} style={imageStyle} />
                <button type="button" onClick={() => handleDeleteImage(imageUrl, index, false)} style={deleteButtonStyle}>삭제</button>
              </div>
            ))}
            {imagePreviews.map((imageUrl, index) => (
              <div key={index} style={imageItemStyle}>
                <img src={imageUrl} alt={`새 이미지 ${index + 1}`} style={imageStyle} />
                <button type="button" onClick={() => handleDeleteImage(imageUrl, index, true)} style={deleteButtonStyle}>삭제</button>
              </div>
            ))}
          </div>
        </div>
        <div style={formGroupStyle}>
          <label htmlFor="file-input" style={fileInputLabelStyle}>새 이미지 추가</label>
          <input type="file" id="file-input" multiple onChange={handleFileChange} style={{ display: 'none' }} />
        </div>
        <button type="submit" style={submitButtonStyle}>수정 완료</button>
      </form>
    </div>
  );
};

// 스타일 정의
const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '30px',
  backgroundColor: '#ffffff',
  maxWidth: '700px',
  margin: '40px auto',
  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
  borderRadius: '15px',
};

const headerStyle = {
  width: '100%',
  marginBottom: '20px',
  textAlign: 'center',
  borderBottom: '2px solid #f0f0f0',
  paddingBottom: '15px',
};

const titleStyle = {
  fontSize: '24px',
  color: '#333',
  fontWeight: '600',
};

const formStyle = {
  width: '100%',
};

const formGroupStyle = {
  marginBottom: '20px',
};

const labelStyle = {
  display: 'block',
  fontSize: '14px',
  fontWeight: '500',
  color: '#666',
  marginBottom: '8px',
};

const inputStyle = {
  width: '100%',
  padding: '12px',
  fontSize: '14px',
  borderRadius: '10px',
  border: '1px solid #ddd',
  boxSizing: 'border-box',
};

const textareaStyle = {
  width: '100%',
  height: '120px',
  padding: '12px',
  fontSize: '14px',
  borderRadius: '10px',
  border: '1px solid #ddd',
  boxSizing: 'border-box',
};

const imageContainerStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '10px',
};

const imageItemStyle = {
  position: 'relative',
};

const imageStyle = {
  width: '100px',
  height: '100px',
  objectFit: 'cover',
  borderRadius: '8px',
  border: '1px solid #ccc',
};

const deleteButtonStyle = {
  position: 'absolute',
  top: '5px',
  right: '5px',
  backgroundColor: '#FF6347',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  padding: '4px',
  fontSize: '10px',
};

const fileInputLabelStyle = {
  padding: '10px 20px',
  backgroundColor: '#006AC1',
  color: '#fff',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '500',
  transition: 'background-color 0.3s',
};

const submitButtonStyle = {
  padding: '12px 24px',
  backgroundColor: '#006AC1',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '16px',
  fontWeight: '500',
  transition: 'background-color 0.3s',
  marginTop: '20px',
  alignSelf: 'center',
};

export default EditBoardPage;
