import React, { useState } from 'react';
import Draggable from 'react-draggable';
import './styles/SubmitSolution.css';

function SubmitSolution({ onSubmit, onClose }) {
	const [solution, setSolution] = useState('');
	const [errorMessage, setErrorMessage] = useState('');

	const handleInputChange = (e) => {
		setSolution(e.target.value);
	};

	const handleSubmit = () => {
		const trimmedSolution = solution.trim();
		if (trimmedSolution === '') {
			setErrorMessage('Please enter a solution.');
			return;
		}

		const isCppOrCFile = trimmedSolution.endsWith('.cpp') || trimmedSolution.endsWith('.c');
		if (!isCppOrCFile) {
			setErrorMessage('Please enter a solution file with .c or .cpp extension.');
			return;
		}

		onSubmit(trimmedSolution);
		setSolution('');
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
				<textarea
					className="solution-input"
					placeholder="Paste your solution..."
					value={solution}
					onChange={handleInputChange}
				/>
				{errorMessage && <p className="error-message">{errorMessage}</p>}
				<button className="submit-button" onClick={handleSubmit}>
					Submit
				</button>
			</div>
		</Draggable>
	);
}

export default SubmitSolution;
