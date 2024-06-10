import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles/LeaderBoard.css';

const LeaderBoard = ({ contestId }) => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [problems, setProblems] = useState([]);
    const [contestEnded, setContestEnded] = useState(false);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/approved_contest/${contestId}`);
                const contestDetails = response.data;
                const endTime = new Date(contestDetails.endTime);
                const currentTime = new Date();

                if (currentTime > endTime) {
                    setContestEnded(true);
                }

                setLeaderboard(contestDetails.leaderboard);
                setProblems(contestDetails.problems);
            } catch (error) {
                console.error('Error fetching leaderboard:', error);
            }
        };

        fetchLeaderboard();
        const intervalId = setInterval(() => {
            if (!contestEnded) {
                fetchLeaderboard();
            }
        }, 10000);

        return () => clearInterval(intervalId);
    }, [contestId, contestEnded]);

    const renderProblemStatus = (submittedProblems, problemId) => {
        const submissionsForProblem = submittedProblems.filter(p => p.pid === problemId);
        if (submissionsForProblem.length === 0) {
            return <td></td>;
        }

        const latestSubmission = submissionsForProblem.sort((a, b) => 
            new Date(b.result[0].creationTimeSeconds * 1000) - new Date(a.result[0].creationTimeSeconds * 1000)
        )[0];

        if (latestSubmission && latestSubmission.result && latestSubmission.result[0] && latestSubmission.result[0].verdict === 'OK') {
            return <td className="problem-solved">✔</td>;
        } else {
            return <td></td>;
        }
    };

    const calculateRankings = (leaderboard) => {
        return leaderboard.map(user => {
            const solvedProblems = user.submittedProblems.reduce((acc, curr) => {
                const problemId = curr.pid;
                if (!acc[problemId] && curr.result && curr.result[0].verdict === 'OK') {
                    acc[problemId] = curr.result[0].creationTimeSeconds;
                }
                return acc;
            }, {});

            const totalSolved = Object.keys(solvedProblems).length;
            const firstCorrectSubmissionTime = Math.min(...Object.values(solvedProblems));

            return {
                ...user,
                totalSolved,
                firstCorrectSubmissionTime,
            };
        }).sort((a, b) => {
            if (b.totalSolved === a.totalSolved) {
                return a.firstCorrectSubmissionTime - b.firstCorrectSubmissionTime;
            }
            return b.totalSolved - a.totalSolved;
        });
    };

    const rankedLeaderboard = calculateRankings(leaderboard);

    return (
        <table className="leaderboard">
            <thead>
                <tr>
                    <th>Rank</th>
                    <th>Participant</th>
                    {problems.map(problem => (
                        <th key={problem.pid}>{problem.title}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {rankedLeaderboard.map((entry, index) => (
                    <tr key={index}>
                        <td>{index + 1}</td>
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
