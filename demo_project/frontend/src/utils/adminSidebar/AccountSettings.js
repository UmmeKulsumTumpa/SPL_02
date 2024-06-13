import React, { useState } from 'react';
import axios from 'axios';
import '../contestantSidebar/styles/AccountSettings.css'

const AccountSettings = ({ admin }) => {
    const { username } = admin;
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [showModal, setShowModal] = useState(false);

    const handlePasswordChange = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setMessage('New passwords do not match.');
            setShowModal(true);
            return;
        }

        try {
            const response = await axios.post(`http://localhost:8000/api/admin/update/password/${username}`, {
                currentPassword,
                newPassword
            });

            if (response.data.success) {
                setMessage('Password changed successfully.');
                setShowModal(true);
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                setMessage(response.data.message || 'Error changing password.');
                setShowModal(true);
            }
        } catch (error) {
            setMessage('Error changing password. Please try again.');
            setShowModal(true);
        }
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <div className="account-settings">
            <h1 className="account-settings__heading">Account Settings</h1>
            <form className="account-settings__form" onSubmit={handlePasswordChange}>
                <div className="account-settings__form-group">
                    <label htmlFor="currentPassword">Current Password</label>
                    <input
                        type="password"
                        id="currentPassword"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="account-settings__form-group">
                    <label htmlFor="newPassword">New Password</label>
                    <input
                        type="password"
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="account-settings__form-group">
                    <label htmlFor="confirmPassword">Confirm New Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="account-settings__btn-submit">Change Password</button>
            </form>
            {showModal && (
                <div className="account-settings__modal">
                    <div className="account-settings__modal-content">
                        <span className="account-settings__modal-close" onClick={closeModal}>&times;</span>
                        <p>{message}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AccountSettings;
