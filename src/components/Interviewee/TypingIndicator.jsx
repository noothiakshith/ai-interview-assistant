import React from 'react';

// A simple component to show a "typing" animation.
// The CSS for this will be in our main index.css file.
const TypingIndicator = () => {
  return (
    <div className="chat-message ai typing-indicator">
      <span></span>
      <span></span>
      <span></span>
    </div>
  );
};

export default TypingIndicator;