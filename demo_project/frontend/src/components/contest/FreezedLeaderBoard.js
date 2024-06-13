import React from 'react';
import './styles/LeaderBoard.css';

const FreezedLeaderBoard = ({ leaderboard, problems }) => {

    const renderProblemStatus = (submittedProblems, problemId) => {
        const submissionsForProblem = submittedProblems.filter(p => p.pid === problemId);
        if (submissionsForProblem.length === 0) {
            return <td></td>;
        }

        const latestSubmission = submissionsForProblem.sort((a, b) => 
            new Date(b.result?.[0]?.creationTimeSeconds * 1000) - new Date(a.result?.[0]?.creationTimeSeconds * 1000)
        )[0];

        if (latestSubmission?.result?.[0]?.verdict === 'OK' || latestSubmission?.result?.verdict === 'Accepted') {
            return <td className="problem-solved">✔</td>;
        } else {
            return <td className="wrong-submission">✗</td>;
        }
    };

    const calculateRankings = (leaderboard) => {
        return leaderboard.map(user => {
            const solvedProblems = user.submittedProblems.reduce((acc, curr) => {
                const problemId = curr.pid;
                if (!acc[problemId] && curr.result && 
                    (curr.result?.[0]?.verdict === 'OK' || curr.result?.verdict === 'Accepted')) {
                    acc[problemId] = curr.result?.[0]?.creationTimeSeconds || curr.result?.creationTimeSeconds;
                }
                return acc;
            }, {});

            const totalSolved = Object.keys(solvedProblems).length;
            const firstCorrectSubmissionTime = Math.min(...Object.values(solvedProblems).filter(Boolean));

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

export default FreezedLeaderBoard;
