import axios from 'axios';
import {useState} from "react";
import {useNavigate} from "react-router-dom";

const InterviewRoom = () => {
    let accessToken = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJVU0VSIl0sInVzZXJuYW1lIjoiMTIzQDEyMy5jb20iLCJzdWIiOiIxMjNAMTIzLmNvbSIsImV4cCI6MTcyODk2NzA1MywiaWF0IjoxNzI4NjA3MDUzfQ.tG6YiR6LJTLvqCa9_poNJb0LYIbQL-jIzsicKheagso"
    const [roomTitle, setRoomTitle] = useState('');
    const [roomOccupation, setRoomOccupation] = useState('');
    const navigate = useNavigate();

    const handlePostInterviewRoom = async () => {
        try {
            const response = await axios.post('https://localhost:8443/rooms',
                {
                    title: roomTitle,
                    occupation: roomOccupation,
            },
                {
                    headers: {
                        'Content-Type': 'application/json',
                         Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
        } catch (error) {
            alert("방 만드는 중 오류가 발생했습니다. 다시 시도해주세요.");

        }
    }

    return (
        <div>
            <input type="text" value={roomTitle}
                   onChange={(e) => setRoomTitle(e.target.value)} />
            <input type="text" value={roomOccupation}
                   onChange={(e) => setRoomOccupation(e.target.value)} />
            <button onClick={handlePostInterviewRoom}>방 만들기</button>
        </div>
    )
};

export default InterviewRoom;