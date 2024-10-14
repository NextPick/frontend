import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHeaderMode } from '../hooks/HeaderManager';
import { useNavigate, useLocation } from 'react-router-dom';
import Box from '../components/Box';
import Font from '../components/Font';
import styled from 'styled-components';
import Button from '../components/Button';
import Ai코치 from '../assets/Ai코치.png';
import mic from '../assets/mic.png';
import { ReactMediaRecorder } from 'react-media-recorder';

const AiInterview = () => {
    const { setHeaderMode } = useHeaderMode();
    const location = useLocation();
    const { selectedCategory, selectedSubcategory } = location.state || {};
    const navigate = useNavigate();
    const [userResponse, setUserResponse] = useState('');
    const [exampleQuestion, setExampleQuestion] = useState('질문을 고르고 있습니다... 잠시만 기다려주세요');
    const [questionListId, setQuestionListId] = useState(null); // 질문 ID 상태 추가
    const [isRecording, setIsRecording] = useState(false);
    const [mediaBlobUrl, setMediaBlobUrl] = useState(null);
    const [resp, setResp] = useState('');

    // 녹음된 파일을 WAV로 변환하여 업로드
    const uploadRecordedAudio = async () => {
        console.log(selectedSubcategory)
        console.log(changeSubcategoryToCategoryId(selectedSubcategory))
        if (!mediaBlobUrl) {
            alert('녹음된 파일이 없습니다.');
            return;
        }
        try {
            const wavBlob = await convertWebmToWav(mediaBlobUrl);

            let formData = new FormData();
            formData.append('uploadFile', wavBlob, 'audio.wav');

            const res = await axios.post(process.env.REACT_APP_API_URL + 'fileUpload', formData);
            alert('녹음 파일 업로드 성공');
            setResp(res.data.text);
        } catch (error) {
            alert('에러가 발생했습니다: ' + error.message);
        }
    };

    const changeSubcategoryToCategoryId = (e) => {
        if(e >= 1 && e <= 29){
            return e;
        }
        switch(e){
            case 'Java': 
                return 1;
            case 'Spring': 
                return 2;
            case 'Node.js': 
                return 3;
            case 'Express.js': 
                return 4;
            case 'Django': 
                return 5;
            case 'Flask': 
                return 6;
            case 'Ruby': 
                return 7;
            case 'PHP': 
                return 8;
            case 'GraphQL': 
                return 9;
            case 'MySQL':
                return 10;
            case 'Networking': 
                return 11;
            case 'OS': 
                return 12;
            case 'Data Structure': 
                return 13;
            case 'Algorithms': 
                return 14;
            case 'Software Engineering': 
                return 15;
            case 'Design Patterns': 
                return 16;
            case 'Computer Architecture': 
                return 17;
            case 'Cybersecurity': 
                return 18;
            case 'Artificial Intelligence':
                return 19;
            case 'React': 
                return 20;
            case 'Vue': 
                return 21;
            case 'Angular': 
                return 22;
            case 'HTML5': 
                return 23;
            case 'CSS3': 
                return 24;
            case 'JavaScript (ES6+)': 
                return 25;
            case 'TypeScript': 
                return 26;
            case 'SASS/SCSS': 
                return 27;
            case 'Webpack': 
                return 28;
            case 'Responsive Web Design':
                return 29;
            default:
                return -1;
        }
    }

    // 녹음된 WebM 파일을 WAV로 변환
    const convertWebmToWav = (url) => {
        return new Promise((resolve, reject) => {
            fetch(url)
                .then(response => response.arrayBuffer())
                .then(arrayBuffer => {
                    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                    audioContext.decodeAudioData(arrayBuffer, (audioBuffer) => {
                        const wavBlob = audioBufferToWavBlob(audioBuffer);
                        resolve(wavBlob);
                    });
                })
                .catch(error => reject(error));
        });
    };

    // AudioBuffer를 WAV Blob으로 변환
    const audioBufferToWavBlob = (audioBuffer) => {
        const numberOfChannels = audioBuffer.numberOfChannels;
        const sampleRate = audioBuffer.sampleRate;
        const format = 1; // PCM
        const bitDepth = 16;

        let length = audioBuffer.length * numberOfChannels * 2 + 44;
        let buffer = new ArrayBuffer(length);
        let view = new DataView(buffer);

        // RIFF chunk descriptor
        writeString(view, 0, 'RIFF');
        view.setUint32(4, 36 + audioBuffer.length * numberOfChannels * 2, true);
        writeString(view, 8, 'WAVE');

        // FMT sub-chunk
        writeString(view, 12, 'fmt ');
        view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
        view.setUint16(20, format, true); // AudioFormat (1 for PCM)
        view.setUint16(22, numberOfChannels, true); // NumChannels
        view.setUint32(24, sampleRate, true); // SampleRate
        view.setUint32(28, sampleRate * numberOfChannels * bitDepth / 8, true); // ByteRate
        view.setUint16(32, numberOfChannels * bitDepth / 8, true); // BlockAlign
        view.setUint16(34, bitDepth, true); // BitsPerSample

        // Data sub-chunk
        writeString(view, 36, 'data');
        view.setUint32(40, audioBuffer.length * numberOfChannels * 2, true); // Subchunk2Size

        // Write PCM samples
        let offset = 44;
        for (let i = 0; i < audioBuffer.length; i++) {
            for (let channel = 0; channel < numberOfChannels; channel++) {
                let sample = audioBuffer.getChannelData(channel)[i];
                sample = Math.max(-1, Math.min(1, sample));
                view.setInt16(offset, sample * 0x7FFF, true);
                offset += 2;
            }
        }

        return new Blob([view], { type: 'audio/wav' });
    };

    const writeString = (view, offset, string) => {
        for (let i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    };

    useEffect(() => {
        if (mediaBlobUrl) {
            uploadRecordedAudio();
        }
    }, [mediaBlobUrl]);

    useEffect(() => {
        setHeaderMode('main');
    }, [setHeaderMode]);

    useEffect(() => {
        axios.get(process.env.REACT_APP_API_URL + 'questions', {
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
                setQuestionListId(questionData[0].questionListId); // 질문 ID 상태 설정
            }
        })
        .catch(error => {
            console.error('예시 질문 가져오기 오류:', error);
        });
    }, []);

    const toggleRecording = (startRecording, stopRecording) => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
        setIsRecording(!isRecording);
    };

    const handleInputChange = (event) => {
        setUserResponse(event.target.value);
    };

    const handleSubmit = () => {
        navigate('/resultcheck', {
            state: {
                questionListId: questionListId,
                userResponse: userResponse,
                selectedSubcategory: selectedSubcategory
            }
        });
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <Box height="90vh" width="70vw" border="none" alignItems="flex-start" justify="flex-start">
                <Font font="PretendardM" size="27px" color="#000000" margintop="5px" spacing="2px" paddingleft="13px" paddingtop="5px" marginbottom="8px">
                    AI코치가 묻는 질문에 마이크를 켜고 대답해주세요
                </Font>

                <Container>
                    <img src={Ai코치} alt="Ai" style={{ width: '360px', height: '400px', marginLeft: "20px" }} />
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginLeft: '10px' }}>
                        <QuestionBubble>
                            <Font font="PretendardM" size="18px" color="#000000">
                                {exampleQuestion}
                            </Font>
                        </QuestionBubble>
                        <ResponseBubble>
                            <InputField 
                                type="text" 
                                value={userResponse} 
                                onChange={handleInputChange}
                                placeholder={resp || "대답을 입력하세요..."}
                            />
                        </ResponseBubble>
                    </div>
                </Container>

                <ReactMediaRecorder
                    audio
                    onStop={(blobUrl) => {
                        setMediaBlobUrl(blobUrl);
                    }}
                    render={({ startRecording, stopRecording }) => (
                        <MicrophoneContainer>
                            <Button color="#FFFFFF" onClick={() => toggleRecording(startRecording, stopRecording)}>
                                <img src={mic} alt="Mic" style={{ width: '35px', height: '40px' }} />
                            </Button>
                            <Font font="PretendardM" size="15px" color="#000000" margintop="5px" spacing="2px" paddingleft="13px" paddingtop="5px" marginbottom="8px">
                                {isRecording ? "녹음 중..." : "마이크를 눌러 대답을 시작하세요"}
                            </Font>
                        </MicrophoneContainer>
                    )}
                />

                <Button
                    width="130px"
                    height="50px"
                    fontsize="27px"
                    radius="15px"
                    color="#f4fdff"
                    style={{ marginLeft: '10px' }}
                    onClick={handleSubmit} // 제출하기 버튼 클릭 시 handleSubmit 실행
                >
                    제출하기
                </Button>
            </Box>
        </div>
    );
};

// Styled-components 정의
const MicrophoneContainer = styled.div`
    display: flex;
    align-items: center;
    margin-top: 70px;
`;

const Container = styled.div`
    display: flex;
    align-items: flex-start;
    margin-top: 90px;
`;

const QuestionBubble = styled.div`
    background-color: #ffffff;
    border-radius: 15px;
    padding: 10px 15px;
    width: 32vw;
    height: 20vh;
    max-width: 40vw;
    margin-bottom: 20px;
    margin-left: -90px;
    position: relative;

    &::after {
        content: '';
        position: absolute;
        top: 50%;
        left: -16px;
        border-right: 16px solid #ffffff;
        border-top: 10px solid transparent;
        border-bottom: 10px solid transparent;
        transform: translateY(-50%);
    }
`;

const ResponseBubble = styled.div`
    background-color: #ffffff;
    border-radius: 15px;
    padding: 10px 15px;
    width: 32vw;
    height: 20vh;
    margin-bottom: 20px;
    margin-left: -40px;
    position: relative;

    &::after {
        content: '';
        position: absolute;
        top: 50%;
        right: -16px;
        border-left: 16px solid #FFFFFF;
        border-top: 10px solid transparent;
        border-bottom: 10px solid transparent;
        transform: translateY(-50%);
    }
`;

const InputField = styled.input`
    width: 100%;
    height: 100%;
    border: none;
    outline: none;
    font-family: 'PretendardM', sans-serif;
    font-size: 18px;
    padding: 10px;
    border-radius: 15px;
`;

export default AiInterview;
