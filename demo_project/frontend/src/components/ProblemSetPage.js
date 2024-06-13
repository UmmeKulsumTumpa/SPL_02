import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import '../styles/ProblemSetPage.css';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import CustomDetails from './CustomDetails';

function ProblemSetPage() {
	const { username } = useContext(AuthContext);
	const [problems, setProblems] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [activeTab, setActiveTab] = useState('problemset'); // Initialize activeTab state
	const navigate = useNavigate();

	useEffect(() => {
		const fetchProblems = async () => {
			try {
				const response = await axios.get('http://localhost:8000/api/problem');
				setProblems(response.data);
				setLoading(false); // Set loading to false once data is fetched
			} catch (err) {
				console.error('Error fetching problems:', err);
				setError('Error fetching problems. Please try again later.');
				setLoading(false); // Set loading to false even if there's an error
			}
		};

		fetchProblems();
	}, []);

	const handleProblemClick = (problem) => {
		const problemType = problem.pid.slice(0, 2);
		// console.log(problemType);

		try {
			if (problemType === 'CF') {
				navigate(`/problem/${problem._id}`, { state: { problem } });
			} else if (problemType === 'CS') {
				<CustomDetails problemId={problem.id} />
			} else {
				console.error('Unknown problem type:', problemType);
				setError('Unknown problem type. Please contact support.');
			}
		} catch (err) {
			console.error('Error navigating to problem page:', err);
			setError('Error navigating to problem page. Please try again later.');
		}
	};

	if (loading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div>{error}</div>;
	}

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
