// import React from 'react'; // React 라이브러리를 import합니다.
// import '../styles/board.css'; // 보드 컴포넌트의 스타일 시트를 import합니다.
// import '../styles/global.css'; // 전역 스타일 시트를 import합니다.
// import { Link } from 'react-router-dom'; // React Router의 Link 컴포넌트를 import하여 페이지 간 내비게이션을 가능하게 합니다.

// // 컴포넌트가 받을 props 정의
// const BoradList = ({ contentData }) => {  
//     const number = contentData.noteId; // dreamId를 number 변수에 저장합니다.
//     const content = contentData.content; // 게시물 내용을 content 변수에 저장합니다.
//     const createdAt = new Date(contentData.createdAt); // 작성일시를 Date 객체로 변환하여 createdAt 변수에 저장합니다.
//     const urn = '/board/' + number; // 게시물 상세 페이지로 이동할 경로를 urn 변수에 저장합니다.

//     // 날짜 형식을 포맷하는 함수
//     const formatDate = (date) => {
//         const now = new Date(); // 현재 날짜 및 시간 객체 생성
//         const diff = now.getTime() - date.getTime(); // 현재 시간과 게시물 작성 시간의 차이를 밀리초로 계산
//         const diffHours = Math.floor(diff / (1000 * 60 * 60)); // 차이를 시간 단위로 변환
//         const diffMinutes = Math.floor(diff / (1000 * 60)); // 차이를 분 단위로 변환

//         // 게시물 작성 후 경과 시간에 따라 다르게 출력
//         if (diffHours < 24) {
//             if (diffHours >= 1) {
//                 return `${diffHours}시간 전`; // 1시간 이상 경과 시 "X시간 전" 표시
//             } else if (diffMinutes >= 1) {
//                 return `${diffMinutes}분 전`; // 1분 이상 경과 시 "X분 전" 표시
//             } else {
//                 return `방금 전`; // 1분 미만일 경우 "방금 전" 표시
//             }
//         } else {
//             const month = date.getMonth() + 1; // 월을 가져오기 (0부터 시작하므로 1 더함)
//             const day = date.getDate(); // 일을 가져오기
//             return `${month}.${day}`; // "MM.DD" 형식으로 날짜 표시
//         }
//     };

//     return (
//         <div id='board-list-container' className='font-normal'> 
//             <div className='board-no'>{number}</div> {/* 게시물 번호 출력 */}
//             <Link
//                 to={urn} // 클릭 시 게시물 상세 페이지로 이동
//                 style={{ textDecoration: 'none', color: 'black' }} // 링크 스타일 설정
//             >
//                 <div
//                     className='board-content font-extrabold font-size-17 order-left'
//                 >
//                     {content} {/* 게시물 내용 출력 */}
//                 </div>
//             </Link>
//             <div className='board-created'>{formatDate(createdAt)}</div> {/* 작성일시 출력 */}
//             {/* API에서 받은 데이터를 map으로 처리할 부분 */}
//         </div>
//     );
// }

// export default BoradList; // 컴포넌트를 export하여 다른 파일에서 사용할 수 있도록 합니다.
