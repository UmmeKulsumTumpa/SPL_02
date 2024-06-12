import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import '../styles/Header.css';
import CSlogo from '../images/CSlogo.png';
import IITlogo from '../images/iit.png';

function Header() {
    const { username, role, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const handleRegister = () => {
        navigate('/register', { state: { from: location.pathname } });
    };

    const handleUsernameClick = () => {
        navigate('/dashboard'); // Adjust the route as per your application
    };

    return (
        <div className="header-container">
            <nav className="header-nav">
                <img src={CSlogo} alt="CS Logo" className="header-logo left" />
                <ul className="header-nav-links">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/contest">Contest</Link></li>
                    <li><Link to="/problemset">Problem Set</Link></li>
                    <li><Link to="/blog">Blog</Link></li>
                </ul>
                <div className="header-login-section">
                    {username ? (
                        <div className="header-user">
                            <button className="header-link-button" onClick={handleUsernameClick}>{username}</button>
                            <button className="header-link-button logout" onClick={logout}>Logout</button>
                        </div>
                    ) : (
                        <div className="header-auth-buttons">
                            <Link className="header-link-button" to="/login">Login</Link>
                            <Link className="header-link-button register" to="/register">Register</Link>
                        </div>
                    )}
                </div>
                <img src={IITlogo} alt="IIT Logo" className="header-logo right" />
            </nav>
            <marquee className="marquee-text">CodeSphere: Competitive Programming & Learning based platform</marquee>
        </div>
    );
}

export default Header;
