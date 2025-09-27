import React from 'react';
import './ProgressBar.css';

const ProgressBar = ({ currentQuestion, totalQuestions }) => {
  const progress = (currentQuestion / totalQuestions) * 100;
  
  return (
    <div className="progress-bar">
      <div className="progress-header">
        <div className="progress-title">Interview Progress</div>
        <div className="progress-count">
          Question {currentQuestion} of {totalQuestions}
        </div>
      </div>
      
      <div className="progress-track">
        <div 
          className="progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="progress-steps">
        {[...Array(totalQuestions)].map((_, index) => (
          <div
            key={index}
            className={`step ${
              index < currentQuestion ? 'completed' :
              index === currentQuestion - 1 ? 'current' : ''
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;