import React from 'react';

export const Profile = ({ admin }) => (
    <div className="profile-container">
        <p>Name: {admin.name}</p>
        <p>Email: {admin.email}</p>
        <p>Role: {admin.role}</p>
    </div>
);

export const Settings = () => (
    <div className="settings-container">
        <h2>Settings</h2>
        <p>Update Email</p>
        <p>Change Password</p>
    </div>
);

export const Blog = () => (
    <div className="blog-container">
        <h2>Blog</h2>
        <p>Manage Blog Entries</p>
    </div>
);

export const Team = () => (
    <div className="team-container">
        <h2>Team</h2>
        <p>Manage Teams</p>
    </div>
);

export const Submissions = () => (
    <div className="submissions-container">
        <h2>Submissions</h2>
        <p>View Submissions</p>
    </div>
);

export const Contests = () => (
    <div className="contests-container">
        <h2>Contests</h2>
        <p>Manage Contests</p>
    </div>
);
