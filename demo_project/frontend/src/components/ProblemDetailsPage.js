// ProblemDetailsPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ProblemDetails from './ProblemDetails';

function ProblemDetailsPage() {
  const { type, id } = useParams();
  const [problem, setProblem] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        // Fetch problem details from the backend
        const response = await axios.get(`http://localhost:8000/api/problem/retrieve/${type}/${id}`);
        setProblem(response.data);
      } catch (err) {
        console.error('Error fetching problem:', err);
        setError(err.message || 'An error occurred');
      }
    };

    fetchProblem();
  }, [id, type]);

  return (
    <div>
      {error && <p>{error}</p>}
      {problem ? <ProblemDetails problem={problem} /> : <p>Loading...</p>}
    </div>
  );
}

export default ProblemDetailsPage;
