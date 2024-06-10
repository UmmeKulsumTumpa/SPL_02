import React, { useState, useContext } from 'react';
import axios from 'axios';
import '../styles/LoginPage.css';
import { AuthContext } from './AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import { forgetPassword } from '../utils/forgetPasswordHandle';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/api/auth/login', {
                username,
                password,
            });
            console.log('Response data:', response.data);
            if (response.data.success) {
                await login(username, response.data.role);
            } else {
                setError('Invalid username or password');
            }
        } catch (err) {
            setError('An error occurred during login');
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleLogin} className="login-form">
                <h1 className="login-title">User Login</h1>
                {error && <p className="error-message">{error}</p>}
                <div className="input-container">
                    <FontAwesomeIcon icon={faUser} className="icon user-icon" />
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="input-container">
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <FontAwesomeIcon icon={faLock} className="icon lock-icon" />
                </div>
                <div className="forget-password" onClick={forgetPassword}>
                    Forget Password?
                </div>
                <button type="submit" className="login-button">Login</button>
            </form>
        </div>
    );
}

export default LoginPage;
