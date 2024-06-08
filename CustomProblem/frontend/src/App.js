import React, { useState } from 'react';
import axios from 'axios';
import {
  Button,
  TextField,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Input,
  Typography,
} from '@mui/material';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import SubmitSolution from './SubmitSolution';

function AddProblem() {
  const [problemTitle, setProblemTitle] = useState('');
  const [timeLimit, setTimeLimit] = useState('');
  const [memoryLimit, setMemoryLimit] = useState('');
  const [problemDescription, setProblemDescription] = useState(null);
  const [inputFile, setInputFile] = useState(null);
  const [outputFile, setOutputFile] = useState(null);
  const [open, setOpen] = useState(false);
  const [problemId, setProblemId] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('problemTitle', problemTitle);
    formData.append('timeLimit', timeLimit);
    formData.append('memoryLimit', memoryLimit);
    formData.append('problemDescription', problemDescription);
    formData.append('inputFile', inputFile);
    formData.append('outputFile', outputFile);

    console.log('Submitting form data:', {
      problemTitle,
      timeLimit,
      memoryLimit,
      problemDescription,
      inputFile,
      outputFile,
    });

    try {
      const response = await axios.post('http://localhost:3001/addProblem', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Response from server:', response.data);
      setProblemId(response.data.problemId);
      setOpen(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      const errorMsg = error.response && error.response.data && error.response.data.error 
        ? error.response.data.error 
        : 'Unknown error';
      console.log('Error details:', error.response ? error.response.data : 'No response data');
      alert('Error submitting form: ' + errorMsg);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '50%', margin: 'auto', mt: 5 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Add Problem
      </Typography>
      <TextField
        label="Problem Title"
        value={problemTitle}
        onChange={(e) => setProblemTitle(e.target.value)}
        required
      />
      <TextField
        label="Time Limit (seconds)"
        type="number"
        value={timeLimit}
        onChange={(e) => setTimeLimit(e.target.value)}
        required
      />
      <TextField
        label="Memory Limit"
        type="number"
        value={memoryLimit}
        onChange={(e) => setMemoryLimit(e.target.value)}
        required
      />
      <Typography variant="body1">Problem Description (PDF)</Typography>
      <Input
        type="file"
        inputProps={{ accept: 'application/pdf' }}
        onChange={(e) => setProblemDescription(e.target.files[0])}
        required
      />
      <Typography variant="body1">Upload Input File (TXT)</Typography>
      <Input
        type="file"
        inputProps={{ accept: '.txt' }}
        onChange={(e) => setInputFile(e.target.files[0])}
        required
      />
      <Typography variant="body1">Upload Output File (TXT)</Typography>
      <Input
        type="file"
        inputProps={{ accept: '.txt' }}
        onChange={(e) => setOutputFile(e.target.files[0])}
        required
      />
      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Success</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Problem added successfully and your problem ID is: {problemId}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
      <Button component={Link} to="/submitSolution" variant="contained" color="secondary">
        Submit Solution
      </Button>
    </Box>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AddProblem />} />
        <Route path="/submitSolution" element={<SubmitSolution />} />
      </Routes>
    </Router>
  );
}

export default App;
