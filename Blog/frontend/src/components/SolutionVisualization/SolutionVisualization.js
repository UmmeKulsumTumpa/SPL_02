import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // Import Link

const SolutionVisualization = () => {
    const [solutionId, setSolutionId] = useState('');
    const [testCase, setTestCase] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Call backend API to create CFG and then navigate to the CFG view
        axios.post('/api/solutions/visualize', { solutionId, testCase })
            .then(response => {
                navigate('/cfg', { state: { cfgData: response.data } });
            })
            .catch(error => {
                console.error('There was an error visualizing the solution!', error);
            });
    };

    return (
        <div className="solution-visualization">
            <h2>Solution Visualization</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Enter Solution ID</label>
                    <input 
                        type="text" 
                        value={solutionId} 
                        onChange={(e) => setSolutionId(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>Enter Test Case</label>
                    <input 
                        type="text" 
                        value={testCase} 
                        onChange={(e) => setTestCase(e.target.value)} 
                        required 
                    />
                </div>
                <button type="submit" className="btn">Create CFG</button>
            </form>
            <Link to="/" className="btn btn-back">Back</Link>
            <Link to="/logout" className="btn btn-logout">Logout</Link>
        </div>
    );
};

export default SolutionVisualization;
