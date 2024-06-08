const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Solution = require('../models/Solution');
const TemporaryData = require('../models/TempProblem');
const { runCPP } = require('../compile/runCPP');

const router = express.Router();
const upload = multer();

// Ensure the solutions directory exists
const solutionsDir = path.join(__dirname, '..', 'solutions');
if (!fs.existsSync(solutionsDir)) {
  fs.mkdirSync(solutionsDir, { recursive: true });
}

// POST route to submit solution
router.post('/', upload.single('solutionFile'), async (req, res) => {
  try {
    const { problemId } = req.body;

    // Find problem by problemId field
    const problem = await TemporaryData.findOne({ problemId: problemId });
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }

    const solutionCode = req.file.buffer.toString('utf-8');

    const newSolution = new Solution({
      problem: problem._id,
      solutionCode
    });

    await newSolution.save();

    // Save the solution code to a temporary file for compilation
    const filePath = path.join(solutionsDir, `${newSolution._id}.cpp`);
    fs.writeFileSync(filePath, solutionCode);

    // Run the solution
    const result = await runCPP(problemId, filePath);

    // Clean up the temporary file
    fs.unlinkSync(filePath);

    // Update solution with verdict and execTime
    newSolution.verdict = result.verdict;
    newSolution.execTime = isNaN(result.execTime) ? 0 : result.execTime; // Ensure execTime is a number
    await newSolution.save();

    res.json({ verdict: result.verdict, execTime: result.execTime, message: result.message });
  } catch (error) {
    console.error('Error submitting solution:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

module.exports = router;
