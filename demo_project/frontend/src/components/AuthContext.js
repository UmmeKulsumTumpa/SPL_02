import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [username, setUsername] = useState('');
    const [role, setRole] = useState(''); // Initialize with an empty string

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        const storedRole = localStorage.getItem('role');
        if (storedUsername) {
            setUsername(storedUsername);
        }
        if (storedRole) {
            setRole(storedRole);
        }
    }, []);

    const login = async (newUsername, newRole) => {
        setUsername(newUsername);
        setRole(newRole);
        localStorage.setItem('username', newUsername);
        localStorage.setItem('role', newRole);
        window.location.href = `/${newRole}/dashboard`;
    };

    const logout = () => {
        setUsername('');
        setRole(''); // Set role to an empty string on logout
        localStorage.removeItem('username');
        localStorage.removeItem('role');
        window.location.href = '/';
    };

    return (
        <AuthContext.Provider value={{ username, role, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
