import React, { useRef, useEffect } from 'react';
import useInterviewFlow from '../../hooks/useInterviewFlow';
import ChatMessage from './ChatMessage';
import Timer from './Timer';
import useInterviewStore from '../../store/interviewStore';
import TypingIndicator from './TypingIndicator'; // Import the new component

const ChatWindow = ({ activeInterview }) => { 
  const {
    messages,
    currentQuestion,
    userInput,
    setUserInput,
    isLoading,
    isCompleted,
    handleAnswerSubmit,
  } = useInterviewFlow();
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]); // Scroll when messages or loading state change

  const handleSubmit = () => {
    handleAnswerSubmit(userInput);
  };
  
  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="chat-window">
      <div className="messages-container">
        {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg.text} sender={msg.sender} />
        ))}
        
        {/* Conditionally render the typing indicator */}
        {isLoading && <TypingIndicator />}

        <div ref={messagesEndRef} />
      </div>

      {!isCompleted && (
        <div className="input-area">
          {activeInterview.status === 'in-progress' && currentQuestion && (
            <Timer 
              key={activeInterview.currentQuestionIndex}
              duration={currentQuestion.time} 
              onTimeUp={() => handleAnswerSubmit(userInput || " ")}
              questionIndex={activeInterview.currentQuestionIndex}
            />
          )}

          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={isLoading ? "Waiting for the next question..." : "Type your answer here..."}
            disabled={isLoading}
          />
          <button onClick={handleSubmit} disabled={isLoading || !userInput.trim()}>
            {isLoading ? "Processing..." : "Submit Answer"}
          </button>
        </div>
      )}
    </div>
  );
};

const ChatWindowWithStore = () => {
  const activeInterview = useInterviewStore(state => state.activeInterview);
  return <ChatWindow activeInterview={activeInterview} />;
}

export default ChatWindowWithStore;