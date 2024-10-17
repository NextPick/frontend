import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';

const ChatLayout = () => {
  const [messages, setMessages] = useState([
    { type: 'interviewer', text: 'Rest Client가 무엇인지 설명해 주세요.' },
    { type: 'user', text: 'Rest Client는 서버에 요청을 보내고 응답을 받는 클라이언트입니다.' },
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = () => {
    if (inputValue.trim()) {
      setMessages([...messages, { type: 'user', text: inputValue }]);
      setInputValue(''); // 입력창 초기화
    }
  };

  return (
    <Container>
      <ChatContainer>
        {messages.map((message, index) => (
          <MessageContainer key={index} className={message.type === 'user' ? 'user' : 'interviewer'}>
            {message.type === 'interviewer' ? <RedCircle /> : null}
            <Message className={message.type}>{message.text}</Message>
            {message.type === 'user' ? <GreenCircle /> : null}
          </MessageContainer>
        ))}
      </ChatContainer>

      <InputContainer>
        <InputBox
          placeholder="답변을 입력하세요..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <SubmitButton onClick={handleSubmit}>제출하기</SubmitButton>
      </InputContainer>
    </Container>
  );
};

// 애니메이션 정의
const slideUp = keyframes`
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

// 스타일 정의
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  padding: 20px;
  background-color: #f8f9fa;
`;

const ChatContainer = styled.div`
  flex: 1;
  width: 80%;
  max-width: 600px;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
  background-color: #e9f7fe;
  border-radius: 10px;
`;

const MessageContainer = styled.div`
  display: flex;
  align-items: center;
  animation: ${slideUp} 0.3s ease-out;
`;

const RedCircle = styled.div`
  width: 40px;
  height: 40px;
  background-color: #ff4d4d;
  border-radius: 50%;
  margin-right: 10px;
`;

const GreenCircle = styled.div`
  width: 40px;
  height: 40px;
  background-color: #28a745;
  border-radius: 50%;
  margin-left: 10px;
`;

const Message = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 15px;
  flex: 1;
  border: 2px solid ${({ className }) => (className === 'user' ? '#28a745' : '#ff4d4d')};
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  width: 80%;
  max-width: 600px;
  padding: 10px;
  margin-top: 20px;
  background-color: #e0e0e0;
  border-radius: 10px;
`;

const InputBox = styled.textarea`
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 5px;
  resize: none;
`;

const SubmitButton = styled.button`
  padding: 10px 20px;
  margin-left: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

export default ChatLayout;
