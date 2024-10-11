import React, { useState } from 'react';
import Swal from 'sweetalert2'; 

const CreatePost = () => {
  const [images, setImages] = useState([]);
  const maxFileSize = 5 * 1024 * 1024; // 5MB

  const handleImageAdd = (event) => {
    const selectedFiles = Array.from(event.target.files);
    
    const oversizedFiles = selectedFiles.filter((file) => file.size > maxFileSize);
    if (oversizedFiles.length > 0) {
      alert("파일의 크기가 5MB를 넘었습니다.");
    }

    const validFiles = selectedFiles
      .filter((file) => file.size <= maxFileSize)
      .slice(0, 3 - images.length); // 최대 3개까지 허용
    
    const newImages = validFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setImages([...images, ...newImages]);
  };

  const handleImageRemove = (index) => {
    URL.revokeObjectURL(images[index].url); // URL 해제
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <div style={container}>
      <h2 style={titleContainer}>
        <span style={mainTitle}>면접 질문 게시판</span>
        <span style={{ margin: '0 5px -6px', fontSize: '18px'}}>|</span>
        <span style={subTitle}>게시글 작성</span>
      </h2>
      <hr style={{ ...divider, width: '900px' }} />
      <div style={contentContainer}>
        <div style={boardContainer}>
          {/* 제목 입력 */}
          <input type="text" placeholder="제목" style={titleInput} />

          {/* 내용 입력 */}
          <textarea placeholder="내용" style={contentInput}></textarea>

          {/* 이미지 추가 */}
          <div style={imageSection}>
            <input
              id="imageInput"
              type="file"
              accept="image/*"
              multiple
              style={fileInput}
              onChange={handleImageAdd}
            />
            <button
              onClick={() => document.getElementById('imageInput').click()}
              style={imageAddButton}
            >
              이미지 추가 ➕
            </button>
            <div style={imageList}>
              {images.map((image, index) => (
                <div key={index} style={imageContainer}>
                  <img
                    src={image.url}
                    alt={`Preview ${index + 1}`}
                    style={imagePlaceholder}
                  />
                  <button
                    onClick={() => handleImageRemove(index)}
                    style={removeButton}
                  >
                    ❌
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
          {/* 작성하기 버튼 */}
          <button style={submitButton}>작성하기</button>
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

const titleInput = {
  width: '100%',
  maxWidth: '800px',
  padding: '10px',
  fontSize: '16px',
  border: '1px solid #ccc',
  borderRadius: '4px',
  marginBottom: '20px',
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
};

const contentInput = {
  width: '100%',
  maxWidth: '800px',
  height: '200px',
  padding: '10px',
  fontSize: '16px',
  border: '1px solid #ccc',
  borderRadius: '4px',
  marginBottom: '20px',
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
};

const imageSection = {
  width: '100%',
  maxWidth: '800px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  marginBottom: '20px',
};

const imageAddButton = {
  marginBottom: '10px',
  fontSize: '14px',
  border: '1px solid #ccc',
  borderRadius: '4px',
  padding: '5px 10px',
  backgroundColor: '#E0EBF5',
  cursor: 'pointer',
};

const fileInput = {
  display: 'none',
};

const imageList = {
  display: 'flex',
  gap: '10px',
};

const imageContainer = {
  position: 'relative',
};

const imagePlaceholder = {
  width: '80px',
  height: '80px',
  objectFit: 'cover',
  borderRadius: '4px',
};

const removeButton = {
  position: 'absolute',
  top: '-5px',
  right: '-5px',
  fontSize: '12px',
  border: 'none',
  backgroundColor: 'transparent',
  cursor: 'pointer',
};

const submitButton = {
  fontSize: '14px',
  border: '1px solid #ccc',
  borderRadius: '20px',
  padding: '8px 16px',
  backgroundColor: '#fff',
  marginTop: '20px',
  cursor: 'pointer',
};

export default CreatePost;
