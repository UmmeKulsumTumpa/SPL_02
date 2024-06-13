import React from 'react';
import '../styles/SuccessDialog.css';

const SuccessDialog = ({ message, onClose }) => {
    return (
        <div className="success-dialog-overlay">
            <div className="success-dialog-container">
                <div className="success-dialog-icon">✔️</div>
                <div className="success-dialog-message">{message}</div>
                <button className="success-dialog-button" onClick={onClose}>OK</button>
            </div>
        </div>
    );
};

export default SuccessDialog;
