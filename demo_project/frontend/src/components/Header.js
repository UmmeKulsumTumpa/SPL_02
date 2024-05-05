import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const storedLogin = localStorage.getItem('isLoggedIn');
    const storedUsername = localStorage.getItem('username');
    if (storedLogin) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    setUsername('');
  };

  return (
    <header className="header">
      <nav className="nav">
        <ul className="nav-links">
          <li>
            <Link to="/home">Home</Link>
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
          {isLoggedIn ? (
            <div>
              <span>Welcome, {username}</span>
              <button onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <Link to="/">Login</Link>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;