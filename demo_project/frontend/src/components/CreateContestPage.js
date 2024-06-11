import React, { useState, useContext, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import '../styles/CreateContestPage.css';
import {
    addProblem,
    updateProblem,
    deleteProblem,
    moveProblem,
    fetchProblemTitle,
} from '../utils/createContest';
import CustomProblemForm from './CustomProblemForm';

const CreateContestPage = () => {
    const { username } = useContext(AuthContext);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [problems, setProblems] = useState([]);
    const [errors, setErrors] = useState({});
    const [authorEmail, setAuthorEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const customProblemRefs = useRef([]);

    useEffect(() => {
        const fetchAuthorEmail = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/contestants/username/${username}`);
                setAuthorEmail(response.data.email);
            } catch (error) {
                console.error('Error fetching author email:', error);
                setErrorMessage('Error fetching author email');
            }
        };
        fetchAuthorEmail();
    }, [username]);

    const handleAddProblem = (type) => {
        setProblems(prevProblems => {
            const newProblems = addProblem(prevProblems, type);
            customProblemRefs.current.push(React.createRef());
            return newProblems;
        });
    };

    const handleProblemChange = (index, field, value) => {
        const updatedProblems = updateProblem(problems, index, field, value);
        setProblems(updatedProblems);

        if (field === 'pid' && updatedProblems[index].type === 'CF') {
            fetchProblemTitle(updatedProblems[index].type, value)
                .then(title => {
                    const updatedProblemsWithTitle = updateProblem(updatedProblems, index, 'title', title);
                    setProblems(updatedProblemsWithTitle);
                })
                .catch(error => {
                    const updatedProblemsWithError = updateProblem(updatedProblems, index, 'title', 'There might occurred some error');
                    setProblems(updatedProblemsWithError);
                    setErrorMessage('Error fetching problem title');
                });
        }

        if (field === 'pid' && !value) {
            const updatedProblemsWithNoPid = updateProblem(updatedProblems, index, 'title', 'No such problem exists!');
            setProblems(updatedProblemsWithNoPid);
        }
    };

    const handleProblemAdded = (index, problemId) => {
        const updatedProblems = [...problems];
        updatedProblems[index].problemId = problemId;
        setProblems(updatedProblems);
    };

    const handleDeleteProblem = (index) => {
        setProblems(deleteProblem(problems, index));
        customProblemRefs.current.splice(index, 1);
    };

    const handleMoveProblem = (fromIndex, toIndex) => {
        setProblems(moveProblem(problems, fromIndex, toIndex));
        const temp = customProblemRefs.current[fromIndex];
        customProblemRefs.current[fromIndex] = customProblemRefs.current[toIndex];
        customProblemRefs.current[toIndex] = temp;
    };

    const validateForm = () => {
        let newErrors = {};
        if (!title) newErrors.title = 'Title is required';
        if (!description) newErrors.description = 'Description is required';
        if (!startTime) newErrors.startTime = 'Start time is required';
        if (!endTime) newErrors.endTime = 'End time is required';
        if (new Date(startTime) >= new Date(endTime)) newErrors.endTime = 'End time must be greater than start time';
        if (problems.length === 0) newErrors.problems = 'At least one problem is required';

        problems.forEach((problem, index) => {
            if (problem.type === 'CF') {
                if (!problem.pid) newErrors[`problem-${index}-pid`] = 'Problem number is required';
                if (!problem.oj) newErrors[`problem-${index}-oj`] = 'OJ is required';
            }
            if (problem.type === 'CS') {
                const ref = customProblemRefs.current[index];
                if (ref && ref.current) {
                    const problemErrors = ref.current.validateFields();
                    if (Object.keys(problemErrors).length > 0) {
                        newErrors[`problem-${index}`] = 'Please correct the errors in the problem form';
                    }
                }
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const unconfirmedProblems = problems.filter((problem) => problem.type === 'CS' && !problem.problemId);
        if (unconfirmedProblems.length > 0) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                problems: 'Please confirm all custom problems or delete them.',
            }));
            return;
        }

        setIsSubmitting(true);

        const requestData = problems.map((problem) => {
            if (problem.type === 'CF') {
                const problemData = {
                    type: problem.type,
                    pid: problem.pid,
                };
                if (problem.aliasName) problemData.aliasName = problem.aliasName;
                return problemData;
            } else if (problem.type === 'CS') {
                const problemData = {
                    type: problem.type,
                    pid: problem.problemId,
                };
                if (problem.aliasName) problemData.aliasName = problem.aliasName;
                return problemData;
            }
            return problem;
        });

        const requestTime = new Date().toISOString();

        try {
            await axios.post('http://localhost:8000/api/requested_contest/create', {
                title,
                description,
                startTime,
                endTime,
                problems: requestData,
                author: {
                    authorName: username,
                    authorEmail: authorEmail,
                },
                requestTime,
            });
            navigate('/contest');
        } catch (error) {
            console.error('Error creating contest:', error);
            setIsSubmitting(false);
            setErrorMessage('Error creating contest');
        }
    };

    const handleCloseError = () => {
        setErrorMessage('');
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
                    <button type="button" onClick={() => handleAddProblem('CS')}>
                        Add Custom Problem
                    </button>
                    <button type="button" onClick={() => handleAddProblem('CF')}>
                        Add OJ Problem
                    </button>
                    {errors.problems && <span className="error">{errors.problems}</span>}
                    {problems.map((problem, index) => (
                        <div key={index} className="problem-entry">
                            <h3>Problem #{index + 1}</h3>
                            {problem.type === 'CF' ? (
                                <>
                                    <select
                                        value={problem.oj}
                                        onChange={(e) => handleProblemChange(index, 'oj', e.target.value)}
                                    >
                                        <option value="">Select OJ</option>
                                        <option value="CF">Codeforces</option>
                                        <option value="CS">CodeSphere</option>
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
                                        placeholder="Alias Name"
                                        value={problem.aliasName}
                                        onChange={(e) => handleProblemChange(index, 'aliasName', e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Title"
                                        value={problem.title}
                                        readOnly
                                    />
                                </>
                            ) : (
                                <CustomProblemForm
                                    ref={customProblemRefs.current[index]}
                                    problem={problem}
                                    index={index}
                                    onProblemChange={handleProblemChange}
                                    onProblemAdded={handleProblemAdded}
                                    errors={errors}
                                />
                            )}
                            <div className="problem-actions">
                                <button type="button" onClick={() => handleMoveProblem(index, index - 1)}>↑</button>
                                <button type="button" onClick={() => handleMoveProblem(index, index + 1)}>↓</button>
                                <button type="button" onClick={() => handleDeleteProblem(index)}>×</button>
                            </div>
                        </div>
                    ))}
                </div>
                <button type="submit" disabled={isSubmitting}>Create Contest</button>
            </form>
            {errorMessage && (
                <div className="create-contest-error-dialog">
                    <div className="create-contest-error-content">
                        <span>{errorMessage}</span>
                        <button onClick={handleCloseError}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateContestPage;
