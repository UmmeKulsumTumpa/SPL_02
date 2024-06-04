import React, { useState } from 'react';
import axios from 'axios';
import '../styles/AdminRegistrationPage.css';

function AdminRegistrationPage() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        pinCode: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        try {
            const response = await axios.post('/api/admin/add', formData);
            console.log(response.data);
            // Redirect or display success message
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="register-container">
            <h2>Admin Sign Up</h2>
            <form onSubmit={handleSubmit}>
                <label>Username</label>
                <input 
                    type="text" 
                    name="username" 
                    placeholder="Enter a username..." 
                    value={formData.username} 
                    onChange={handleChange} 
                    required 
                />
                <label>Email address</label>
                <input 
                    type="email" 
                    name="email" 
                    placeholder="Enter your email address..." 
                    value={formData.email} 
                    onChange={handleChange} 
                    required 
                />
                <label>Pin Code</label>
                <input 
                    type="text" 
                    name="pinCode" 
                    placeholder="Enter your pin code..." 
                    value={formData.pinCode} 
                    onChange={handleChange} 
                    required 
                />
                <label>Password</label>
                <input 
                    type="password" 
                    name="password" 
                    placeholder="Enter your password..." 
                    value={formData.password} 
                    onChange={handleChange} 
                    required 
                />
                <label>Confirm Password</label>
                <input 
                    type="password" 
                    name="confirmPassword" 
                    placeholder="Enter your password again..." 
                    value={formData.confirmPassword} 
                    onChange={handleChange} 
                    required 
                />
                <button type="submit">Sign up</button>
            </form>
        </div>
    );
}

export default AdminRegistrationPage;
