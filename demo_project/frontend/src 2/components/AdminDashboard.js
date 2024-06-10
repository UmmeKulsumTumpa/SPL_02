// AdminDashboard.js

import React, { useEffect, useState, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faFileAlt, faEnvelope, faBell, faMapMarkerAlt, faChartPie, faUser } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from './AuthContext';
import axios from 'axios';
import '../styles/AdminDashboard.css';
import { Profile, Settings, Blog, Team, Submissions, Contests } from '../utils/adminDashboard';

const AdminDashboard = () => {
    const { username } = useContext(AuthContext);
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('profile');

    useEffect(() => {
        const fetchAdminData = async () => {
            if (!username) {
                setError("Username is not available");
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`http://localhost:8000/api/admin/${username}`);
                if (response.data) {
                    setAdmin(response.data);
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

        fetchAdminData();
    }, [username]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!admin) {
        return <div>No admin data available</div>;
    }

    const renderActiveTab = () => {
        switch (activeTab) {
            case 'profile':
                return <Profile admin={admin} />;
            case 'settings':
                return <Settings />;
            case 'blog':
                return <Blog />;
            case 'team':
                return <Team />;
            case 'submissions':
                return <Submissions />;
            case 'contests':
                return <Contests admin={admin}/>;
            default:
                return <Profile admin={admin} />;
        }
    };

    return (
        <div className="admin-dashboard-container">
            <div className="admin-dashboard-sidebar">
                <div className="admin-dashboard-profile-section">
                    <div className="admin-dashboard-profile-icon">
                        <FontAwesomeIcon icon={faUser} size="3x" />
                    </div>
                    <h2 className="admin-dashboard-username">{admin.username}</h2>
                    <p className="admin-dashboard-email">{admin.email}</p>
                </div>
                <button className="admin-dashboard-button admin-dashboard-profile-button" onClick={() => setActiveTab('profile')}>
                    <FontAwesomeIcon icon={faHome} className="admin-dashboard-icon" />
                    <span className="admin-dashboard-span">Profile</span>
                </button>
                <button className="admin-dashboard-button admin-dashboard-settings-button" onClick={() => setActiveTab('settings')}>
                    <FontAwesomeIcon icon={faFileAlt} className="admin-dashboard-icon" />
                    <span className="admin-dashboard-span">Settings</span>
                </button>
                <button className="admin-dashboard-button admin-dashboard-blog-button" onClick={() => setActiveTab('blog')}>
                    <FontAwesomeIcon icon={faEnvelope} className="admin-dashboard-icon" />
                    <span className="admin-dashboard-span">Blog</span>
                </button>
                <button className="admin-dashboard-button admin-dashboard-team-button" onClick={() => setActiveTab('team')}>
                    <FontAwesomeIcon icon={faBell} className="admin-dashboard-icon" />
                    <span className="admin-dashboard-span">Team</span>
                </button>
                <button className="admin-dashboard-button admin-dashboard-submissions-button" onClick={() => setActiveTab('submissions')}>
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="admin-dashboard-icon" />
                    <span className="admin-dashboard-span">Submissions</span>
                </button>
                <button className="admin-dashboard-button admin-dashboard-contests-button" onClick={() => setActiveTab('contests')}>
                    <FontAwesomeIcon icon={faChartPie} className="admin-dashboard-icon" />
                    <span className="admin-dashboard-span">Manage Contest</span>
                </button>
            </div>
            <div className="admin-dashboard-content">
                {renderActiveTab()}
            </div>
        </div>
    );
};

export default AdminDashboard;
