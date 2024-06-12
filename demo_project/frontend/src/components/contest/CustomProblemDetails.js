import React, { useState, useEffect } from 'react';
import axios from "axios";
import CustomSubmitSolution from './CustomSubmitSolution';
import './styles/ProblemDetails.css';
import { useNavigate } from 'react-router-dom';

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
        showErrorModal: false,
        error: null,
    };
}

function CustomProblemDetails({ problem, username, contestId, setActiveTab }) {
    const [state, setState] = useState(initializeState());
    const navigate = useNavigate();

    useEffect(() => {
        // Reset state when a new problem is selected
        if (problem) {
            setState(initializeState());
        }
    }, [problem]);

    if (!problem) return null;

    const { pid, title, testCase, constraints, problemDescription } = problem;

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

        axios
            .post(`http://localhost:8000/api/custom_solution_submit/submit/${contestId}/${username}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            .then((response) => {
                if (response.data.verdict) {
                    // Save the solution in the database
                    axios
                        .post(`http://localhost:8000/api/approved_contest/custom_submit_result/${contestId}/${username}`, {
                            sid: response.data.sid
                        })
                        .then((saveResponse) => {
                            setState((prevState) => ({
                                ...prevState,
                                verdict: saveResponse.data.verdict,
                                id: saveResponse.data.sid,
                                showSubmitModal: false,
                            }));
                            setActiveTab('personalSubmissions');
                        })
                        .catch((error) => {
                            setState((prevState) => ({
                                ...prevState,
                                error: error.message,
                                showErrorModal: true,
                            }));
                        });
                } else {
                    setState((prevState) => ({
                        ...prevState,
                        error: 'Invalid response from the server.',
                        showErrorModal: true,
                    }));
                }
            })
            .catch((error) => {
                setState((prevState) => ({
                    ...prevState,
                    error: error.message,
                    showErrorModal: true,
                }));
            });
    };

    return (
        <div className="problem-details-container">
            <h2>{title}</h2>

            {/* Constraints Section */}
            <h3>Constraints:</h3>
            <div className="constraints">
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

            {/* Displaying errors */}
            {state.showErrorModal && (
                <div className="error-modal">
                    <div className="error-modal-content">
                        <span className="close-button" onClick={() => setState((prevState) => ({ ...prevState, showErrorModal: false }))}>&times;</span>
                        <h3>Error</h3>
                        <p>{state.error}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CustomProblemDetails;
