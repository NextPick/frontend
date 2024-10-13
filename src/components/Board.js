// import React, { useState } from 'react';
// import NoteBoard from '../components/NoteBoard'; // 모드 1 컴포넌트
// import BoardDetail from '../components/BoardDetail'; // 보드 세부 정보 컴포넌트

// const Board = () => {
//     // 보드 상태 관리
//     const [boards, setBoards] = useState([
//         { id: 1, mode: 'NoteBoard', title: '첫 번째 노트', content: '노트 내용 1' },
//         { id: 2, mode: 'NoteBoard', title: '두 번째 노트', content: '노트 내용 2' },
//         { id: 3, mode: 'NoteBoard', title: '세 번째 노트', content: '노트 내용 3' },
//     ]); // 초기 보드 목록
//     const [selectedBoard, setSelectedBoard] = useState(null); // 선택된 보드 상태
//     const [boardMode, setBoardMode] = useState('NoteBoard'); // 선택된 보드 모드 상태

//     // 보드 클릭 이벤트 처리
//     const handleBoardClick = (boardId) => {
//         setSelectedBoard(boards.find(board => board.id === boardId)); // 선택된 보드 상태 업데이트
//     };

//     // 보드 모드 변경 이벤트 처리
//     const handleModeChange = (mode) => {
//         setBoardMode(mode); // 선택된 보드 모드 상태 업데이트
//     };

//     // 선택된 보드 모드에 맞는 보드 리스트 필터링
//     const filteredBoards = boards.filter(board => board.mode === boardMode);

//     return (
//         <div>
//             <h1>Board List</h1>
//             {/* 보드 모드 선택 버튼 */}
//             <div className="board-mode-select">
//                 <button onClick={() => handleModeChange('NoteBoard')}>NoteBoard</button>
//             </div>

//             {/* 선택된 보드 모드에 따른 콘텐츠 렌더링 */}
//             <div>
//                 {boardMode === 'NoteBoard' && (
//                     <NoteBoard boards={filteredBoards} onBoardClick={handleBoardClick} />
//                 )}
//             </div>

//             {/* 선택된 보드의 내용 표시 */}
//             {selectedBoard && <BoardDetail board={selectedBoard} />}
//         </div>
//     );
// };

// export default Board;
