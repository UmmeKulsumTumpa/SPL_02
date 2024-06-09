import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box,
} from '@mui/material';

const CustomProblemForm = ({ problem, index, onProblemChange, errors, onDeleteProblem, onMoveProblem }) => {
    const [problemTitle, setProblemTitle] = useState(problem.title || '');
    const [timeLimit, setTimeLimit] = useState(problem.timeLimit || '');
    const [memoryLimit, setMemoryLimit] = useState(problem.memoryLimit || '');
    const [problemDescription, setProblemDescription] = useState(problem.statement || '');
    const [inputFile, setInputFile] = useState(null);
    const [outputFile, setOutputFile] = useState(null);
    const [problemId, setProblemId] = useState('');
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setProblemTitle(problem.title || '');
        setTimeLimit(problem.timeLimit || '');
        setMemoryLimit(problem.memoryLimit || '');
        setProblemDescription(problem.statement || '');
    }, [problem]);

    const handleTitleChange = (e) => {
        setProblemTitle(e.target.value);
        onProblemChange(index, 'title', e.target.value);
    };

    const handleTimeLimitChange = (e) => {
        setTimeLimit(e.target.value);
        onProblemChange(index, 'timeLimit', e.target.value);
    };

    const handleMemoryLimitChange = (e) => {
        setMemoryLimit(e.target.value);
        onProblemChange(index, 'memoryLimit', e.target.value);
    };

    const handleDescriptionChange = (e) => {
        setProblemDescription(e.target.value);
        onProblemChange(index, 'statement', e.target.value);
    };

    const handleFileChange = (e, setFile) => {
        const file = e.target.files[0];
        setFile(file);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('problemTitle', problemTitle);
        formData.append('timeLimit', timeLimit);
        formData.append('memoryLimit', memoryLimit);
        formData.append('problemDescription', problemDescription);
        formData.append('inputFile', inputFile);
        formData.append('outputFile', outputFile);

        try {
            const response = await axios.post('http://localhost:3001/addProblem', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setProblemId(response.data.problemId);
            setOpen(true);
        } catch (error) {
            const errorMsg = error.response && error.response.data && error.response.data.error
                ? error.response.data.error
                : 'Unknown error';
            alert('Error submitting form: ' + errorMsg);
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Box component="form" onSubmit={handleSubmit} className="custom-problem-form">
            {/* <Typography variant="h6">Problem #{index + 1}</Typography> */}
            <div className="form-group">
                <label>Problem Title</label>
                <input
                    type="text"
                    value={problemTitle}
                    onChange={handleTitleChange}
                    required
                    className="form-control"
                />
                {errors[`problem-${index}-title`] && <span className="error">{errors[`problem-${index}-title`]}</span>}
            </div>
            <div className="form-group">
                <label>Time Limit (seconds)</label>
                <input
                    type="number"
                    value={timeLimit}
                    onChange={handleTimeLimitChange}
                    required
                    className="form-control"
                />
            </div>
            <div className="form-group">
                <label>Memory Limit</label>
                <input
                    type="number"
                    value={memoryLimit}
                    onChange={handleMemoryLimitChange}
                    required
                    className="form-control"
                />
            </div>
            <div className="form-group">
                <label>Problem Description (PDF)</label>
                <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => handleFileChange(e, setProblemDescription)}
                    required
                    className="form-control"
                />
            </div>
            <div className="form-group">
                <label>Upload Input File (TXT)</label>
                <input
                    type="file"
                    accept=".txt"
                    onChange={(e) => handleFileChange(e, setInputFile)}
                    required
                    className="form-control"
                />
            </div>
            <div className="form-group">
                <label>Upload Output File (TXT)</label>
                <input
                    type="file"
                    accept=".txt"
                    onChange={(e) => handleFileChange(e, setOutputFile)}
                    required
                    className="form-control"
                />
            </div>
        </Box>
    );
};

export default CustomProblemForm;
