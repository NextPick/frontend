import React, { useState } from 'react';

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
    <div style={styles.container}>
      {/* 제목 입력 */}
      <input type="text" placeholder="제목" style={styles.titleInput} />

      {/* 내용 입력 */}
      <textarea placeholder="내용" style={styles.contentInput}></textarea>

      {/* 이미지 추가 */}
      <div style={styles.imageSection}>
        <input
          id="imageInput"
          type="file"
          accept="image/*"
          multiple
          style={styles.fileInput}
          onChange={handleImageAdd}
        />
        <button
          onClick={() => document.getElementById('imageInput').click()}
          style={styles.imageAddButton}
        >
          이미지 추가 ➕
        </button>
        <div style={styles.imageList}>
          {images.map((image, index) => (
            <div key={index} style={styles.imageContainer}>
              <img
                src={image.url}
                alt={`Preview ${index + 1}`}
                style={styles.imagePlaceholder}
              />
              <button
                onClick={() => handleImageRemove(index)}
                style={styles.removeButton}
              >
                ❌
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 작성하기 버튼 */}
      <button style={styles.submitButton}>작성하기</button>
    </div>
  );
};

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
  titleInput: {
    width: '100%',
    maxWidth: '800px',
    padding: '10px',
    fontSize: '16px',
    border: '1px solid black',
    borderRadius: '4px',
    marginBottom: '20px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', 
  },
  contentInput: {
    width: '100%',
    maxWidth: '800px',
    height: '200px',
    padding: '10px',
    fontSize: '16px',
    border: '1px solid black',
    borderRadius: '4px',
    marginBottom: '20px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', 
  },
  imageSection: {
    width: '100%',
    maxWidth: '800px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: '20px',
  },
  imageAddButton: {
    marginBottom: '10px',
    fontSize: '14px',
    border: '1px solid black',
    borderRadius: '4px',
    padding: '5px 10px',
    backgroundColor: '#fff',
    cursor: 'pointer',
  },
  fileInput: {
    display: 'none',
  },
  imageList: {
    display: 'flex',
    gap: '10px',
  },
  imageContainer: {
    position: 'relative',
  },
  imagePlaceholder: {
    width: '80px',
    height: '80px',
    objectFit: 'cover',
    borderRadius: '4px',
  },
  removeButton: {
    position: 'absolute',
    top: '-5px',
    right: '-5px',
    fontSize: '12px',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
  },
  submitButton: {
    fontSize: '14px',
    border: '1px solid black',
    borderRadius: '20px',
    padding: '8px 16px',
    backgroundColor: '#fff',
    cursor: 'pointer',
  },
};

export default CreatePost;
