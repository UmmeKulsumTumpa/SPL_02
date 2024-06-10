import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles/LeaderBoard.css';

const LeaderBoard = ({ contestId }) => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [problems, setProblems] = useState([]);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/approved_contest/${contestId}`);
                setLeaderboard(response.data.leaderboard);
                setProblems(response.data.problems);
            } catch (error) {
                console.error('Error fetching leaderboard:', error);
            }
        };

        fetchLeaderboard();
    }, [contestId]);

    const renderProblemStatus = (submittedProblems, problemId) => {
        console.log(submittedProblems, problemId);
        const submissionsForProblem = submittedProblems.filter(p => p.pid === problemId);

        if (submissionsForProblem.length === 0) {
            return <td></td>;
        }

        const latestSubmission = submissionsForProblem.sort((a, b) => 
            new Date(b.result[0].creationTimeSeconds * 1000) - new Date(a.result[0].creationTimeSeconds * 1000)
        )[0];

        console.log(latestSubmission);

        if (latestSubmission && latestSubmission.result && latestSubmission.result[0] && latestSubmission.result[0].verdict === 'OK') {
            return <td className="problem-solved">✔</td>;
        } else {
            return <td></td>;
        }
    };

    return (
        <table className="leaderboard">
            <thead>
                <tr>
                    <th>Participant</th>
                    {problems.map(problem => (
                        <th key={problem.pid}>{problem.title}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {leaderboard.map((entry, index) => (
                    <tr key={index}>
                        <td>{entry.username}</td>
                        {problems.map(problem => (
                            <td key={problem.pid}>{renderProblemStatus(entry.submittedProblems, problem.pid)}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default LeaderBoard;
