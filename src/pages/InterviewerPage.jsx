import React, { useState } from 'react';
import useInterviewStore from '../store/interviewStore';
import CandidateList from '../components/Interviewer/CandidateList';
import CandidateDetails from '../components/Interviewer/CandidateDetails';

/**
 * The main page for the interviewer dashboard.
 * It fetches the list of candidates from the Zustand store and manages
 * the logic for displaying either the list of all candidates or the
 * detailed view of a single candidate.
 */
const InterviewerPage = () => {
  // Get the list of all completed candidates from our global store.
  const candidates = useInterviewStore((state) => state.candidates);
  
  // Use local state to track which candidate is currently being viewed.
  // If `null`, we show the list. If it's a candidate object, we show the details.
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  // If a candidate has been selected, render the detail view.
  if (selectedCandidate) {
    return (
      <CandidateDetails 
        candidate={selectedCandidate} 
        // Pass a function to the 'onBack' prop that clears the selection,
        // which will cause this component to re-render and show the list again.
        onBack={() => setSelectedCandidate(null)} 
      />
    );
  }

  // By default, render the list of all candidates.
  return (
    <CandidateList 
      candidates={candidates} 
      // Pass the setSelectedCandidate function so the list component can
      // tell this page which candidate the user has clicked on.
      onSelectCandidate={setSelectedCandidate} 
    />
  );
};

export default InterviewerPage;