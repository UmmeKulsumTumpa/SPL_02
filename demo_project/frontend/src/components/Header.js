import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import '../styles/Header.css';

function Header() {
    const { username, role, logout } = useContext(AuthContext);

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
                            {/* <Link to={`/${role}/dashboard`}>Dashboard</Link> */}
                            <button onClick={logout}>Logout</button>
                        </div>
                    ) : (
                        <div>
                            <Link to="/login">Login</Link>
                            <Link to="/register">Register</Link>
                        </div>
                    )}
                </div>
            </nav>
        </header>
    );
}

export default Header;
