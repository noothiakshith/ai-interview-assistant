import React, { useState, useEffect, useMemo } from 'react';
import './Timer.css';

/**
 * A countdown timer component with visual progress indicator.
 * @param {object} props
 * @param {number} props.duration - The total time for the countdown in seconds.
 * @param {function(): void} props.onTimeUp - A callback function to execute when the timer reaches zero.
 * @param {number} props.questionIndex - A key to force the timer to reset when a new question appears.
 */
const Timer = ({ duration, onTimeUp, questionIndex }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  // Calculate time-based styles and formats
  const {
    timeString,
    progressPercent,
    statusClass
  } = useMemo(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    const progressPercent = (timeLeft / duration) * 100;
    
    let statusClass = '';
    if (timeLeft <= 30) statusClass = 'timer-critical';
    else if (timeLeft <= 60) statusClass = 'timer-warning';
    
    return { timeString, progressPercent, statusClass };
  }, [timeLeft, duration]);

  // This useEffect handles the countdown logic.
  useEffect(() => {
    // When timeLeft hits 0, call the onTimeUp function and stop the interval.
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    // Set up an interval to decrement timeLeft every second.
    const intervalId = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);

    // Cleanup function: clear the interval when the component unmounts or dependencies change.
    return () => clearInterval(intervalId);
  }, [timeLeft, onTimeUp]);

  // Reset timer when question changes
  useEffect(() => {
    setTimeLeft(duration);
  }, [duration, questionIndex]);

  return (
    <div className="timer-container">
      <div 
        className="timer-circle"
        style={{ 
          '--progress': `${progressPercent}%`,
          '--progress-color': timeLeft <= 30 ? '#ff4444' : timeLeft <= 60 ? '#ff9f1a' : '#4caf50'
        }}
      >
        <div className="timer-progress" />
        <div className={`timer-text ${statusClass}`}>
          {timeString}
        </div>
      </div>
      <div className="timer-label">
        Time Remaining
      </div>
    </div>
  );
};

export default Timer;