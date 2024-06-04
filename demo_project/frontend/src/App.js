// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import ProblemSetPage from './components/ProblemSetPage';
import ProblemDetails from './components/ProblemDetails'; // Import ProblemDetails
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/problemset" element={<ProblemSetPage />} />
          <Route path="/problem/:id" element={<ProblemDetails />} /> {/* Add route for ProblemDetails */}
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
