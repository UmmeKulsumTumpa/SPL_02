import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from './AuthContext';
import axios from 'axios';
import '../styles/ContestantDashboard.css';

const ContestantDashboard = () => {
    const { username } = useContext(AuthContext);
    const [contestant, setContestant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchContestantData = async () => {
            if (!username) {
                setError("Username is not available");
                setLoading(false);
                return;
            }

            try {
                console.log("Fetching data for username:", username);
                const response = await axios.get(`http://localhost:8000/api/contestants/username/${username}`);
                console.log("Response data:", response.data);
                if (response.data) {
                    setContestant(response.data);
                    setError(null); // Clear any previous errors
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

    useEffect(() => {
        console.log("Updated contestant state:", contestant);
    }, [contestant]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!contestant) {
        return <div>No contestant data available</div>;
    }

    return (
        <div className="dashboard-container">
            <div className="contestant-info">
                <h2 className="username">{contestant.username}</h2>
                <p className="email">Email: {contestant.email}</p>
            </div>
            <div className="contestant-actions">
                <button>My friends</button>
                <button>Change settings</button>
                <button>Start your own blog</button>
                <button>View my talks</button>
            </div>
            <div className="activity-summary">
                <h3>Activity Summary</h3>
                <div className="activity-graph">
                    {/* Placeholder for activity graph */}
                </div>
                <div className="activity-details">
                    {/* Activity details placeholders */}
                </div>
            </div>
        </div>
    );
};

export default ContestantDashboard;
