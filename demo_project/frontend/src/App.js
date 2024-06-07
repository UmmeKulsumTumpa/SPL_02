import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import { AuthProvider } from './components/AuthContext';

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
                        <Route path='/contestant/dashboard' element={<ContestantDashboard/>} />
                    </Routes>
                    <Footer />
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
