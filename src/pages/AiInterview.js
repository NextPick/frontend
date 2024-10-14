import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHeaderMode } from '../hooks/HeaderManager';
import { useNavigate } from 'react-router-dom';
import Box from '../components/Box';
import Font from '../components/Font';
import styled from 'styled-components';
import Button from '../components/Button';
import Ai코치 from '../assets/Ai코치.png';
import mic from '../assets/mic.png';
import { ReactMediaRecorder } from 'react-media-recorder';

const AiInterview = () => {
    const { setHeaderMode } = useHeaderMode();
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState('BE');
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);
    const [userResponse, setUserResponse] = useState('');
    const [exampleQuestion, setExampleQuestion] = useState('질문을 고르고 있습니다... 잠시만 기다려주세요');
    const [isRecording, setIsRecording] = useState(false);
    const [mediaBlobUrl, setMediaBlobUrl] = useState(null);
    const [resp, setResp] = useState('');

    // 녹음된 파일을 WAV로 변환하여 업로드
    const uploadRecordedAudio = async () => {
        if (!mediaBlobUrl) {
            alert('녹음된 파일이 없습니다.');
            return;
        }
        try {
            const wavBlob = await convertWebmToWav(mediaBlobUrl);

            let formData = new FormData();
            formData.append('uploadFile', wavBlob, 'audio.wav');

            const res = await axios.post('http://localhost:8080/fileUpload', formData);
            alert('녹음 파일 업로드 성공');
            setResp(res.data.text);
        } catch (error) {
            alert('에러가 발생했습니다: ' + error.message);
        }
    };

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

    // DataView에 문자열 쓰기
    const writeString = (view, offset, string) => {
        for (let i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    };

    // mediaBlobUrl이 변경될 때 업로드 수행
    useEffect(() => {
        if (mediaBlobUrl) {
            uploadRecordedAudio();
        }
    }, [mediaBlobUrl]);

    useEffect(() => {
        setHeaderMode('main');
    }, [setHeaderMode]);

    useEffect(() => {
        setSelectedSubcategory(null);
    }, []);

    useEffect(() => {
        axios.get('http://localhost:8080/questions', {
            params: {
                size: 1,
                page: 1,
                type: 'rand',
                sort: 'recent',
                category: 3,
                keyword: ''
            }
        })
        .then(response => {
            const questionData = response.data.data;
            if (questionData && questionData.length > 0) {
                setExampleQuestion(questionData[0].question);
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
                                placeholder="대답을 입력하세요..." 
                            />
                        </ResponseBubble>
                    </div>
                </Container>

                {/* ReactMediaRecorder 컴포넌트를 통해 녹음 상태를 제어 */}
                <ReactMediaRecorder
                    audio
                    onStop={(blobUrl) => {
                        setMediaBlobUrl(blobUrl); // 녹음 멈출 때 mediaBlobUrl 설정
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
