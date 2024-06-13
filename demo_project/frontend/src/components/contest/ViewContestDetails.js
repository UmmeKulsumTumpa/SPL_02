import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import FreezedLeaderBoard from './FreezedLeaderBoard';
import ProblemDetails from './ProblemDetails';
import CustomProblemDetails from './CustomProblemDetails';
import ContestSubmissionView from './ContestSubmissionView';
import './styles/ViewContestDetails.css';

const ViewContestDetails = () => {
    const { contestId, username } = useParams();
    const [contestDetails, setContestDetails] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedProblem, setSelectedProblem] = useState(null);
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [problemsData, setProblemsData] = useState([]);

    useEffect(() => {
        const fetchContestDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/approved_contest/${contestId}`);
                const contestData = response.data;
                setContestDetails(contestData);
                setLeaderboardData(contestData.leaderboard || []);
                setProblemsData(contestData.problems || []);
            } catch (error) {
                console.error('Error fetching contest details:', error);
            }
        };

        fetchContestDetails();
    }, [contestId]);

    const formatDateTime = (dateTime) => {
        const date = new Date(dateTime);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'

        return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        setSelectedProblem(null); // Reset selected problem when switching tabs
    };

    const handleProblemClick = (problem) => {
        setSelectedProblem(problem);
        setActiveTab(problem.type === 'CF' ? 'problemDetails' : 'customProblemDetails');
    };

    if (!contestDetails) {
        return <div>Loading...</div>;
    }

    return (
        <div className="view-contest-details__container">
            <div className="view-contest-details__header">
                <div>
                    <span className="view-contest-details__time-label">Begin:</span>
                    <span className="view-contest-details__time-value">{formatDateTime(contestDetails.startTime)}</span>
                </div>
                <div>
                    <span className="view-contest-details__time-label">End:</span>
                    <span className="view-contest-details__time-value">{formatDateTime(contestDetails.endTime)}</span>
                </div>
            </div>
            <div className="view-contest-details__progress-container">
                <div className="view-contest-details__progress-bar">
                    <div className="view-contest-details__progress" style={{ width: '100%' }}></div>
                </div>
                <span className="view-contest-details__status">Ended</span>
            </div>
            <div className="view-contest-details__info">
                <h1>{contestDetails.title}</h1>
                <p>Public. Prepared by {contestDetails.author.authorName}</p>
            </div>
            <div className="view-contest-details__tabs">
                <button
                    className={`view-contest-details__tab ${activeTab === 'overview' ? 'active' : ''}`}
                    onClick={() => handleTabClick('overview')}
                >
                    Overview
                </button>
                <button
                    className={`view-contest-details__tab ${activeTab === 'rank' ? 'active' : ''}`}
                    onClick={() => handleTabClick('rank')}
                >
                    Rank
                </button>
                <button
                    className={`view-contest-details__tab ${activeTab === 'personalSubmissions' ? 'active' : ''}`}
                    onClick={() => handleTabClick('personalSubmissions')}
                >
                    Personal Submissions
                </button>
            </div>
            {activeTab === 'overview' && !selectedProblem && (
                <div className="view-contest-details__problems-container">
                    <table className="view-contest-details__problems">
                        <thead>
                            <tr>
                                <th>Serial Number</th>
                                <th>Problem Name</th>
                                <th>Alias Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contestDetails.problems.map((problem, index) => (
                                <tr key={problem.pid} onClick={() => handleProblemClick(problem)}>
                                    <td>{index + 1}</td>
                                    <td>{problem.title}</td>
                                    <td>{problem.aliasName}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {activeTab === 'rank' && !selectedProblem && (
                <FreezedLeaderBoard leaderboard={leaderboardData} problems={problemsData} />
            )}
            {activeTab === 'personalSubmissions' && (
                <ContestSubmissionView contestId={contestId} username={username} />
            )}
            {activeTab === 'problemDetails' && selectedProblem && (
                <ProblemDetails problem={selectedProblem} contestId={contestId} viewType="previous" setActiveTab={setActiveTab} />
            )}
            {activeTab === 'customProblemDetails' && selectedProblem?.type === 'CS' && (
                <CustomProblemDetails problem={selectedProblem} username={username} contestId={contestId} setActiveTab={setActiveTab} />
            )}
        </div>
    );
};

export default ViewContestDetails;
