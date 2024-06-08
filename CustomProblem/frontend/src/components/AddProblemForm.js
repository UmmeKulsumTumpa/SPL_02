import React, { useState } from 'react';
import axios from 'axios';

const AddProblemForm = () => {
  const [problemTitle, setProblemTitle] = useState('');
  const [timeLimit, setTimeLimit] = useState('');
  const [memoryLimit, setMemoryLimit] = useState('');
  const [problemDescription, setProblemDescription] = useState(null);
  const [testCases, setTestCases] = useState('');
  const [inputFile, setInputFile] = useState(null);
  const [outputFile, setOutputFile] = useState(null);
  const [problemId, setProblemId] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('problemTitle', problemTitle);
    formData.append('timeLimit', timeLimit);
    formData.append('memoryLimit', memoryLimit);
    formData.append('problemDescription', problemDescription);
    formData.append('testCases', testCases);
    formData.append('inputFile', inputFile);
    formData.append('outputFile', outputFile);

    try {
      const response = await axios.post('/addProblem', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setProblemId(response.data.problemId);
      // Reset form fields or perform any other actions
    } catch (error) {
      console.error('Error saving problem:', error);
    }
  };

  const handleFileChange = (e, setFile) => {
    const file = e.target.files[0];
    setFile(file);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Problem Title"
        value={problemTitle}
        onChange={(e) => setProblemTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Time Limit (seconds)"
        value={timeLimit}
        onChange={(e) => setTimeLimit(e.target.value)}
      />
      <input
        type="text"
        placeholder="Memory Limit"
        value={memoryLimit}
        onChange={(e) => setMemoryLimit(e.target.value)}
      />
      <input
        type="file"
        accept=".pdf"
        onChange={(e) => handleFileChange(e, setProblemDescription)}
      />
      <textarea
        placeholder="Test Cases"
        value={testCases}
        onChange={(e) => setTestCases(e.target.value)}
      />
      <input
        type="file"
        onChange={(e) => handleFileChange(e, setInputFile)}
      />
      <input
        type="file"
        onChange={(e) => handleFileChange(e, setOutputFile)}
      />
      <button type="submit">Submit</button>
      {problemId && <p>Problem ID: {problemId}</p>}
    </form>
  );
};

export default AddProblemForm;