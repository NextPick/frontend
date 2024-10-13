import React, {useState} from 'react';
import axios from 'axios';
import { ReactMediaRecorder } from 'react-media-recorder';
function App() {
  const [resp, setResp] = useState('');
  const fileUpload = async (e) =>{
    e.preventDefault();
    let formData = new FormData();
    formData.append("uploadFile", document.frm.uploadFile.files[0]);
    axios.post("http://localhost:8080/fileUpload", formData)
    .then(function(res){
      alert('success');
      setResp(res.data.text);
    })
    .catch(function(error){
      alert(error);
    })
  }
  return (
    <div align="center">
      <ReactMediaRecorder
          audio
          render={({status, startRecording, stopRecording, mediaBlobUrl }) => (
            <div>
              <p>{status}</p>
              <button onClick={startRecording}>start recording</button>
              <button onClick={stopRecording}>stop recording</button><br /><br />
              <audio src={mediaBlobUrl} controls></audio><br />
              <a href={mediaBlobUrl} download="mySound.wav">download</a>
            </div>
          )}
       />
       <hr/>
       <h2>음성 파일 upload</h2>
       <form name="frm" onSubmit={fileUpload} encType="multipart/form-data">
            <input type="file" name="uploadFile" accept='*'/>
            <input type="submit" value="전송" />
       </form>
       <h3>결과:{resp}</h3>
    </div>
  );
}
export default App;