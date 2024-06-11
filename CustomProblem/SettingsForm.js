// SettingsForm.js
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import '../styles/SettingsForm.css';

const SettingsForm = () => {
    const { username } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    
    const handleSaveChanges = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
        setError("Passwords do not match");
        return;
    }
    try {
        const response = await axios.put(`http://localhost:8000/api/contestants/update/${username}`, {
            email,
            oldPassword,
            newPassword,
        });
        setSuccess("Profile updated successfully");
        setError(null);
    } catch (err) {
        setError(err.response.data.error || "An error occurred");
        setSuccess(null);
    }
};

    return (
        <div className="settings-form-container">
            <h2>Settings</h2>
            <form onSubmit={handleSaveChanges}>
                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Old Password:</label>
                    <input
                        type="password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>New Password:</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Confirm Password:</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}
                <button type="submit">Save Changes</button>
            </form>
        </div>
    );
};

export default SettingsForm;
