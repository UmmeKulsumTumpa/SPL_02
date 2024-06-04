import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/RegisterPage.css'; // Import the CSS file

const RegisterPage = () => {
    return (
        <div className="registration-page">
            <h2 className="registration-heading">Register as:</h2>
            <div className="button-container">
                <Link to="/register/admin" className="registration-link">
                    <button className="registration-button">
                        <i className="fas fa-user-tie"></i> Admin
                    </button>
                </Link>
                <Link to="/register/contestant" className="registration-link">
                    <button className="registration-button">
                        <i className="fas fa-user-graduate"></i> Contestant
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default RegisterPage;