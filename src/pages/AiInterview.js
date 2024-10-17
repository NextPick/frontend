import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHeaderMode } from '../hooks/HeaderManager';
import { useNavigate, useLocation } from 'react-router-dom';
import Font from '../components/Font';
import styled from 'styled-components';
import AiCoach from '../assets/AiCoach.png';
import mic from '../assets/mic.png';
import micOn from '../assets/mic_on.png';
import { ReactMediaRecorder } from 'react-media-recorder';

const AiInterview = () => {
    const { setHeaderMode } = useHeaderMode();
    const location = useLocation();
    const { selectedCategory, selectedSubcategory } = location.state || {};
    const navigate = useNavigate();
    const [userResponse, setUserResponse] = useState('');
    const [exampleQuestion, setExampleQuestion] = useState('질문을 고르고 있습니다... 잠시만 기다려주세요');
    const [questionListId, setQuestionListId] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [mediaBlobUrl, setMediaBlobUrl] = useState(null);

    const uploadRecordedAudio = async () => {
        if (!mediaBlobUrl) {
            alert('녹음된 파일이 없습니다.');
            return;
        }
        try {
            const response = await fetch(mediaBlobUrl);
            const webmBlob = await response.blob();
            let formData = new FormData();
            formData.append('uploadFile', webmBlob, 'audio.webm');
            const res = await axios.post(`${process.env.REACT_APP_API_URL}fileUpload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('녹음 파일 업로드 성공');
            setUserResponse(res.data); 
        } catch (error) {
            console.error('업로드 오류:', error);
            alert('에러가 발생했습니다: ' + error.message);
        }
    };

    const changeSubcategoryToCategoryId = (e) => {
        if(e >= 1 && e <= 29) return e;
        switch(e){
            case 'Java': return 1;
            case 'Spring': return 2;
            case 'Node.js': return 3;
            case 'Express.js': return 4;
            case 'Django': return 5;
            case 'Flask': return 6;
            case 'Ruby': return 7;
            case 'PHP': return 8;
            case 'GraphQL': return 9;
            case 'MySQL': return 10;
            case 'Networking': return 11;
            case 'OS': return 12;
            case 'Data Structure': return 13;
            case 'Algorithms': return 14;
            case 'Software Engineering': return 15;
            case 'Design Patterns': return 16;
            case 'Computer Architecture': return 17;
            case 'Cybersecurity': return 18;
            case 'Artificial Intelligence': return 19;
            case 'React': return 20;
            case 'Vue': return 21;
            case 'Angular': return 22;
            case 'HTML5': return 23;
            case 'CSS3': return 24;
            case 'JavaScript (ES6+)': return 25;
            case 'TypeScript': return 26;
            case 'SASS/SCSS': return 27;
            case 'Webpack': return 28;
            case 'Responsive Web Design': return 29;
            default: return -1;
        }
    };

    useEffect(() => {
        if (mediaBlobUrl) uploadRecordedAudio();
    }, [mediaBlobUrl]);

    useEffect(() => setHeaderMode('main'), [setHeaderMode]);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}questions`, {
            params: {
                size: 1,
                page: 1,
                type: 'rand',
                sort: 'recent',
                category: changeSubcategoryToCategoryId(selectedSubcategory),
                keyword: ''
            }
        })
        .then(response => {
            const questionData = response.data.data;
            if (questionData && questionData.length > 0) {
                setExampleQuestion(questionData[0].question);
                setQuestionListId(questionData[0].questionListId);
            }
        })
        .catch(error => console.error('예시 질문 가져오기 오류:', error));
    }, [selectedSubcategory]);

    const toggleRecording = (startRecording, stopRecording) => {
        if (isRecording) stopRecording();
        else startRecording();
        setIsRecording(!isRecording);
    };

    const handleInputChange = (event) => setUserResponse(event.target.value);

    const handleSubmit = async () => {
        const accessToken = localStorage.getItem('accessToken');
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}questions/${questionListId}/score`,
                { answer: userResponse },
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );
            let correct = response.data.data.result === true;
            localStorage.setItem('solveQuestion', localStorage.getItem('solveQuestion') ? 
                `${localStorage.getItem('solveQuestion')}/${response.data.data.solvesId}` : response.data.data.solvesId);
            
            navigate('/resultcheck', {
                state: {
                    questionListId,
                    userResponse,
                    selectedSubcategory,
                    correct,
                },
            });
        } catch (error) {
            console.error('답변 제출 오류:', error);
            alert('답변 제출 중 오류가 발생했습니다.');
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <OutlineContainer>
                <Font font="PretendardB" size="27px" color="#000000" margintop="30px" spacing="2px" paddingleft="13px" paddingtop="5px" marginbottom="8px">
                    AI코치가 묻는 질문에 대답해주세요
                </Font>

                <Container>
                    <img src={AiCoach} alt="Ai" style={{ width: '360px',  marginLeft: "20px" }} />
                    <ChatContainer>
                        <ChatBubble align="left">
                            <Font font="Pretendard" size="18px" color="#000000">
                                {exampleQuestion}
                            </Font>
                        </ChatBubble>
                        <ChatBubble align="right">
                            <TextareaField 
                                value={userResponse} 
                                onChange={handleInputChange}
                                placeholder="대답을 입력하세요..."
                            />
                        </ChatBubble>
                    </ChatContainer>
                </Container>

                <BottomContainer>
                    <ReactMediaRecorder
                        audio
                        onStop={(blobUrl) => setMediaBlobUrl(blobUrl)}
                        render={({ startRecording, stopRecording }) => (
                            <MicrophoneContainer>
                                <Font font="Pretendard" size="20px" color="#AAA" margintop="5px" spacing="2px" paddingright="20px" paddingtop="5px" marginbottom="8px">
                                    {isRecording ? "녹음 중..." : "마이크를 눌러 대답을 시작하세요"}
                                </Font>
                                <MicButton onClick={() => toggleRecording(startRecording, stopRecording)} isRecording={isRecording} />
                            </MicrophoneContainer>
                        )}
                    />
                    <Button
                        style={{ marginLeft: '50px', marginRight: '40px'}}
                        onClick={handleSubmit}
                    >
                        제출하기
                    </Button>
                </BottomContainer>
            </OutlineContainer>
        </div>
    );
};

// Components
const MicButton = ({ onClick, isRecording }) => (
    <MicWrapper onClick={onClick}>
        <MicImage src={mic} alt="Mic" isRecording={!isRecording} />
        <MicImage src={micOn} alt="Mic On" isRecording={isRecording} />
    </MicWrapper>
);

const MicWrapper = styled.div`
    position: relative;
    width: 35px;
    height: 40px;
    cursor: pointer;
`;

const MicImage = styled.img`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 20px;
    transition: opacity 0.3s ease;
    opacity: ${({ isRecording }) => (isRecording ? 1 : 0)};
`;

// Styled Components
const Button = styled.div`
    width: auto;
    height: 50px;
    font-size: 20px;
    border-radius: 15px;
    color: #000;
    font-family: 'Pretendard', sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: color 0.3s ease, font-weight 0.3s ease;
    &:hover {
        color: #006AC1;
        font-weight: bold;
    }
`;

const OutlineContainer = styled.div`
    position: relative;
    height: 80vh;
    width: 70vw;
    margin-top: 30px;
    border: 2px solid #EEE;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 4px;
    border-radius: 10px;
    padding: 20px 40px;
    min-width: 1000px;
`;

const Container = styled.div`
    display: flex;
    align-items: flex-start;
    margin-top: 90px;
    gap: 20px;
`;

const ChatContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const ChatBubble = styled.div`
    background-color: rgb(248, 249, 250);
    box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 4px;
    border-radius: 15px;
    padding: 10px 15px;
    width: 50vw;
    max-width: 40vw;
    height: 20vh;
    position: relative;
    overflow-y: auto;
    overflow-x: hidden;
    margin-left: ${({ align }) => (align === 'left' ? '-50px' : '50px')};
    margin-${({ align }) => (align === 'left' ? 'bottom' : 'top')}: 20px;
    &::after {
        content: '';
        position: absolute;
        top: 50%;
        ${({ align }) => (align === 'left' ? 'left: -16px;' : 'right: -16px;')}
        border-${({ align }) => (align === 'left' ? 'right' : 'left')}: 16px solid #ffffff;
        border-top: 10px solid transparent;
        border-bottom: 10px solid transparent;
        transform: translateY(-50%);
    }
`;

const BottomContainer = styled.div`
  position: absolute;
  right: 20px;
  bottom: 20px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: auto;
`;

const MicrophoneContainer = styled.div`
  display: flex;
  align-items: center;
`;

const TextareaField = styled.textarea`
    width: 100%;
    height: 100%;
    border: none;
    outline: none;
    background-color: rgb(248, 249, 250);
    font-family: 'PretendardM', sans-serif;
    font-size: 18px;
    padding: 10px;
    border-radius: 15px;
    resize: none;
    overflow-y: auto;
`;

export default AiInterview;
