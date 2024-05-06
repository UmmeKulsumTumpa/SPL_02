import React from 'react';
import '../styles/ProblemDetails.css';

function ProblemDetails({ problem }) {
    if (!problem) return null;

    const { pid, title, testCase, statement, constraints } = problem;

    // Check if testCase is a stringified JSON array and parse it
    const testCasesArray = JSON.parse(testCase);

    // Extracting elements from the statement object
    const { text, inputSpec, outputSpec, notes } = JSON.parse(statement);

    // Function to copy text to clipboard
    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
    };

    return (
        <div className="problem-details-container">
            <h2>{title}</h2>
            <p>Problem ID: {pid}</p>

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
                                            <button className="copyButton" onClick={() => copyToClipboard(test.input)}>Copy</button>
                                        </div>
                                    </th>
                                    <th className="tableHead">
                                        <div>
                                            Output
                                            <button className="copyButton" onClick={() => copyToClipboard(test.output)}>Copy</button>
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
<button className="submitButton" onClick={() => window.open(problem.submitLink, '_blank')}>
  Submit Solution
</button>
        </div>
    );
}

export default ProblemDetails;
