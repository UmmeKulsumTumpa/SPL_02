const express = require('express');
const CustomProblem = require('../models/CustomProblem');

const router = express.Router();

// Route to get all custom problems
router.get('/', async (req, res) => {
  try {
    const customProblems = await CustomProblem.find({}, 'problemId problemTitle');
    res.json(customProblems);
  } catch (error) {
    console.error('Error fetching custom problems:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Route to get a specific problem description by problemId
router.get('/:problemId', async (req, res) => {
  try {
    const problem = await CustomProblem.findOne({ problemId: req.params.problemId });
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }
    res.json(problem);
  } catch (error) {
    console.error('Error fetching problem description:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
