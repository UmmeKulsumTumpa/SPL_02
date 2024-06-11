import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import './styles/ContestDashboard.css'

const ContestDashboard = ({contestant}) => {
    const { username } = contestant;
    const [activeTab, setActiveTab] = useState('participated');
    const [contests, setContests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // console.log(username);

    useEffect(() => {
        const fetchContests = async () => {
            setLoading(true);
            setError(null);
            try {
                if (activeTab === 'participated') {
                    const response = await axios.get(`http://localhost:8000/api/approved_contest/submission_history/${username}`);
                    const data = response.data.map(contest => {
                        const leaderboardEntry = contest.leaderboard.find(entry => entry.username === username);
                        // console.log(leaderboardEntry);
                        return leaderboardEntry ? {
                            contestId: contest.acid,
                            contestName: contest.title,
                            totalSolved: leaderboardEntry.totalSolved
                        } : null;
                    }).filter(entry => entry !== null);
                    setContests(data);
                } else if (activeTab === 'approved') {
                    const response = await axios.get('http://localhost:8000/api/approved_contest');
                    const data = response.data.filter(contest => contest.author.authorName === username).map(contest => ({
                        contestId: contest.acid,
                        contestName: contest.title,
                        totalProblems: contest.problems.length
                    }));
                    setContests(data);
                } else if (activeTab === 'requested') {
                    const response = await axios.get('http://localhost:8000/api/requested_contest');
                    const data = response.data.map(contest => ({
                        contestId: contest.cid,
                        contestName: contest.title,
                        totalProblems: contest.problems.length
                    }));
                    setContests(data);
                }
            } catch (err) {
                setError('fetch error ' + err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchContests();
    }, [activeTab, username]);

    const renderTable = () => {
        if (loading) {
            return <div className="contest-dashboard-loading">Loading...</div>;
        }

        if (error) {
            return <div className="contest-dashboard-error">Error: {error}</div>;
        }

        if (contests.length === 0) {
            return <div className="contest-dashboard-empty">No contests available</div>;
        }

        return (
            <table className="contest-dashboard-table">
                <thead>
                    <tr>
                        <th>Contest ID</th>
                        <th>Contest Name</th>
                        <th>{activeTab === 'participated' ? 'Total Solved Problems' : 'Total Problems'}</th>
                    </tr>
                </thead>
                <tbody>
                    {contests.map((contest, index) => (
                        <tr key={index}>
                            <td>{contest.contestId}</td>
                            <td>{contest.contestName}</td>
                            <td>{ (activeTab === 'participated') ? contest.totalSolved : contest.totalProblems}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    return (
        <div className="contest-dashboard-container">
            <div className="contest-dashboard-buttons">
                <button className={`contest-dashboard-button ${activeTab === 'participated' ? 'active' : ''}`} onClick={() => setActiveTab('participated')}>Participated Contests</button>
                <button className={`contest-dashboard-button ${activeTab === 'approved' ? 'active' : ''}`} onClick={() => setActiveTab('approved')}>Approved Contests</button>
                <button className={`contest-dashboard-button ${activeTab === 'requested' ? 'active' : ''}`} onClick={() => setActiveTab('requested')}>Requested Contests</button>
            </div>
            <div className="contest-dashboard-content">
                {renderTable()}
            </div>
        </div>
    );
};

export default ContestDashboard;
