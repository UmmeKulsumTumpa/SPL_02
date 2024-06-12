import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import './styles/SubmissionView.css';

const SubmissionsView = ({ contestant }) => {
    const { username } = contestant;
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/approved_contest/submission_history/${username}`);
                const data = response.data.map(contest => {
                    return contest.leaderboard.map(entry => {
                        return entry.submittedProblems.map(problem => {
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
                    }).flat();
                }).flat();
                setSubmissions(data.reverse());  // Reverse the order of submissions
                setError(null);
            } catch (err) {
                setError('fetch error ' + err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSubmissions();
    }, [username]);

    if (loading) {
        return <div className="submissions-view-loading">Loading...</div>;
    }

    if (error) {
        return <div className="submissions-view-error">Error: {error}</div>;
    }

    if (submissions.length === 0) {
        return <div className="submissions-view-empty">No submissions available</div>;
    }

    return (
        <div className="submissions-view-container">
            <h2 className='submissions-view-container username-title'>{username}&apos;s Submission History</h2>
            <table className="submissions-view-table">
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
                            <td className={`submissions-view-verdict-${(submission.verdict === 'OK' || submission.verdict === 'Accepted') ? 'ok' : 'fail'}`}>
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

export default SubmissionsView;