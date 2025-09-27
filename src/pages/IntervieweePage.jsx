import React, { useState, useEffect } from 'react';
import useInterviewStore from '../store/interviewStore';
import ResumeUpload from '../components/Interviewee/ResumeUpload';
import ChatWindow from '../components/Interviewee/ChatWindow';
import MissingInfoModal from '../components/Interviewee/MissingInfoModal'; // Import our new modal

const IntervieweePage = () => {
  const { activeInterview, startNewInterview, updateCandidateInfo, startInterviewProcess, resetActiveInterview } = useInterviewStore();
  
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [parsedInfo, setParsedInfo] = useState(null); // To hold resume data temporarily

  useEffect(() => {
    // Session restoration logic is simplified.
    // The "Welcome Back" modal is a later step if we need it. For now, let's focus on the new flow.
    if (!activeInterview.candidateId || activeInterview.status === 'completed') {
      startNewInterview();
    }
  }, [activeInterview.status, activeInterview.candidateId, startNewInterview]);

  /**
   * This function is now the main controller after resume upload.
   */
  const handleResumeSuccess = (info) => {
    // Check if any required field is missing.
    if (!info.name || !info.email || !info.phone) {
      setParsedInfo(info); // Store the partial info
      setShowInfoModal(true); // Trigger the popup
    } else {
      // If all info is present, update the store and start the interview directly.
      updateCandidateInfo(info);
      startInterviewProcess();
    }
  };

  /**
   * This function is called when the MissingInfoModal form is submitted.
   */
  const handleInfoSubmit = (completeInfo) => {
    updateCandidateInfo(completeInfo); // Update the store with the complete info
    startInterviewProcess(); // Start the interview process
    setShowInfoModal(false); // Close the modal
  };

  // --- Component Rendering Logic ---

  return (
    <div>
      {/* Conditionally render the new Missing Info modal */}
      {showInfoModal && (
        <MissingInfoModal
          initialInfo={parsedInfo}
          onSubmit={handleInfoSubmit}
          onClose={() => setShowInfoModal(false)}
        />
      )}

      {/* Show Resume Upload only if the process hasn't started */}
      {activeInterview.status === 'pending' && (
        <ResumeUpload onUploadSuccess={handleResumeSuccess} />
      )}
      
      {/* Show ChatWindow once the interview is in progress */}
      {activeInterview.status === 'in-progress' && (
        <ChatWindow />
      )}
      
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