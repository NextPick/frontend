import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Font from '../components/Font';

const QuestionBoardPost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [images, setImages] = useState([]); 
  const maxFileSize = 5 * 1024 * 1024; // 5MB
  const navigate = useNavigate();

  // 이미지 추가
// 이미지 추가
// const handleImageAdd = (event) => {
//   const selectedFiles = Array.from(event.target.files);
//   const oversizedFiles = selectedFiles.filter((file) => file.size > maxFileSize);
  
//   if (oversizedFiles.length > 0) {
//     alert("파일의 크기가 5MB를 넘었습니다.");
//   }

//   const validFiles = selectedFiles.filter((file) => file.size <= maxFileSize);

//   const newImages = validFiles.map((file) => ({
//     file,
//     url: URL.createObjectURL(file),
//   }));

//   setImages([...images, ...newImages]);
// };

// 이미지 추가 (파일 크기 제한 제거)
const handleImageAdd = (event) => {
  const selectedFiles = Array.from(event.target.files);

  const newImages = selectedFiles.map((file) => ({
    file,
    url: URL.createObjectURL(file),
  }));

  setImages([...images, ...newImages]);
};



  // 이미지 제거
  const handleImageRemove = (index) => {
    URL.revokeObjectURL(images[index].url); // URL 해제
    setImages(images.filter((_, i) => i !== index));
  };

  // 게시글 작성
  const handleSubmitPost = () => {
    if (!category) {
      Swal.fire("카테고리 선택해주세요", "", "warning");
      return;
    }

    const formData = new FormData();
    formData.append("boardCategory", category);  // 카테고리 추가
    
    images.forEach((image) => {
      formData.append("images", image.file);
    });
  
    formData.append("title", title);
    formData.append("content", content);

    fetch(process.env.REACT_APP_API_URL + "boards/Q", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
      body: formData,
    })
    .then((response) => response.json()) // 응답을 JSON으로 파싱
    .then((data) => {
      console.log("응답 데이터:", data);
      if (data && data.boardId) {
        Swal.fire("게시글이 성공적으로 등록되었습니다!");
        navigate(`/board/${data.boardId}`); // boardId를 이용해 상세 페이지로 리다이렉트
      } else {
        Swal.fire("오류 발생", "게시글 등록 중 문제가 발생했습니다.", "error");
      }
    })
    .catch((error) => {
      console.error("API 요청 실패:", error);
      Swal.fire("오류 발생", "API 요청 중 문제가 발생했습니다.", "error");
    });
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
          {/* 카테고리 선택 */}
          <select value={category} onChange={(e) => setCategory(e.target.value)} style={titleInput}>
            <option value="">카테고리 선택</option>
            <option value="BE">BE</option>
            <option value="FE">FE</option>
            <option value="CS">CS</option>
          </select>

          {/* 제목 입력 */}
          <input 
            type="text" 
            placeholder="제목" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={titleInput} 
          />

          {/* 내용 입력 */}
          <textarea 
            placeholder="내용"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={contentInput}
          ></textarea>

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
      <button style={submitButton} onClick={handleSubmitPost}>
        <Font
          font='PretendardL'
        >
        작성하기
        </Font>
      </button>
    </div>
  );
};

// 스타일 정의
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
  border: '1px solid #d5e7fc',
  borderRadius: '4px',
  padding: '5px 10px',
  backgroundColor: 'rgb(194 220 241)',
  cursor: 'pointer',
  color:'black'
};

const fileInput = {
  display: 'none',

};

// const imageList = {
//   display: 'flex',
//   gap: '10px',
// };

const imageContainer = {
  position: 'relative',
};

// const imagePlaceholder = {
//   width: '80px',
//   height: '80px',
//   objectFit: 'cover',
//   borderRadius: '4px',
// };

const removeButton = {
  position: 'absolute',
  top: '-5px',
  right: '-5px',
  fontSize: '12px',
  border: 'none',
  backgroundColor: 'transparent',
  cursor: 'pointer',
};

const imageList = {
  display: 'flex',
  flexWrap: 'wrap', // 이미지를 여러 줄에 걸쳐 보여줄 수 있도록 함
  gap: '10px',
  justifyContent: 'center',
};

const imagePlaceholder = {
  width: '150px', // 이미지를 일정 크기로 제한
  height: '150px', 
  objectFit: 'cover', // 이미지 비율 유지하면서 잘림 처리
  borderRadius: '4px',
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
};




const submitButton = {
  color: 'black',
  fontSize: '14px',
  border: '1px solid #ccc',
  padding: '8px 22px',
  backgroundColor: 'rgb(194 220 241)',
  marginTop: '20px',
  cursor: 'pointer',
  fontWeight: 'bold',

};

export default QuestionBoardPost;
