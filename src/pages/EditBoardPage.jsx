import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditBoardPage = () => {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState({
    title: '',
    content: '',
    imageUrls: [], // 기존 이미지 URL 저장
  });
  const [newImages, setNewImages] = useState([]); // 새로 추가된 이미지 파일 저장
  const [deleteImages, setDeleteImages] = useState([]); // 삭제할 이미지 URL 저장
  const [imagePreviews, setImagePreviews] = useState([]); // 새로 추가된 이미지 미리보기 URL 저장
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 게시물 데이터를 가져옴
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

  // 제목 및 내용 변경 핸들러
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPost({
      ...post,
      [name]: value,
    });
  };

  // 이미지 파일 변경 핸들러
  const handleFileChange = (e) => {
    const filesArray = Array.from(e.target.files);
    const previewUrls = filesArray.map(file => URL.createObjectURL(file));

    setNewImages((prevImages) => [...prevImages, ...filesArray]); // 기존 이미지에 추가된 이미지를 추가
    setImagePreviews((prevPreviews) => [...prevPreviews, ...previewUrls]); // 미리보기 URL 추가
  };

  // 이미지 삭제 핸들러
  const handleDeleteImage = (imageUrl, index, isPreview) => {
    if (isPreview) {
      // 새로 추가한 이미지 삭제
      setImagePreviews(imagePreviews.filter((_, idx) => idx !== index));
      setNewImages(newImages.filter((_, idx) => idx !== index));
    } else {
      // 기존 이미지 삭제
      setDeleteImages([...deleteImages, imageUrl]);
      setPost({
        ...post,
        imageUrls: post.imageUrls.filter((_, idx) => idx !== index),
      });
    }
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', post.title);
    formData.append('content', post.content);

    // 새 이미지 추가
    newImages.forEach((file) => {
      formData.append('newImages', file);
    });

    // 삭제할 이미지 URL 추가
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
      navigate(`/board/${boardId}`); // 수정 후 상세 페이지로 이동
    } catch (err) {
      setError('게시글 수정 중 오류가 발생했습니다.');
    }
  };

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={container}>
      <h2>게시글 수정</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>제목</label>
          <input
            type="text"
            name="title"
            value={post.title}
            onChange={handleInputChange}
            style={inputStyle}
          />
        </div>
        <div>
          <label>내용</label>
          <textarea
            name="content"
            value={post.content}
            onChange={handleInputChange}
            style={textareaStyle}
          />
        </div>
        <div>
          <label>기존 이미지 및 새 이미지 미리보기</label>
          <div style={imageContainer}>
            {/* 기존 이미지 미리보기 */}
            {post.imageUrls.map((imageUrl, index) => (
              <div key={index} style={imageItemStyle}>
                <img src={imageUrl} alt={`이미지 ${index + 1}`} style={imageStyle} />
                <button type="button" onClick={() => handleDeleteImage(imageUrl, index, false)}>삭제</button>
              </div>
            ))}
            {/* 새로 추가된 이미지 미리보기 */}
            {imagePreviews.map((imageUrl, index) => (
              <div key={index} style={imageItemStyle}>
                <img src={imageUrl} alt={`새 이미지 ${index + 1}`} style={imageStyle} />
                <button type="button" onClick={() => handleDeleteImage(imageUrl, index, true)}>삭제</button>
              </div>
            ))}
          </div>
        </div>
        <div>
          <label>새 이미지 추가</label>
          <input type="file" multiple onChange={handleFileChange} style={inputStyle} />
        </div>
        <button type="submit" style={buttonStyle}>수정 완료</button>
      </form>
    </div>
  );
};

// 스타일 정의
const container = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  margin: '10px 0',
};

const textareaStyle = {
  width: '100%',
  height: '200px',
  padding: '10px',
  margin: '10px 0',
};

const imageContainer = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '10px',
};

const imageItemStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const imageStyle = {
  maxWidth: '200px',
  maxHeight: '200px',
  borderRadius: '8px',
  marginBottom: '10px',
};

const buttonStyle = {
  padding: '10px 20px',
  backgroundColor: '#4CAF50',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  marginTop: '20px',
};

export default EditBoardPage;
