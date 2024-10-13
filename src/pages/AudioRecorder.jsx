import React, { useState } from 'react';
import axios from 'axios';
import { ReactMediaRecorder } from 'react-media-recorder';

function App() {
  const [resp, setResp] = useState('');
  const [mediaBlobUrl, setMediaBlobUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [audioSrc, setAudioSrc] = useState(null);

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

  // 선택한 파일을 WAV로 변환하여 업로드
  const uploadSelectedFile = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      alert('파일을 선택해주세요.');
      return;
    }

    try {
      const wavBlob = await convertFileToWav(selectedFile);

      let formData = new FormData();
      formData.append('uploadFile', wavBlob, 'audio.wav');

      const res = await axios.post('http://localhost:8080/fileUpload', formData);
      alert('파일 업로드 성공');
      setResp(res.data.text);
    } catch (error) {
      alert('에러가 발생했습니다: ' + error.message);
    }
  };

  const fileChangeHandler = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);

    if (file) {
      const fileURL = URL.createObjectURL(file);
      setAudioSrc(fileURL);
    } else {
      setAudioSrc(null);
    }
  };

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

  const convertFileToWav = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();

      fileReader.onload = function () {
        const arrayBuffer = this.result;
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();

        audioContext.decodeAudioData(arrayBuffer, (audioBuffer) => {
          const wavBlob = audioBufferToWavBlob(audioBuffer);
          resolve(wavBlob);
        }, (error) => {
          reject(error);
        });
      };

      fileReader.onerror = function (error) {
        reject(error);
      };

      fileReader.readAsArrayBuffer(file);
    });
  };

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

  return (
    <div align="center">
      <h2>음성 녹음</h2>
      <ReactMediaRecorder
        audio
        onStop={(blobUrl, blob) => {
          setMediaBlobUrl(blobUrl);
        }}
        render={({ status, startRecording, stopRecording }) => (
          <div>
            <p>{status}</p>
            <button onClick={startRecording}>녹음 시작</button>
            <button onClick={stopRecording}>녹음 종료</button><br /><br />
            {mediaBlobUrl && <audio src={mediaBlobUrl} controls></audio>}
          </div>
        )}
      />
      {/* {mediaBlobUrl && (
        <button onClick={uploadRecordedAudio}>녹음 파일 업로드</button>
      )} */}
      <hr />
      <h2>음성 파일 업로드</h2>
      <form name="frm" onSubmit={uploadSelectedFile} encType="multipart/form-data">
        <input
          type="file"
          name="uploadFile"
          accept="audio/*"
          onChange={fileChangeHandler}
        />
        <input type="submit" value="파일 업로드" />
      </form>
      {audioSrc && <audio src={audioSrc} controls></audio>}
      <h3>결과: {resp}</h3>
    </div>
  );
}

export default App;
