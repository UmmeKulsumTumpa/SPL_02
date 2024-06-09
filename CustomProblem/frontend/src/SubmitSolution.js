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

function SubmitSolution() {
  const [sid, setSid] = useState('');
  const [problemId, setProblemId] = useState('');
  const [solutionFile, setSolutionFile] = useState(null);
  const [open, setOpen] = useState(false);
  const [verdict, setVerdict] = useState('');
  const [execTime, setExecTime] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('sid', sid);
    formData.append('problemId', problemId);
    formData.append('solutionFile', solutionFile);

    console.log('Submitting solution data:', {
      sid,
      problemId,
      solutionFile,
    });

    try {
      const response = await axios.post('http://localhost:3001/submitSolution', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Response from server:', response.data);
      setVerdict(response.data.verdict);
      setExecTime(response.data.execTime);
      setMessage(response.data.message);
      setOpen(true);
    } catch (error) {
      console.error('Error submitting solution:', error);
      const errorMsg = error.response && error.response.data && error.response.data.error 
        ? error.response.data.error 
        : 'Unknown error';
      console.log('Error details:', error.response ? error.response.data : 'No response data');
      alert('Error submitting solution: ' + errorMsg);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '50%', margin: 'auto', mt: 5 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Submit Solution
      </Typography>
      <TextField
        label="Participant ID"
        value={sid}
        onChange={(e) => setSid(e.target.value)}
        required
      />
      <TextField
        label="Problem ID"
        value={problemId}
        onChange={(e) => setProblemId(e.target.value)}
        required
      />
      <Typography variant="body1">Upload Solution File (CPP)</Typography>
      <Input
        type="file"
        inputProps={{ accept: '.cpp' }}
        onChange={(e) => setSolutionFile(e.target.files[0])}
        required
      />
      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Submission Result</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Verdict: {verdict}
            <br />
            Execution Time: {execTime}
            <br />
            Message: {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default SubmitSolution;
