import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/CreateContestPage.css';
import {
    addProblem,
    updateProblem,
    deleteProblem,
    moveProblem,
    fetchProblemTitle,
    validateField
} from '../utils/createContest';

const CreateContestPage = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [problems, setProblems] = useState([]);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleAddProblem = (type) => {
        setProblems(addProblem(problems, type));
    };

    const handleProblemChange = (index, field, value) => {
        const updatedProblems = updateProblem(problems, index, field, value);
        setProblems(updatedProblems);

        if (field === 'pid' && updatedProblems[index].type === 'oj') {
            fetchProblemTitle(updatedProblems[index].oj, value)
                .then(title => {
                    const updatedProblemsWithTitle = updateProblem(updatedProblems, index, 'title', title);
                    setProblems(updatedProblemsWithTitle);
                })
                .catch(error => {
                    const updatedProblemsWithError = updateProblem(updatedProblems, index, 'title', 'There might occurred some error');
                    setProblems(updatedProblemsWithError);
                });
        }

        // If no PID is given, show "No such problem exists!"
        if (field === 'pid' && !value) {
            const updatedProblemsWithNoPid = updateProblem(updatedProblems, index, 'title', 'No such problem exists!');
            setProblems(updatedProblemsWithNoPid);
        }
    };

    const handleDeleteProblem = (index) => {
        setProblems(deleteProblem(problems, index));
    };

    const handleMoveProblem = (fromIndex, toIndex) => {
        setProblems(moveProblem(problems, fromIndex, toIndex));
    };

    const validateForm = () => {
        let newErrors = {};
        if (!title) newErrors.title = 'Title is required';
        if (!description) newErrors.description = 'Description is required';
        if (!startTime) newErrors.startTime = 'Start time is required';
        if (!endTime) newErrors.endTime = 'End time is required';
        if (problems.length === 0) newErrors.problems = 'At least one problem is required';

        problems.forEach((problem, index) => {
            if (problem.type === 'oj') {
                if (!problem.pid) newErrors[`problem-${index}-pid`] = 'Problem number is required';
                if (!problem.oj) newErrors[`problem-${index}-oj`] = 'OJ is required';
            }
            if (problem.type === 'custom') {
                if (!problem.title) newErrors[`problem-${index}-title`] = 'Title is required';
                if (!problem.statement) newErrors[`problem-${index}-statement`] = 'Statement is required';
                if (!problem.constraints) newErrors[`problem-${index}-constraints`] = 'Constraints are required';
                if (!problem.testCase) newErrors[`problem-${index}-testCase`] = 'Test case is required';
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        // Prepare problems data for the request
        const requestData = problems.map(problem => ({
            type: problem.oj,
            pid: problem.pid
        }));

        try {
            await axios.post('http://localhost:8000/api/contest/create', {
                title,
                description,
                startTime,
                endTime,
                problems: requestData,
            });
            navigate('/contest');
        } catch (error) {
            console.error('Error creating contest:', error);
        }
    };

    return (
        <div className="create-contest-container">
            <h2>Create Contest</h2>
            <form onSubmit={handleSubmit} noValidate>
                <div className="form-group">
                    <label>Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    {errors.title && <span className="error">{errors.title}</span>}
                </div>
                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                    {errors.description && <span className="error">{errors.description}</span>}
                </div>
                <div className="form-group">
                    <label>Start Time</label>
                    <input
                        type="datetime-local"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                    />
                    {errors.startTime && <span className="error">{errors.startTime}</span>}
                </div>
                <div className="form-group">
                    <label>End Time</label>
                    <input
                        type="datetime-local"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                    />
                    {errors.endTime && <span className="error">{errors.endTime}</span>}
                </div>
                <div className="form-group">
                    <label>Problems</label>
                    <button type="button" onClick={() => handleAddProblem('custom')}>
                        Add Custom Problem
                    </button>
                    <button type="button" onClick={() => handleAddProblem('oj')}>
                        Add OJ Problem
                    </button>
                    {errors.problems && <span className="error">{errors.problems}</span>}
                    {problems.map((problem, index) => (
                        <div key={index} className="problem-entry">
                            {problem.type === 'oj' ? (
                                <>
                                    <select
                                        value={problem.oj}
                                        onChange={(e) => handleProblemChange(index, 'oj', e.target.value)}
                                    >
                                        <option value="">Select OJ</option>
                                        <option value="CF">Codeforces</option>
                                        <option value="CS">CodeChef</option>
                                    </select>
                                    {errors[`problem-${index}-oj`] && <span className="error">{errors[`problem-${index}-oj`]}</span>}
                                    <input
                                        type="text"
                                        placeholder="Problem Number"
                                        value={problem.pid}
                                        onChange={(e) => handleProblemChange(index, 'pid', e.target.value)}
                                    />
                                    {errors[`problem-${index}-pid`] && <span className="error">{errors[`problem-${index}-pid`]}</span>}
                                    <input
                                        type="text"
                                        placeholder="Alias"
                                        value={problem.alias}
                                        onChange={(e) => handleProblemChange(index, 'alias', e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Title"
                                        value={problem.title}
                                        readOnly
                                    />
                                </>
                            ) : (
                                <>
                                    <input
                                        type="text"
                                        placeholder="Title"
                                        value={problem.title}
                                        onChange={(e) => handleProblemChange(index, 'title', e.target.value)}
                                    />
                                    {errors[`problem-${index}-title`] && <span className="error">{errors[`problem-${index}-title`]}</span>}
                                    <textarea
                                        placeholder="Statement"
                                        value={problem.statement}
                                        onChange={(e) => handleProblemChange(index, 'statement', e.target.value)}
                                    ></textarea>
                                    {errors[`problem-${index}-statement`] && <span className="error">{errors[`problem-${index}-statement`]}</span>}
                                    <textarea
                                        placeholder="Constraints"
                                        value={problem.constraints}
                                        onChange={(e) => handleProblemChange(index, 'constraints', e.target.value)}
                                    ></textarea>
                                    {errors[`problem-${index}-constraints`] && <span className="error">{errors[`problem-${index}-constraints`]}</span>}
                                    <textarea
                                        placeholder="Test Case"
                                        value={problem.testCase}
                                        onChange={(e) => handleProblemChange(index, 'testCase', e.target.value)}
                                    ></textarea>
                                    {errors[`problem-${index}-testCase`] && <span className="error">{errors[`problem-${index}-testCase`]}</span>}
                                </>
                            )}
                            <div className="problem-actions">
                                <button type="button" onClick={() => handleMoveProblem(index, index - 1)}>↑</button>
                                <button type="button" onClick={() => handleMoveProblem(index, index + 1)}>↓</button>
                                <button type="button" onClick={() => handleDeleteProblem(index)}>×</button>
                            </div>
                        </div>
                    ))}
                </div>
                <button type="submit">Create Contest</button>
            </form>
        </div>
    );
};

export default CreateContestPage;