import React, { useState, useEffect } from 'react';
import useInterviewStore from '../store/interviewStore';
import ResumeUpload from '../components/Interviewee/ResumeUpload';
import ChatWindow from '../components/Interviewee/ChatWindow';
import MissingInfoModal from '../components/Interviewee/MissingInfoModal';
import WelcomeBackModal from '../components/Interviewee/WelcomeBackModal'; // Import the new modal

const IntervieweePage = () => {
  const { activeInterview, startNewInterview, updateCandidateInfo, startInterviewProcess, resetActiveInterview } = useInterviewStore();
  
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [parsedInfo, setParsedInfo] = useState(null);
  const [showWelcomeBackModal, setShowWelcomeBackModal] = useState(false); // State for the new modal

  useEffect(() => {
    // Check for an in-progress interview on component mount.
    if (activeInterview.status === 'in-progress') {
      setShowWelcomeBackModal(true);
    } else if (!activeInterview.candidateId || activeInterview.status === 'completed') {
      // If no active interview, or it's completed, start a fresh one.
      startNewInterview();
    }
  }, []); // Run only once on mount

  const handleResumeSuccess = (info) => {
    if (!info.name || !info.email || !info.phone) {
      setParsedInfo(info);
      setShowInfoModal(true);
    } else {
      updateCandidateInfo(info);
      startInterviewProcess();
    }
  };

  const handleInfoSubmit = (completeInfo) => {
    updateCandidateInfo(completeInfo);
    startInterviewProcess();
    setShowInfoModal(false);
  };

  // --- Handlers for the WelcomeBackModal ---
  const handleContinue = () => {
    setShowWelcomeBackModal(false); // Just close the modal and continue
  };

  const handleStartOver = () => {
    resetActiveInterview(); // Reset the interview state
    setShowWelcomeBackModal(false); // Close the modal
  };

  return (
    <div>
      {/* Render the Welcome Back modal if an interview is in progress */}
      {showWelcomeBackModal && (
        <WelcomeBackModal
          onContinue={handleContinue}
          onStartOver={handleStartOver}
        />
      )}

      {/* Render the Missing Info modal if needed */}
      {showInfoModal && (
        <MissingInfoModal
          initialInfo={parsedInfo}
          onSubmit={handleInfoSubmit}
          onClose={() => setShowInfoModal(false)}
        />
      )}

      {/* Show Resume Upload only if the process is pending */}
      {activeInterview.status === 'pending' && (
        <ResumeUpload onUploadSuccess={handleResumeSuccess} />
      )}
      
      {/* Show ChatWindow once the interview is in progress */}
      {activeInterview.status === 'in-progress' && (
        <ChatWindow />
      )}
      
      {/* Show completion message */}
      {activeInterview.status === 'completed' && (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <h2>Interview Complete!</h2>
          <p>Thank you for your time. Your results have been submitted.</p>
        </div>
      )}
    </div>
  );
};

export default IntervieweePage;