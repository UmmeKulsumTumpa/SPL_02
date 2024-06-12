import React, { useState, useEffect } from 'react';
import SubmitSolution from './SubmitSolution';
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
        showErrorModal: false,
        error: null,
    };
}

function ProblemDetails({ problem, username, contestId, setActiveTab }) {
    const [state, setState] = useState(initializeState());

    useEffect(() => {
        // Reset state when a new problem is selected
        if (problem) {
            setState(initializeState());
        }
    }, [problem]);

    if (!problem) return null;

    const { pid, title, testCase, statement, constraints, aliasName } = problem;

    // Check if testCase is a stringified JSON array and parse it
    const testCasesArray = JSON.parse(testCase);

    // Extracting elements from the statement object
    const { text, inputSpec, outputSpec, notes } = JSON.parse(statement);

    // Function to copy text to clipboard
    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
    };

    // Function to handle submission of solution
    const handleSubmit = (solution) => {
        // Send the solution to the backend
        fetch(`http://localhost:8000/api/approved_contest/submit/${contestId}/${username}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: 'CF',
                pid: problem.pid,
                solution: solution,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                // Check if the response contains the expected data
                if (data[0] && data[0].verdict) {
                    // Update state with submitted solution and verdict
                    setState((prevState) => ({
                        ...prevState,
                        verdict: data[0].verdict,
                        id: data[0].id,
                        contestId: data[0].contestId,
                        creationTimeSeconds: data[0].creationTimeSeconds,
                        relativeTimeSeconds: data[0].relativeTimeSeconds,
                        problem: data[0].problem,
                        author: data[0].author,
                        programmingLanguage: data[0].programmingLanguage,
                        testset: data[0].testset,
                        passedTestCount: data[0].passedTestCount,
                        timeConsumedMillis: data[0].timeConsumedMillis,
                        memoryConsumedBytes: data[0].memoryConsumedBytes,
                        points: data[0].points,
                        showSubmitModal: false,
                    }));
                    setActiveTab('personalSubmissions');
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

    const closeErrorModal = () => {
        setState((prevState) => ({
            ...prevState,
            showErrorModal: false,
        }));
    };

    return (
        <div className="problem-details-container">
            <h2>{aliasName}</h2>
            {/* <p>Problem ID: {pid}</p> */}

            {/* Constraints Section */}
            <h3>Constraints:</h3>
            <div className="constraints">
                {/* Displaying each constraint on a separate line */}
                {constraints.split('\n').map((constraint, index) => (
                    <p key={index}>{constraint}</p>
                ))}
            </div>

            {/* Statement Section */}
            <h3>Statement:</h3>
            <div className="statement">
                {/* Displaying problem statement text */}
                <h4>Problem Description:</h4>
                <p>{text.join('\n')}</p>

                {/* Displaying input specification */}
                <h4>Input Specification:</h4>
                <p>{inputSpec.join('\n')}</p>

                {/* Displaying output specification */}
                <h4>Output Specification:</h4>
                <p>{outputSpec.join('\n')}</p>
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

            {/* Note Section */}
            {notes.length > 0 && (
                <>
                    <h3>Note:</h3>
                    <div className="notes">
                        <p>{notes.join('\n')}</p>
                    </div>
                </>
            )}

            {/* Submit Button */}
            <button className="submitButton"
                onClick={() => setState((prevState) => ({ ...prevState, showSubmitModal: true }))}>
                Submit Solution
            </button>

            {/* Modal for submitting solution */}
            {state.showSubmitModal && (
                <SubmitSolution
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
            {state.showErrorModal && (
                <div className="error-modal">
                    <div className="error-modal-content">
                        <span className="close-button" onClick={closeErrorModal}>&times;</span>
                        <h3>Error</h3>
                        <p>{state.error}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProblemDetails;
