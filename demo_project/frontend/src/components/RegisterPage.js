import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserTie, faUserGraduate } from '@fortawesome/free-solid-svg-icons';
import '../styles/RegisterPage.css'; // Import the CSS file

const RegisterPage = () => {
    return (
        <div className="registration-page">
            <h2 className="registration-heading">Select Your Role</h2>
            <div className="button-container">
                <Link to="/register/admin" className="registration-link">
                    <button className="registration-button">
                        <FontAwesomeIcon icon={faUserTie} className="icon" />
                        Admin
                    </button>
                </Link>
                <Link to="/register/contestant" className="registration-link">
                    <button className="registration-button">
                        <FontAwesomeIcon icon={faUserGraduate} className="icon" />
                        Contestant
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default RegisterPage;
