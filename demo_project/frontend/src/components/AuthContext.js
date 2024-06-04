// AuthContext.js
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [username, setUsername] = useState(''); // Initialize with an empty string

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    const login = (newUsername) => {
        setUsername(newUsername);
        localStorage.setItem('username', newUsername);
    };

    const logout = () => {
        setUsername(''); // Set username to an empty string on logout
        localStorage.removeItem('username');
    };

    return (
        <AuthContext.Provider value={{ username, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};