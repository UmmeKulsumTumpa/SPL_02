import React from 'react';
import '../styles/ErrorDialog.css';

const ErrorDialog = ({ message, onClose }) => {
    return (
        <div className="error-dialog-overlay">
            <div className="error-dialog-container">
                <div className="error-dialog-icon">❌</div>
                <div className="error-dialog-message">{message}</div>
                <button className="error-dialog-button" onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default ErrorDialog;
