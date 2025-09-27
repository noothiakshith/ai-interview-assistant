import React from 'react';

/**
 * Displays a list of candidates in a table.
 * @param {object} props
 * @param {Array<object>} props.candidates - A pre-filtered and pre-sorted array of candidate objects.
 * @param {function(object): void} props.onSelectCandidate - Callback to set the selected candidate for the detail view.
 */
const CandidateList = ({ candidates, onSelectCandidate }) => {
  // If the processed list is empty, show a message. This could be because there are
  // no candidates, or because the search term didn't match any.
  if (!candidates || candidates.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <h2>No matching candidates found.</h2>
        <p>Try adjusting your search or sort criteria, or wait for new interviews to be completed.</p>
      </div>
    );
  }

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
          {candidates.map((candidate) => ( // Directly map over the received 'candidates' prop
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