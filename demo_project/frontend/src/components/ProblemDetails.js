import React from 'react';
import '../styles/ProblemDetails.css';

function ProblemDetails({ problem }) {
  if (!problem) return null;

  const { pid, title, statement, constraints } = problem;

  return (
    <div className="problem-details-container">
      <h2>{title}</h2>
      <p>Problem ID: {pid}</p>
      
      {/* Constraints Section */}
      <h3>Constraints:</h3>
      <div className="constraints">
        <p>{constraints}</p>
      </div>

      {/* Statement Section */}
      <h3>Statement:</h3>
      <div className="statement">
        <p>{statement}</p>
      </div>

      {/* Submit Button */}
      <a href={problem.submitLink} target="_blank" rel="noopener noreferrer">Submit Solution</a>
    </div>
  );
}

export default ProblemDetails;
