import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/LoginPrompt.css';

function LoginPrompt({ onClose }) {
    return (
        <div className="login-prompt-overlay">
            <div className="login-prompt-modal">
                <button className="close-button" onClick={onClose}>×</button>
                <div className="login-prompt-content">
                    <h2>Please Log In</h2>
                    <p>You need to be logged in to submit a solution.</p>
                    <div className="login-prompt-buttons">
                        <Link to="/login" className="login-link">
                            Log In
                        </Link>
                        <Link to="/register" className="register-link">
                            Register
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPrompt;
