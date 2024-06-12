import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './styles/ContestSubmissionView.css';

const ContestSubmissionView = () => {
    const { contestId, username } = useParams();
    console.log(username);
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/approved_contest/${contestId}`);
                const contest = response.data;
                const userEntry = contest.leaderboard.find(entry => entry.username === username);

                if (!userEntry) {
                    setSubmissions([]);
                    setError('No submissions found for this user in this contest.');
                } else {
                    const data = userEntry.submittedProblems.map(problem => {
                        const problemDetails = contest.problems.find(p => p.pid === problem.pid);
                        return {
                            contestId: contest.acid,
                            contestName: contest.title,
                            problemId: problem.pid,
                            problemName: problemDetails ? problemDetails.title : 'Unknown Problem',
                            verdict: problem.result[0]?.verdict || problem.result.verdict,
                            time: problem.result[0]?.timeConsumedMillis || problem.result.execTime,
                            memory: problem.result[0]?.memoryConsumedBytes || problem.result.maxMemoryUsageMB,
                        };
                    });

                    setSubmissions(data.reverse()); // Reverse the order of submissions
                    setError(null);
                }
            } catch (err) {
                setError('fetch error ' + err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSubmissions();
    }, [username, contestId]);

    if (loading) {
        return <div className="contest-submissions__loading">Loading...</div>;
    }

    if (error) {
        return <div className="contest-submissions__error">Error: {error}</div>;
    }

    if (submissions.length === 0) {
        return <div className="contest-submissions__empty">No submissions available</div>;
    }

    return (
        <div className="contest-submissions__container">
            <h2 className="contest-submissions__username-title">{username}&apos;s Submission History for Contest {contestId}</h2>
            <table className="contest-submissions__table">
                <thead>
                    <tr>
                        <th>Contest ID</th>
                        <th>Contest Name</th>
                        <th>Problem ID</th>
                        <th>Problem Name</th>
                        <th>Verdict</th>
                        <th>Time</th>
                        {/* <th>Memory</th> */}
                    </tr>
                </thead>
                <tbody>
                    {submissions.map((submission, index) => (
                        <tr key={index}>
                            <td>{submission.contestId}</td>
                            <td>{submission.contestName}</td>
                            <td>{submission.problemId}</td>
                            <td>{submission.problemName}</td>
                            <td className={`contest-submissions__verdict-${(submission.verdict === 'OK' || submission.verdict === 'Accepted') ? 'ok' : 'fail'}`}>
                                {(submission.verdict === 'Accepted') ? 'OK' : submission.verdict}
                            </td>
                            <td>{submission.time} ms</td>
                            {/* <td>{submission.memory} bytes</td> */}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ContestSubmissionView;
