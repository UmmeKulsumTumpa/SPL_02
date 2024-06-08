import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/CreateContestPage.css';

const CreateContestPage = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [problems, setProblems] = useState([]);
    const navigate = useNavigate();

    const handleAddProblem = () => {
        setProblems([...problems, { pid: '', title: '', statement: '', constraints: '', testCase: '' }]);
    };

    const handleProblemChange = (index, field, value) => {
        const newProblems = problems.slice();
        newProblems[index][field] = value;
        setProblems(newProblems);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8000/api/contest/create', {
                title,
                description,
                startTime,
                endTime,
                problems,
            });
            navigate('/contest');
        } catch (error) {
            console.error('Error creating contest:', error);
        }
    };

    return (
        <div className="create-contest-container">
            <h2>Create Contest</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    ></textarea>
                </div>
                <div className="form-group">
                    <label>Start Time</label>
                    <input
                        type="datetime-local"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>End Time</label>
                    <input
                        type="datetime-local"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Problems</label>
                    <button type="button" onClick={handleAddProblem}>
                        Add Problem
                    </button>
                    {problems.map((problem, index) => (
                        <div key={index} className="problem-entry">
                            <input
                                type="text"
                                placeholder="Title"
                                value={problem.title}
                                onChange={(e) => handleProblemChange(index, 'title', e.target.value)}
                                required
                            />
                            <textarea
                                placeholder="Statement"
                                value={problem.statement}
                                onChange={(e) => handleProblemChange(index, 'statement', e.target.value)}
                                required
                            ></textarea>
                            <textarea
                                placeholder="Constraints"
                                value={problem.constraints}
                                onChange={(e) => handleProblemChange(index, 'constraints', e.target.value)}
                                required
                            ></textarea>
                            <textarea
                                placeholder="Test Case"
                                value={problem.testCase}
                                onChange={(e) => handleProblemChange(index, 'testCase', e.target.value)}
                                required
                            ></textarea>
                        </div>
                    ))}
                </div>
                <button type="submit">Create Contest</button>
            </form>
        </div>
    );
};

export default CreateContestPage;
