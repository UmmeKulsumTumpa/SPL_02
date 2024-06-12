// ContestantDashboard.js

import React, { useEffect, useState, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faFileAlt, faEnvelope, faBell, faMapMarkerAlt, faChartPie, faUser } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from './AuthContext';
import axios from 'axios';
import '../styles/ContestantDashboard.css';
import { Profile, Settings, Blog, Team, Submissions, Contests } from '../utils/contestantDashboard';

const ContestantDashboard = () => {
    const { username } = useContext(AuthContext);
    const [contestant, setContestant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('profile');

    useEffect(() => {
        const fetchContestantData = async () => {
            if (!username) {
                setError("Username is not available");
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`http://localhost:8000/api/contestants/username/${username}`);
                if (response.data) {
                    setContestant(response.data);
                    setError(null);
                } else {
                    setError("Username not found");
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchContestantData();
    }, [username]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!contestant) {
        return <div>No contestant data available</div>;
    }

    const renderActiveTab = () => {
        switch (activeTab) {
            case 'profile':
                return <Profile contestant={contestant} />;
            case 'settings':
                return <Settings contestant={contestant} />;
            case 'submissions':
                return <Submissions contestant={contestant} />;
            case 'contests':
                return <Contests contestant={contestant}/>;
            default:
                return <Profile contestant={contestant} />;
        }
    };

    return (
        <div className="contestant-dashboard-container">
            <div className="contestant-dashboard-sidebar">
                <div className="contestant-dashboard-profile-section">
                    <div className="contestant-dashboard-profile-icon">
                        <FontAwesomeIcon icon={faUser} size="3x" />
                    </div>
                    <h2 className="contestant-dashboard-username">{contestant.username}</h2>
                    <p className="contestant-dashboard-email">{contestant.email}</p>
                </div>
                <button className="contestant-dashboard-button contestant-dashboard-profile-button" onClick={() => setActiveTab('profile')}>
                    <FontAwesomeIcon icon={faHome} className="contestant-dashboard-icon" />
                    <span className="contestant-dashboard-span">Profile</span>
                </button>
                <button className="contestant-dashboard-button contestant-dashboard-settings-button" onClick={() => setActiveTab('settings')}>
                    <FontAwesomeIcon icon={faFileAlt} className="contestant-dashboard-icon" />
                    <span className="contestant-dashboard-span">Settings</span>
                </button>
                <button className="contestant-dashboard-button contestant-dashboard-submissions-button" onClick={() => setActiveTab('submissions')}>
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="contestant-dashboard-icon" />
                    <span className="contestant-dashboard-span">Submissions</span>
                </button>
                <button className="contestant-dashboard-button contestant-dashboard-contests-button" onClick={() => setActiveTab('contests')}>
                    <FontAwesomeIcon icon={faChartPie} className="contestant-dashboard-icon" />
                    <span className="contestant-dashboard-span">Contests</span>
                </button>
            </div>
            <div className="contestant-dashboard-content">
                {renderActiveTab()}
            </div>
        </div>
    );
};

export default ContestantDashboard;
