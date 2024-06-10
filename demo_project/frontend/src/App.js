import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faHome, faFileAlt, faEnvelope, faBell, faMapMarkerAlt, faChartPie, faUser } from '@fortawesome/free-solid-svg-icons';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import AdminRegistrationPage from './components/AdminRegistrationPage';
import ContestantRegistrationPage from './components/ContestantRegistrationPage';
import ProblemSetPage from './components/ProblemSetPage';
import ProblemDetails from './components/ProblemDetails';
import Header from './components/Header';
import Footer from './components/Footer';
import ContestantDashboard from './components/ContestantDashboard';
import AdminDashboard from './components/AdminDashboard';
import ContestPage from './components/ContestPage';
import ViewContestDetails from './components/contest/ViewContestDetails';
import CreateContestPage from './components/CreateContestPage';
import ParticipateContest from './components/contest/ParticipateContest';
import { AuthProvider } from './components/AuthContext';

library.add(faHome, faFileAlt, faEnvelope, faBell, faMapMarkerAlt, faChartPie, faUser);

function App() {
    return (
        <AuthProvider>
            <Router>
                <div>
                    <Header />
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/register/admin" element={<AdminRegistrationPage />} />
                        <Route path="/register/contestant" element={<ContestantRegistrationPage />} />
                        <Route path="/problemset" element={<ProblemSetPage />} />
                        <Route path="/problem/:id" element={<ProblemDetails />} />
                        <Route path="/contestant/dashboard" element={<ContestantDashboard />} />
                        <Route path="/admin/dashboard" element={<AdminDashboard />} />
                        <Route path="/contest" element={<ContestPage />} />
                        <Route path="/create-contest" element={<CreateContestPage />} />
                        <Route path="/contest/:contestId" element={<ViewContestDetails />} />
                        <Route path="/participate/:contestId/:username" element={<ParticipateContest/>} />
                    </Routes>
                    <Footer />
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
