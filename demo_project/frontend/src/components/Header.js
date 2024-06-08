import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import '../styles/Header.css';

function Header() {
    const { username, role, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const handleRegister = () => {
        navigate('/register', { state: { from: location.pathname } });
    };

    return (
        <div className="header-container">
            <nav className="header-nav">
                <ul className="header-nav-links">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/contest">Contest</Link></li>
                    <li><Link to="/problemset">Problem Set</Link></li>
                    <li><Link to="/blog">Blog</Link></li>
                </ul>
                <div className="header-login-section">
                    {username ? (
                        <div className="header-user">
                            <Link className="header-link" to={`/${role}/dashboard`}>{username}</Link>
                            <span className="header-separator">|</span>
                            <button className="header-link-button" onClick={logout}>Logout</button>
                        </div>
                    ) : (
                        <div className="header-auth-buttons">
                            <Link className="header-link" to="/login">Login</Link>
                            <span className="header-separator">|</span>
                            <button className="header-link-button" onClick={handleRegister}>Register</button>
                        </div>
                    )}
                </div>
            </nav>
        </div>
    );
}

export default Header;
