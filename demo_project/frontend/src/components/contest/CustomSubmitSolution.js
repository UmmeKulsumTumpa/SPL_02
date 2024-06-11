import React, { useState } from 'react';
import Draggable from 'react-draggable';
import './styles/CustomSubmitSolution.css';

function CustomSubmitSolution({ onSubmit, onClose }) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const isCppOrCFile = file.name.endsWith('.cpp') || file.name.endsWith('.c');
            if (!isCppOrCFile) {
                setErrorMessage('Please upload a solution file with .c or .cpp extension.');
                setSelectedFile(null);
            } else {
                setErrorMessage('');
                setSelectedFile(file);
            }
        }
    };

    const handleSubmit = () => {
        if (!selectedFile) {
            setErrorMessage('Please upload a solution file.');
            return;
        }
        console.log('from submit solution:', selectedFile);
        onSubmit(selectedFile);
        setSelectedFile(null);
        setErrorMessage('');
        onClose(); // Close the modal after submission
    };

    return (
        <Draggable>
            <div className="submit-solution-modal">
                <div className="modal-header">
                    <h2>Submit Solution</h2>
                    <button className="close-button" onClick={onClose}>✕</button>
                </div>
                <input
                    type="file"
                    className="file-input"
                    accept=".cpp,.c"
                    onChange={handleFileChange}
                />
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <button className="submit-button" onClick={handleSubmit}>
                    Submit
                </button>
            </div>
        </Draggable>
    );
}

export default CustomSubmitSolution;
