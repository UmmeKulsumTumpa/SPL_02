const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const os = require('os');
const axios = require('axios');
const mongoose = require('mongoose');
const Solution = require('../models/Solution');
const TemporaryData = require('../models/TempProblem');

const router = express.Router();
const upload = multer();

// Ensure the solutions directory exists
const solutionsDir = path.join(os.tmpdir(), 'solutions');
if (!fs.existsSync(solutionsDir)) {
  fs.mkdirSync(solutionsDir, { recursive: true });
}

// Helper function to convert time and memory limits to appropriate units
function parseLimit(limit) {
  const value = parseFloat(limit);
  if (limit.toLowerCase().includes('ms')) {
    return value / 1000; // convert ms to seconds
  }
  if (limit.toLowerCase().includes('kb')) {
    return value / 1024; // convert KB to MB
  }
  return value;
}

// POST route to submit solution
router.post('/', upload.single('solutionFile'), async (req, res) => {
  try {
    const { problemId } = req.body;

    // Find problem by problemId field
    const problem = await TemporaryData.findOne({ problemId });
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }

    const solutionCode = req.file.buffer.toString('utf-8');

    const newSolution = new Solution({
      problem: problem._id,
      solutionCode
    });

    await newSolution.save();

    // Save the solution code to a temporary file for local processing (optional)
    const solutionId = newSolution._id; // Get the solutionId from the newly saved solution
    const filePath = path.join(solutionsDir, `${solutionId}.cpp`);
    fs.writeFileSync(filePath, solutionCode);

    // Compile and run the solution using Piston API
    const response = await axios.post('https://emkc.org/api/v2/piston/execute', {
      language: 'cpp',
      version: '10.2.0', // You can specify the version if needed
      files: [{
        name: 'solution.cpp',
        content: solutionCode
      }],
      stdin: '', // You can provide input here if needed
      args: [],
      compile_timeout: 10000, // 10 seconds compile timeout
      run_timeout: parseLimit(problem.timeLimit) * 1000, // Convert timeLimit to milliseconds
      memory_limit: parseLimit(problem.memoryLimit) * 1024 * 1024 // Convert memoryLimit to bytes
    });

    // Clean up the temporary file
    fs.unlinkSync(filePath);

    const result = response.data;

    // Log the full API response for debugging
    console.log('Piston API response:', result);

    // Extract relevant data from the Piston API response
    const output = result.run.output.trim();
    const execTime = parseFloat(result.run.time) || 0;
    const memoryUsage = parseFloat(result.run.memory) / (1024 * 1024) || 0; // Convert memory from bytes to MB
    const expectedOutput = problem.outputFile.toString('utf-8').trim();
    const timeLimit = parseLimit(problem.timeLimit);
    const memoryLimit = parseLimit(problem.memoryLimit);

    // Determine verdict based on the output and limits
    let verdict;
    if (result.compile && result.compile.stderr) {
      verdict = 'Compilation Error';
    } else if (result.run.signal) {
      verdict = 'Runtime Error';
    } else if (execTime > timeLimit) {
      verdict = 'Time Limit Exceeded';
    } else if (memoryUsage > memoryLimit) {
      verdict = 'Memory Limit Exceeded';
    } else if (output !== expectedOutput) {
      verdict = 'Wrong Answer';
    } else {
      verdict = 'Accepted';
    }

    // Update solution with verdict, execTime, and memoryUsage
    newSolution.verdict = verdict;
    newSolution.execTime = execTime;
    newSolution.memoryUsage = memoryUsage;
    await newSolution.save();

    res.json({ verdict, execTime, memoryUsage, output });
  } catch (error) {
    console.error('Error submitting solution:', error);
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
      console.error('Error response headers:', error.response.headers);
      res.status(error.response.status).json({ error: 'Piston API error', details: error.response.data });
    } else if (error.request) {
      console.error('Error request data:', error.request);
      res.status(500).json({ error: 'No response from Piston API', details: error.message });
    } else {
      console.error('Error message:', error.message);
      res.status(500).json({ error: 'Server error', details: error.message });
    }
  }
});

module.exports = router;
