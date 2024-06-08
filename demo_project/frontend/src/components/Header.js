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
        <header className="header">
            <nav className="nav">
                <ul className="nav-links">
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="#">Contest</Link>
                    </li>
                    <li>
                        <Link to="/problemset">Problem Set</Link>
                    </li>
                    <li>
                        <Link to="#">Blog</Link>
                    </li>
                </ul>
                <div className="login-section">
                    {username ? (
                        <div>
                            <span><Link to={`/${role}/dashboard`}>{username}</Link></span>
                            <button onClick={logout}>Logout</button>
                        </div>
                    ) : (
                        <div>
                            <Link to="/login">Login</Link>
                            <button onClick={handleRegister}>Register</button>
                        </div>
                    )}
                </div>
            </nav>
        </header>
    );
}

export default Header;
