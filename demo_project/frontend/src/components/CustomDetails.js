import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CustomSubmitSolution from './contest/CustomSubmitSolution';
// import './styles/ProblemDetails.css';
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

function CustomDetails({ problemId }) {
    console.log('id', problemId);
    const [state, setState] = useState(initializeState());
    const [problem, setProblem] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProblemDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/add_custom_problem/get_problem/${problemId}`);
                setProblem(response.data);
                setState(initializeState());
            } catch (err) {
                console.error('Error fetching problem details:', err);
                setState((prevState) => ({
                    ...prevState,
                    error: 'Error fetching problem details. Please try again later.',
                    showErrorModal: true,
                }));
            }
        };

        fetchProblemDetails();
    }, [problemId]);

    if (!problem) return <div>Loading...</div>;

    const { pid, title, testCase, constraints, problemDescription } = problem;

    // Check if testCase is a stringified JSON array and parse it
    const testCasesArray = JSON.parse(testCase);

    // Function to copy text to clipboard
    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
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
                    onSubmit={() => {}}
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

export default CustomDetails;
