// ProblemSetPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/ProblemSetPage.css';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

function ProblemSetPage() {
  const [problems, setProblems] = useState([]);
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        // Fetch problems from the backend
        const response = await axios.get('http://localhost:8000/api/problem');
        setProblems(response.data);
      } catch (err) {
        console.error('Error fetching problems:', err);
      }
    };

    fetchProblems();
  }, []);

  const handleProblemClick = (problem) => {
    // Navigate to the ProblemDetails page with the problem's ID
    navigate(`/problem/${problem._id}`, { state: { problem } });
  };

  return (
    <div className="problem-container">
      <h1>Problem Set</h1>
      <table className="problem-table">
        <thead>
          <tr>
            <th>Serial Number</th>
            <th>Problem Name</th>
          </tr>
        </thead>
        <tbody>
          {problems.map((problem, index) => (
            <tr key={problem._id} onClick={() => handleProblemClick(problem)}>
              <td>{index + 1}</td>
              <td>{problem.title}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProblemSetPage;