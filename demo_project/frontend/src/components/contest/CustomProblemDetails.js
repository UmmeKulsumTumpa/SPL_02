import React, { useState, useEffect } from 'react';
import axios from "axios";
import CustomSubmitSolution from './CustomSubmitSolution';
import './styles/ProblemDetails.css';

function initializeState() {
    return {
        verdict: '',
        id: '',
        contestId: '',
        creationTimeSeconds: '',
        relativeTimeSeconds: '',
        problem: {},
        author: {},
        programmingLanguage: '',
        testset: '',
        passedTestCount: '',
        timeConsumedMillis: '',
        memoryConsumedBytes: '',
        points: '',
        showSubmitModal: false,
        error: null,
    };
}

function CustomProblemDetails({ problem, username, contestId }) {
    const [state, setState] = useState(initializeState());

    useEffect(() => {
        // Reset state when a new problem is selected
        if (problem) {
            setState(initializeState());
        }
    }, [problem]);

    if (!problem) return null;

    const { pid, title, testCase, constraints, problemDescription } = problem;
    // console.log(problem);

    // Check if testCase is a stringified JSON array and parse it
    const testCasesArray = JSON.parse(testCase);

    // Function to copy text to clipboard
    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
    };

    // Function to handle submission of solution
    const handleSubmit = (file) => {
        const formData = new FormData();
        formData.append('solutionFile', file);
        formData.append('problemId', pid);

        // Log the form data for debugging
        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }

        axios
            .post(`http://localhost:8000/api/custom_solution_submit/submit/${contestId}/${username}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            .then((response) => {
                console.log('response from submission: ', response.data);
                // Check if the response contains the expected data
                if (response.data.verdict) {
                    // Update state with submitted solution and verdict
                    setState((prevState) => ({
                        ...prevState,
                        verdict: response.data.verdict,
                        id: response.data.sid,
                        showSubmitModal: false,
                    }));
                } else {
                    setState((prevState) => ({
                        ...prevState,
                        error: 'Invalid response from the server.',
                    }));
                }
            })
            .catch((error) => {
                setState((prevState) => ({
                    ...prevState,
                    error: error.message,
                }));
            });
    };

    return (
        <div className="problem-details-container">
            <h2>{title}</h2>

            {/* Constraints Section */}
            <h3>Constraints:</h3>
            <div className="constraints">
                {/* Displaying each constraint on a separate line */}
                {constraints.split('\n').map((constraint, index) => (
                    <p key={index}>{constraint}</p>
                ))}
            </div>

            {/* Statement Section */}
            <h3>Problem Description:</h3>
            <div className="statement">
                <p>{problemDescription}</p>
            </div>

            {/* TestCases Section */}
            <h3>Test Cases:</h3>
            <div className="testCases">
                {/* Displaying each test case on separate lines */}
                {testCasesArray.map((test, index) => (
                    <div key={index} className="testCase">
                        <table className="testTable">
                            <thead>
                                <tr>
                                    <th className="tableHead">
                                        <div>
                                            Input
                                            <button className="copyButton" onClick={() => copyToClipboard(test.input)}>
                                                Copy
                                            </button>
                                        </div>
                                    </th>
                                    <th className="tableHead">
                                        <div>
                                            Output
                                            <button className="copyButton" onClick={() => copyToClipboard(test.output)}>
                                                Copy
                                            </button>
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <div>
                                            {test.input.split('\n').map((line, idx) => (
                                                <p key={idx}>{line}</p>
                                            ))}
                                        </div>
                                    </td>
                                    <td>
                                        <div>
                                            {test.output.split('\n').map((line, idx) => (
                                                <p key={idx}>{line}</p>
                                            ))}
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>

            {/* Submit Button */}
            <button className="submitButton"
                onClick={() => setState((prevState) => ({ ...prevState, showSubmitModal: true }))}>
                Submit Solution
            </button>

            {/* Modal for submitting solution */}
            {state.showSubmitModal && (
                <CustomSubmitSolution
                    onSubmit={handleSubmit}
                    onClose={() => setState((prevState) => ({ ...prevState, showSubmitModal: false }))} />
                )}
    
                {/* Displaying the submitted solution and verdict */}
                {state.id !== '' && (
                    <div>
                        <h2>Submission Result:</h2>
                        <h3>Verdict:</h3>
                        <p>{state.verdict}</p>
                        <h3>ID:</h3>
                        <p>{state.id}</p>
                    </div>
                )}
    
                {/* Displaying errors */}
                {state.error && (
                    <div className="error-message">
                        <h3>Error:</h3>
                        <p>{state.error}</p>
                    </div>
                )}
            </div>
        );
    }
    
    export default CustomProblemDetails;
    
