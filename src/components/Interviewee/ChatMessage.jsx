import React from 'react';

/**
 * Displays a single message in the chat.
 * @param {object} props
 * @param {string} props.message - The text content of the message.
 * @param {'ai' | 'user'} props.sender - Determines the styling of the message bubble.
 */
const ChatMessage = ({ message, sender }) => {
  // The sender determines the CSS class, which controls the message's appearance and alignment.
  const messageClass = `chat-message ${sender}`;

  return (
    <div className={messageClass}>
      {/* We use <p> to ensure proper paragraph spacing and accessibility. */}
      <p style={{ margin: 0 }}>{message}</p>
    </div>
  );
};

export default ChatMessage;