import React from 'react';
import './WelcomeBackModal.css';

/**
 * A modal that prompts the user to either continue their in-progress interview
 * or start a new one.
 * @param {object} props
 * @param {function} props.onContinue - The function to call when the "Continue" button is clicked.
 * @param {function} props.onStartOver - The function to call when the "Start Over" button is clicked.
 */
const WelcomeBackModal = ({ onContinue, onStartOver }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Welcome Back!</h2>
        <p>You have an interview in progress. Would you like to continue where you left off?</p>
        <div className="modal-actions">
          <button onClick={onStartOver} className="button-secondary">Start Over</button>
          <button onClick={onContinue} className="button-primary">Continue Interview</button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeBackModal;