import React from 'react';

/**
 * Displays a list of candidates in a table.
 * @param {object} props
 * @param {Array<object>} props.candidates - The array of candidate objects from the store.
 * @param {function(object): void} props.onSelectCandidate - Callback to set the selected candidate for the detail view.
 */
const CandidateList = ({ candidates, onSelectCandidate }) => {
  // If there are no completed interviews yet, show a helpful message.
  if (!candidates || candidates.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <h2>No interviews completed yet.</h2>
        <p>As candidates complete their interviews, their results will appear here.</p>
      </div>
    );
  }

  // Create a sorted copy of the candidates array, from highest score to lowest.
  const sortedCandidates = [...candidates].sort((a, b) => b.score - a.score);

  return (
    <div className="candidate-list">
      <h2>Completed Interviews</h2>
      <table>
        <thead>
          <tr>
            <th>Candidate Name</th>
            <th>Final Score</th>
            <th>AI Summary</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {sortedCandidates.map((candidate) => (
            <tr key={candidate.candidateId}>
              <td>
                <div>{candidate.name}</div>
                <small style={{ color: '#6b7280' }}>{candidate.email}</small>
              </td>
              <td>
                <strong style={{ fontSize: '1.2rem' }}>{candidate.score}</strong> / 60
              </td>
              <td>
                <p className="summary" style={{ margin: 0 }}>{candidate.summary ? candidate.summary.summary : 'N/A'}</p>
              </td>
              <td>
                <button onClick={() => onSelectCandidate(candidate)}>
                  View Transcript
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CandidateList;