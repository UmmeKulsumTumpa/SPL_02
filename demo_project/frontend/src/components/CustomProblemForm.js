import React, { forwardRef, useImperativeHandle, useState } from 'react';
import axios from 'axios';
import '../styles/CustomProblemForm.css';

const CustomProblemForm = forwardRef(({ problem, index, onProblemChange, onProblemAdded, errors }, ref) => {
    const [isConfirmClicked, setIsConfirmClicked] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const validateFields = () => {
        const newErrors = {};
        if (!problem.problemTitle) newErrors.problemTitle = 'Problem Title is required';
        if (!problem.timeLimit) newErrors.timeLimit = 'Time Limit is required';
        if (!problem.memoryLimit) newErrors.memoryLimit = 'Memory Limit is required';
        if (!problem.problemDescription) newErrors.problemDescription = 'Problem Description is required';
        if (!problem.testCases || problem.testCases.length === 0) newErrors.testCases = 'Test Cases are required';
        if (!problem.inputFile) newErrors.inputFile = 'Input File is required';
        if (!problem.outputFile) newErrors.outputFile = 'Output File is required';
        return newErrors;
    };

    useImperativeHandle(ref, () => ({
        validateFields,
    }));

    const handleChange = (field, value) => {
        onProblemChange(index, field, value);
    };

    const handleConfirm = async () => {
        const fieldErrors = validateFields();
        if (Object.keys(fieldErrors).length > 0) {
            setErrorMessage('Please fill out all fields correctly.');
            return;
        }

        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('problemTitle', problem.problemTitle);
            formData.append('timeLimit', problem.timeLimit);
            formData.append('memoryLimit', problem.memoryLimit);
            formData.append('problemDescription', problem.problemDescription);

            // Ensure testCases is an array of objects
            const testCasesArray = Array.isArray(problem.testCases) ? problem.testCases : JSON.parse(problem.testCases);
            formData.append('testCases', JSON.stringify(testCasesArray));

            formData.append('inputFile', problem.inputFile);
            formData.append('outputFile', problem.outputFile);

            // Console log to print FormData entries and values
            for (let [key, value] of formData.entries()) {
                console.log(key, value);
            }

            const response = await axios.post('http://localhost:8000/api/add_custom_problem', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                onProblemAdded(index, response.data.problemId);
                setIsConfirmClicked(true);
            } else {
                throw new Error('Problem adding custom problem');
            }
        } catch (error) {
            setErrorMessage('Error adding problem: ' + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="custom-problem-form">
            <div className="form-group">
                <label>Problem Title</label>
                <input
                    type="text"
                    value={problem.problemTitle}
                    onChange={(e) => handleChange('problemTitle', e.target.value)}
                    disabled={isConfirmClicked}
                />
                {errors[`problem-${index}-problemTitle`] && <span className="error">{errors[`problem-${index}-problemTitle`]}</span>}
            </div>
            <div className="form-group">
                <label>Time Limit (seconds)</label>
                <input
                    type="number"
                    value={problem.timeLimit}
                    onChange={(e) => handleChange('timeLimit', e.target.value)}
                    disabled={isConfirmClicked}
                />
                {errors[`problem-${index}-timeLimit`] && <span className="error">{errors[`problem-${index}-timeLimit`]}</span>}
            </div>
            <div className="form-group">
                <label>Memory Limit (MB)</label>
                <input
                    type="number"
                    value={problem.memoryLimit}
                    onChange={(e) => handleChange('memoryLimit', e.target.value)}
                    disabled={isConfirmClicked}
                />
                {errors[`problem-${index}-memoryLimit`] && <span className="error">{errors[`problem-${index}-memoryLimit`]}</span>}
            </div>
            <div className="form-group">
                <label>Problem Description</label>
                <textarea
                    value={problem.problemDescription}
                    onChange={(e) => handleChange('problemDescription', e.target.value)}
                    disabled={isConfirmClicked}
                ></textarea>
                {errors[`problem-${index}-problemDescription`] && <span className="error">{errors[`problem-${index}-problemDescription`]}</span>}
            </div>
            <div className="form-group">
                <label>Test Cases (JSON)</label>
                <textarea
                    value={problem.testCases}
                    onChange={(e) => handleChange('testCases', e.target.value)}
                    disabled={isConfirmClicked}
                ></textarea>
                {errors[`problem-${index}-testCases`] && <span className="error">{errors[`problem-${index}-testCases`]}</span>}
            </div>
            <div className="form-group">
                <label>Upload Input File (TXT)</label>
                <input
                    type="file"
                    onChange={(e) => handleChange('inputFile', e.target.files[0])}
                    disabled={isConfirmClicked}
                />
                {errors[`problem-${index}-inputFile`] && <span className="error">{errors[`problem-${index}-inputFile`]}</span>}
            </div>
            <div className="form-group">
                <label>Upload Output File (TXT)</label>
                <input
                    type="file"
                    onChange={(e) => handleChange('outputFile', e.target.files[0])}
                    disabled={isConfirmClicked}
                />
                {errors[`problem-${index}-outputFile`] && <span className="error">{errors[`problem-${index}-outputFile`]}</span>}
            </div>
            {!isConfirmClicked && (
                <button
                    type="button"
                    onClick={handleConfirm}
                    disabled={isSubmitting}
                >
                    Confirm
                </button>
            )}
            {errorMessage && <div className="error-message">{errorMessage}</div>}
        </div>
    );
});

export default CustomProblemForm;
