import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Leaderboard from './LeaderBoard';
import ProblemDetails from './ProblemDetails';
import CustomProblemDetails from './CustomProblemDetails';
import ContestSubmissionView from './ContestSubmissionView';
import SuccessDialog from '../SuccessDialog'
import './styles/ParticipateContest.css';

const ParticipateContest = () => {
    const { contestId, username } = useParams();
    const [contestDetails, setContestDetails] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedProblem, setSelectedProblem] = useState(null);
    const [progress, setProgress] = useState(0);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkIfAdmin = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/admin/checkUserExist/${username}`);
                if (response.data.exists) {
                    setIsAdmin(true);
                    setSuccessMessage('Admins cannot participate in contests. Please contact support if you need assistance.');
                    setShowSuccessDialog(true);
                }
            } catch (error) {
                console.error('Error checking if user is admin:', error);
            }
        };

        checkIfAdmin();
    }, [username]);

    useEffect(() => {
        const fetchContestDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/approved_contest/${contestId}`);
                setContestDetails(response.data);
                updateProgress(response.data.startTime, response.data.endTime);

                // Check if the user is the contest author
                if (response.data.author.authorName === username) {
                    setSuccessMessage('You cannot participate in your own contest.');
                    setShowSuccessDialog(true);
                }
            } catch (error) {
                console.error('Error fetching contest details:', error);
            }
        };

        fetchContestDetails();
    }, [contestId, username]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (contestDetails) {
                updateProgress(contestDetails.startTime, contestDetails.endTime);
                checkContestEndTime(contestDetails.endTime);
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

    const saveProblemsToDatabase = async () => {
        try {
            const problems = contestDetails.problems;
            await axios.post('http://localhost:8000/api/problem/add_contest_problems/${contestId}', { problems });
        } catch (error) {
            console.error('Error saving problems to the database:', error);
        }
    };

    const checkContestEndTime = (endTime) => {
        const currentTime = new Date();
        const end = new Date(endTime);
        if (currentTime >= end && !showSuccessDialog) {
            saveProblemsToDatabase();
            setSuccessMessage('The contest has ended. You will be redirected to the previous page.');
            setShowSuccessDialog(true);
        }
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

    if (isAdmin || (contestDetails && contestDetails.author.authorName === username)) {
        return (
            <>
                {showSuccessDialog && (
                    <SuccessDialog
                        message={successMessage}
                        onClose={() => {
                            setShowSuccessDialog(false);
                            navigate(-1); // Redirect to the previous state
                        }}
                    />
                )}
            </>
        );
    }

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
            {activeTab === 'personalSubmissions' && (
                <ContestSubmissionView contestId={contestId} username={username} />
            )}
            {activeTab === 'problemDetails' && selectedProblem?.type === 'CF' && (
                <ProblemDetails problem={selectedProblem} username={username} contestId={contestId} setActiveTab={setActiveTab} />
            )}
            {activeTab === 'customProblemDetails' && selectedProblem?.type === 'CS' && (
                <CustomProblemDetails problem={selectedProblem} username={username} contestId={contestId} setActiveTab={setActiveTab} />
            )}
            {showSuccessDialog && (
                <SuccessDialog
                    message={successMessage}
                    onClose={() => {
                        setShowSuccessDialog(false);
                        navigate(-1); // Redirect to the previous state
                    }}
                />
            )}
        </div>
    );
};

export default ParticipateContest;
