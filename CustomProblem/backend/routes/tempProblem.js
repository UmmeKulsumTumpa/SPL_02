const express = require('express');
const TempProblem = require('../models/TempProblem');

const router = express.Router();

// Fetch all problems
router.get('/', async (req, res) => {
  try {
    const problems = await TempProblem.find().select('-problemDescription -inputFile -outputFile');
    res.json(problems);
  } catch (error) {
    console.error('Error fetching problems', error);
    res.status(500).send('Server error');
  }
});

// Fetch description file
router.get('/:problemId/description', async (req, res) => {
  try {
    const problem = await TempProblem.findOne({ problemId: req.params.problemId }).select('problemDescription problemDescriptionContentType');
    if (!problem) return res.status(404).send('File not found');

    res.set('Content-Type', problem.problemDescriptionContentType);
    res.send(problem.problemDescription);
  } catch (error) {
    console.error('Error fetching description', error);
    res.status(500).send('Server error');
  }
});

// Fetch input file
router.get('/:problemId/input', async (req, res) => {
  try {
    const problem = await TempProblem.findOne({ problemId: req.params.problemId }).select('inputFile inputFileContentType');
    if (!problem) return res.status(404).send('File not found');

    res.set('Content-Type', problem.inputFileContentType);
    res.send(problem.inputFile);
  } catch (error) {
    console.error('Error fetching input file', error);
    res.status(500).send('Server error');
  }
});

// Fetch output file
router.get('/:problemId/output', async (req, res) => {
  try {
    const problem = await TempProblem.findOne({ problemId: req.params.problemId }).select('outputFile outputFileContentType');
    if (!problem) return res.status(404).send('File not found');

    res.set('Content-Type', problem.outputFileContentType);
    res.send(problem.outputFile);
  } catch (error) {
    console.error('Error fetching output file', error);
    res.status(500).send('Server error');
  }
});

module.exports = router;
