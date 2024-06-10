import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import axios from 'axios';
import {
    Box,
    TextField,
} from '@mui/material';

const CustomProblemForm = forwardRef(({ problem, index, onProblemChange, errors, onDeleteProblem, onMoveProblem }, ref) => {
    const [problemTitle, setProblemTitle] = useState(problem.title || '');
    const [timeLimit, setTimeLimit] = useState(problem.timeLimit || '');
    const [memoryLimit, setMemoryLimit] = useState(problem.memoryLimit || '');
    const [problemDescription, setProblemDescription] = useState(null);
    const [inputFile, setInputFile] = useState(null);
    const [outputFile, setOutputFile] = useState(null);
    const [problemId, setProblemId] = useState('');
    const [open, setOpen] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});

    useEffect(() => {
        setProblemTitle(problem.title || '');
        setTimeLimit(problem.timeLimit || '');
        setMemoryLimit(problem.memoryLimit || '');
    }, [problem]);

    useImperativeHandle(ref, () => ({
        validateFields
    }));

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

    const handleFileChange = (e, setFile) => {
        const file = e.target.files[0];
        setFile(file);
    };

    const validateFields = () => {
        let valid = true;
        const errors = {};
        
        if (!problemTitle) {
            errors.title = 'Problem title is required';
            valid = false;
        }
        if (!timeLimit) {
            errors.timeLimit = 'Time limit is required';
            valid = false;
        }
        if (!memoryLimit) {
            errors.memoryLimit = 'Memory limit is required';
            valid = false;
        }
        if (!problemDescription) {
            errors.problemDescription = 'Problem description is required';
            valid = false;
        } else if (!problemDescription.name.endsWith('.pdf')) {
            errors.problemDescription = 'Problem description must be a PDF file';
            valid = false;
        }
        if (!inputFile) {
            errors.inputFile = 'Input file is required';
            valid = false;
        } else if (!inputFile.name.endsWith('.txt')) {
            errors.inputFile = 'Input file must be a TXT file';
            valid = false;
        }
        if (!outputFile) {
            errors.outputFile = 'Output file is required';
            valid = false;
        } else if (!outputFile.name.endsWith('.txt')) {
            errors.outputFile = 'Output file must be a TXT file';
            valid = false;
        }

        setFieldErrors(errors);
        return valid;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validateFields()) {
            return;
        }

        const formData = new FormData();
        formData.append('problemTitle', problemTitle);
        formData.append('timeLimit', timeLimit);
        formData.append('memoryLimit', memoryLimit);
        formData.append('problemDescription', problemDescription);
        formData.append('inputFile', inputFile);
        formData.append('outputFile', outputFile);

        try {
            const response = await axios.post('http://localhost:8000/custom_problem', formData, {
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
            
            <div className="form-group">
                <label>Problem Title</label>
                <TextField
                    type="text"
                    value={problemTitle}
                    onChange={handleTitleChange}
                    required
                    className="form-control"
                    fullWidth
                />
                {fieldErrors.title && <span className="error">{fieldErrors.title}</span>}
            </div>
            <div className="form-group">
                <label>Time Limit (seconds)</label>
                <TextField
                    type="number"
                    value={timeLimit}
                    onChange={handleTimeLimitChange}
                    required
                    className="form-control"
                    fullWidth
                />
                {fieldErrors.timeLimit && <span className="error">{fieldErrors.timeLimit}</span>}
            </div>
            <div className="form-group">
                <label>Memory Limit</label>
                <TextField
                    type="number"
                    value={memoryLimit}
                    onChange={handleMemoryLimitChange}
                    required
                    className="form-control"
                    fullWidth
                />
                {fieldErrors.memoryLimit && <span className="error">{fieldErrors.memoryLimit}</span>}
            </div>
            <div className="form-group">
                <label>Problem Description (PDF)</label>
                <TextField
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => handleFileChange(e, setProblemDescription)}
                    required
                    className="form-control"
                    fullWidth
                />
                {fieldErrors.problemDescription && <span className="error">{fieldErrors.problemDescription}</span>}
            </div>
            <div className="form-group">
                <label>Upload Input File (TXT)</label>
                <TextField
                    type="file"
                    accept=".txt"
                    onChange={(e) => handleFileChange(e, setInputFile)}
                    required
                    className="form-control"
                    fullWidth
                />
                {fieldErrors.inputFile && <span className="error">{fieldErrors.inputFile}</span>}
            </div>
            <div class="form-group">
                <label>Upload Output File (TXT)</label>
                <TextField
                    type="file"
                    accept=".txt"
                    onChange={(e) => handleFileChange(e, setOutputFile)}
                    required
                    className="form-control"
                    fullWidth
                />
                {fieldErrors.outputFile && <span className="error">{fieldErrors.outputFile}</span>}
            </div>
        </Box>
    );
});

export default CustomProblemForm;
