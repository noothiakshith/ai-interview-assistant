import React from 'react';

/**
 * Displays the detailed transcript and summary for a single candidate.
 * @param {object} props
 *- @param {object} props.candidate - The full candidate object.
- * @param {function(): void} props.onBack - Callback to return to the candidate list view.
 */
const CandidateDetails = ({ candidate, onBack }) => {
  return (
    <div className="candidate-details">
      <button onClick={onBack} className="back-button">
        &larr; Back to All Candidates
      </button>
      
      <h2>{candidate.name}'s Interview Results</h2>
      
      <p><strong>Email:</strong> {candidate.email}</p>
      <p><strong>Phone:</strong> {candidate.phone}</p>
      <p><strong>Final Score:</strong> <strong style={{ fontSize: '1.5rem', color: '#4f46e5' }}>{candidate.score} / 60</strong></p>
      
      <h3>AI Summary</h3>
      {candidate.summary && (
        <div>
          <p>{candidate.summary.summary}</p>
          <p><strong>Strengths:</strong> {Array.isArray(candidate.summary.strengths) ? candidate.summary.strengths.join(', ') : candidate.summary.strengths}</p>
          <p><strong>Areas for Improvement:</strong> {Array.isArray(candidate.summary.areasForImprovement) ? candidate.summary.areasForImprovement.join(', ') : candidate.summary.areasForImprovement}</p>
        </div>
      )}
      
      <h3>Full Transcript</h3>
      <div>
        {candidate.answers.map((item, index) => (
          <div key={index} className="transcript-item">
            <h4>{`Q${index + 1}: ${item.question}`}</h4>
            <p><strong>Answer:</strong> {item.answer}</p>
            <p><small><strong>AI Score for this answer:</strong> {item.score} / 10</small></p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CandidateDetails;