import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Leaderboard from './LeaderBoard';
import ProblemDetails from './ProblemDetails';
import CustomProblemDetails from './CustomProblemDetails';
import ContestSubmissionView from './ContestSubmissionView';
import './styles/ParticipateContest.css';

const ParticipateContest = () => {
    const { contestId, username } = useParams();
    const [contestDetails, setContestDetails] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedProblem, setSelectedProblem] = useState(null);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const fetchContestDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/approved_contest/${contestId}`);
                setContestDetails(response.data);
                updateProgress(response.data.startTime, response.data.endTime);
            } catch (error) {
                console.error('Error fetching contest details:', error);
            }
        };

        fetchContestDetails();
    }, [contestId]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (contestDetails) {
                updateProgress(contestDetails.startTime, contestDetails.endTime);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [contestDetails]);

    const updateProgress = (startTime, endTime) => {
        const currentTime = new Date();
        const start = new Date(startTime);
        const end = new Date(endTime);
        const totalDuration = end - start;
        const elapsedTime = currentTime - start;
        const progressPercentage = Math.min((elapsedTime / totalDuration) * 100, 100);
        setProgress(progressPercentage);
    };

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
        <div className="participate-contest__container">
            <div className="participate-contest__header">
                <div>
                    <span className="participate-contest__time-label">Begin:</span>
                    <span className="participate-contest__time-value">{formatDateTime(contestDetails.startTime)}</span>
                </div>
                <div>
                    <span className="participate-contest__time-label">End:</span>
                    <span className="participate-contest__time-value">{formatDateTime(contestDetails.endTime)}</span>
                </div>
            </div>
            <div className="participate-contest__progress-container">
                <div className="participate-contest__progress-bar">
                    <div className="participate-contest__progress" style={{ width: `${progress}%` }}></div>
                </div>
                <span className="participate-contest__status">Running</span>
            </div>
            <div className="participate-contest__info">
                <h1>{contestDetails.title}</h1>
                <p>Public. Prepared by {contestDetails.author.authorName}</p>
                <p>Participant: {username}</p>
            </div>
            <div className="participate-contest__tabs">
                <button
                    className={`participate-contest__tab ${activeTab === 'overview' ? 'active' : ''}`}
                    onClick={() => handleTabClick('overview')}
                >
                    Overview
                </button>
                <button
                    className={`participate-contest__tab ${activeTab === 'rank' ? 'active' : ''}`}
                    onClick={() => handleTabClick('rank')}
                >
                    Rank
                </button>
                <button
                    className={`participate-contest__tab ${activeTab === 'personalSubmissions' ? 'active' : ''}`}
                    onClick={() => handleTabClick('personalSubmissions')}
                >
                    Personal Submissions
                </button>
            </div>
            {activeTab === 'overview' && !selectedProblem && (
                <div className="participate-contest__problems-container">
                    <table className="participate-contest__problems">
                        <thead>
                            <tr>
                                <th>Serial Number</th>
                                <th>Problem Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contestDetails.problems.map((problem, index) => (
                                <tr key={problem.pid} onClick={() => handleProblemClick(problem)}>
                                    <td>{index + 1}</td>
                                    <td>{(problem.type === "CF" && problem.aliasName) ? problem.aliasName : problem.title}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {activeTab === 'rank' && !selectedProblem && (
                <Leaderboard contestId={contestId} />
            )}
            {activeTab === 'personalSubmissions' && !selectedProblem && (
                <ContestSubmissionView contestId={contestId} username={username} />
            )}
            {activeTab === 'problemDetails' && selectedProblem?.type === 'CF' && (
                <ProblemDetails problem={selectedProblem} username={username} contestId={contestId} />
            )}
            {activeTab === 'customProblemDetails' && selectedProblem?.type === 'CS' && (
                <CustomProblemDetails problem={selectedProblem} username={username} contestId={contestId} />
            )}
        </div>
    );
};

export default ParticipateContest;
