import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/ContestPage.css';

const ContestPage = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [searchValue, setSearchValue] = useState('');
    const [contestData, setContestData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch contest data from the backend API
        const fetchContestData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/contest');
                setContestData(response.data);
            } catch (error) {
                console.error('Error fetching contest data:', error);
            }
        };

        fetchContestData();
    }, []);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const handleSearch = (e) => {
        setSearchValue(e.target.value);
    };

    const navigateToCreateContest = () => {
        navigate('/create-contest');
    };

    const renderContestList = () => {
        // Filter the contest data based on the search value
        const filteredContestData = contestData.filter((contest) =>
            contest.title.toLowerCase().includes(searchValue.toLowerCase())
        );

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
                        </tr>
                    </thead>
                    <tbody>
                        {filteredContestData.map((contest) => (
                            <tr key={contest.cid}>
                                <td>{contest.cid}</td>
                                <td>{contest.title}</td>
                                <td>{contest.startTime}</td>
                                <td>{contest.length}</td>
                                <td>{contest.owner}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="contest-page-container">
            <div className="contest-page-header">
                <div className="contest-page-tabs">
                    <button
                        className={`contest-page-tab ${activeTab === 'all' ? 'active' : ''}`}
                        onClick={() => handleTabClick('all')}
                    >
                        All
                    </button>
                    <button
                        className={`contest-page-tab ${activeTab === 'created-contests' ? 'active' : ''}`}
                        onClick={() => handleTabClick('created-contests')}
                    >
                        Created Contests
                    </button>
                    <button
                        className={`contest-page-tab ${activeTab === 'participated-contests' ? 'active' : ''}`}
                        onClick={() => handleTabClick('participated-contests')}
                    >
                        Participated Contests
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
            {renderContestList()}
        </div>
    );
};

export default ContestPage;
