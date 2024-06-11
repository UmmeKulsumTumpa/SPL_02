// utils/contestantDashboard.js
import React from 'react';
import SubmissionView from './contestantSidebar/SubmissionView';
import ContestDashboard from './contestantSidebar/ContestDashboard';

export const Profile = ({ contestant }) => (
    <div className="profile-container">
        <p>Rating: {contestant.rating}</p>
        <p>Total Solved Problems: {contestant.solvedProblems}</p>
        <p>Total Attempted Problems: {contestant.attemptedProblems}</p>
        <p>Blog Contributions: {contestant.blogContributions}</p>
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
        <p>Blog Entries</p>
    </div>
);

export const Team = () => (
    <div className="team-container">
        <h2>Team</h2>
        <p>Team Name</p>
        <p>Team Members</p>
    </div>
);

export const Submissions = ({ contestant }) => (
    <div className="submissions-container">
        <SubmissionView contestant={contestant} />
    </div>
);

export const Contests = ({contestant}) => (
    <div className="contests-container">
        <ContestDashboard contestant={contestant} />
    </div>
);
