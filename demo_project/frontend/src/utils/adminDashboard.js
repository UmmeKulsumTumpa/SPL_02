import React from 'react';
import ManageContest from './adminSidebar/manageContest';

export const Profile = ({ admin }) => (
    <div className="adminDashboard-profile-container">
        <p>Name: {admin.name}</p>
        <p>Email: {admin.email}</p>
        <p>Role: {admin.role}</p>
    </div>
);

export const Settings = () => (
    <div className="adminDashboard-settings-container">
        <h2>Settings</h2>
        <p>Update Email</p>
        <p>Change Password</p>
    </div>
);

export const Blog = () => (
    <div className="adminDashboard-blog-container">
        <h2>Blog</h2>
        <p>Manage Blog Entries</p>
    </div>
);

export const Team = () => (
    <div className="adminDashboard-team-container">
        <h2>Team</h2>
        <p>Manage Teams</p>
    </div>
);

export const Submissions = () => (
    <div className="adminDashboard-submissions-container">
        <h2>Submissions</h2>
        <p>View Submissions</p>
    </div>
);

export const Contests = () => (
    <div className="adminDashboard-contests-container">
        <ManageContest />
    </div>
);
