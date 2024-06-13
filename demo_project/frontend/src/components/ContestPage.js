import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    formatDateTime,
    calculateLength,
    filterContestsByStatus,
    calculateCountdown,
} from '../utils/contestPage';
import '../styles/ContestPage.css';
import { AuthContext } from './AuthContext';
import LoginPrompt from './LoginPrompt';
import ErrorDialog from './ErrorDialog';

const ContestPage = () => {
    const { username } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('upcoming');
    const [searchValue, setSearchValue] = useState('');
    const [contestData, setContestData] = useState([]);
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);
    const [showErrorDialog, setShowErrorDialog] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();
    const location = useLocation();
    const contestsPerPage = 10;

    useEffect(() => {
        // Restore state from URL parameters if available
        const params = new URLSearchParams(location.search);
        const tab = params.get('tab');
        const page = params.get('page');

        if (tab) setActiveTab(tab);
        if (page) setCurrentPage(Number(page));

        // Fetch contest data from the backend API
        const fetchContestData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/approved_contest');
                const sortedData = response.data.sort((a, b) => {
                    const aNum = parseInt(a.acid.replace(/\D/g, ''), 10);
                    const bNum = parseInt(b.acid.replace(/\D/g, ''), 10);
                    return bNum - aNum;
                });
                setContestData(sortedData);
            } catch (error) {
                console.error('Error fetching contest data:', error);
            }
        };

        fetchContestData();
    }, [location]);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        setCurrentPage(1);
        navigate(`?tab=${tab}&page=1`);
    };

    const handleSearch = (e) => {
        setSearchValue(e.target.value);
        setCurrentPage(1); // Reset to first page on search
    };

    const checkIfAdmin = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/admin/checkUserExist/${username}`);
            return response.data.exists;
        } catch (error) {
            console.error('Error checking if user is admin:', error);
            return false;
        }
    };

    const navigateToCreateContest = async () => {
        if (username) {
            const isAdmin = await checkIfAdmin();
            if (isAdmin) {
                setErrorMessage('Admins cannot create contests. Please contact support if you need assistance.');
                setShowErrorDialog(true);
            } else {
                navigate('/create-contest');
            }
        } else {
            setShowLoginPrompt(true);
        }
    };

    const handleParticipateClick = (contestId) => {
        if (username) {
            navigate(`/participate/${contestId}/${username}`);
        } else {
            setShowLoginPrompt(true);
        }
    };

    const renderContestList = (contests, status) => {
        const currentTime = new Date();
        const filteredContestData = filterContestsByStatus(contests, currentTime, status).filter(contest =>
            contest.title.toLowerCase().includes(searchValue.toLowerCase())
        );

        const totalPages = Math.ceil(filteredContestData.length / contestsPerPage);
        const indexOfLastContest = currentPage * contestsPerPage;
        const indexOfFirstContest = indexOfLastContest - contestsPerPage;
        const currentContests = filteredContestData.slice(indexOfFirstContest, indexOfLastContest);

        return (
            <div className="contest-page-list">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Begin Time</th>
                            <th>Length</th>
                            <th>Owner</th>
                            {status === 'upcoming' && <th>Countdown</th>}
                            {status === 'running' && <th>Action</th>}
                            {status === 'previous' && <th>View</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {currentContests.map((contest) => (
                            <tr key={contest.acid}>
                                <td>{contest.acid}</td>
                                <td>{contest.title}</td>
                                <td>{formatDateTime(contest.startTime)}</td>
                                <td>{calculateLength(contest.startTime, contest.endTime)}</td>
                                <td>{contest.author.authorName}</td>
                                {status === 'upcoming' && <td>{calculateCountdown(contest.startTime)}</td>}
                                {status === 'running' && (
                                    <td>
                                        <button onClick={() => handleParticipateClick(contest.acid)}>
                                            Participate
                                        </button>
                                    </td>
                                )}
                                {status === 'previous' && (
                                    <td>
                                        <button onClick={() => navigate(`/view_contest/${contest.acid}/${username}`)}>
                                            View
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="pagination">
                    <button
                        onClick={() => {
                            setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
                            navigate(`?tab=${activeTab}&page=${Math.max(currentPage - 1, 1)}`);
                        }}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <button
                        onClick={() => {
                            setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages));
                            navigate(`?tab=${activeTab}&page=${Math.min(currentPage + 1, totalPages)}`);
                        }}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="contest-page-container">
            <div className="contest-page-header">
                <div className="contest-page-tabs">
                    <button
                        className={`contest-page-tab ${activeTab === 'upcoming' ? 'active' : ''}`}
                        onClick={() => handleTabClick('upcoming')}
                    >
                        Upcoming Contests
                    </button>
                    <button
                        className={`contest-page-tab ${activeTab === 'running' ? 'active' : ''}`}
                        onClick={() => handleTabClick('running')}
                    >
                        Running Contests
                    </button>
                    <button
                        className={`contest-page-tab ${activeTab === 'previous' ? 'active' : ''}`}
                        onClick={() => handleTabClick('previous')}
                    >
                        Previous Contests
                    </button>
                </div>
                <div className="contest-page-search">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchValue}
                        onChange={handleSearch}
                    />
                </div>
                <div className="contest-create-button">
                    <button onClick={navigateToCreateContest}>
                        Create Contest
                    </button>
                </div>
            </div>
            {activeTab === 'upcoming' && renderContestList(contestData, 'upcoming')}
            {activeTab === 'running' && renderContestList(contestData, 'running')}
            {activeTab === 'previous' && renderContestList(contestData, 'previous')}
            {showLoginPrompt && <LoginPrompt onClose={() => setShowLoginPrompt(false)} />}
            {showErrorDialog && (
                <ErrorDialog
                    message={errorMessage}
                    onClose={() => setShowErrorDialog(false)}
                />
            )}
        </div>
    );
};

export default ContestPage;
