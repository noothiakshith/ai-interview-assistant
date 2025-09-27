import React, { useState, useMemo } from 'react';
import useInterviewStore from '../store/interviewStore';
import CandidateList from '../components/Interviewer/CandidateList';
import CandidateDetails from '../components/Interviewer/CandidateDetails';

/**
 * The main page for the interviewer dashboard.
 * It now includes controls for searching and sorting the candidate list.
 */
const InterviewerPage = () => {
  const candidates = useInterviewStore((state) => state.candidates);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  // New state for handling search and sort functionality.
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('score-desc'); // Default sort order

  // useMemo will re-calculate the displayed candidates only when the source list,
  // search term, or sort order changes, which is great for performance.
  const processedCandidates = useMemo(() => {
    let filtered = [...candidates];

    // Apply search filter (case-insensitive)
    if (searchTerm) {
      filtered = filtered.filter(candidate =>
        candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    const [key, direction] = sortOrder.split('-');
    filtered.sort((a, b) => {
      const valA = key === 'name' ? a.name.toLowerCase() : a.score;
      const valB = key === 'name' ? b.name.toLowerCase() : b.score;

      if (valA < valB) return direction === 'asc' ? -1 : 1;
      if (valA > valB) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [candidates, searchTerm, sortOrder]);

  // If a candidate is selected, show their details.
  if (selectedCandidate) {
    return (
      <CandidateDetails 
        candidate={selectedCandidate} 
        onBack={() => setSelectedCandidate(null)} 
      />
    );
  }

  // The main dashboard view with search and sort controls.
  return (
    <div className="interviewer-dashboard">
      <div className="controls" style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '20px',
        borderBottom: '1px solid #eee',
        alignItems: 'center'
      }}>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '10px', fontSize: '1rem', width: '350px', border: '1px solid #ccc', borderRadius: '4px' }}
        />
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          style={{ padding: '10px', fontSize: '1rem', border: '1px solid #ccc', borderRadius: '4px' }}
        >
          <option value="score-desc">Sort by Score (High to Low)</option>
          <option value="score-asc">Sort by Score (Low to High)</option>
          <option value="name-asc">Sort by Name (A-Z)</option>
          <option value="name-desc">Sort by Name (Z-A)</option>
        </select>
      </div>
      <CandidateList
        candidates={processedCandidates}
        onSelectCandidate={setSelectedCandidate}
      />
    </div>
  );
};

export default InterviewerPage;