const express = require('express');
const router = express.Router();
const problemSubmissionRepo = require('../repositories/problem_submission');

// Route to submit a problem
router.post('/submit', async (req, res) => {
  try {
    const { type, pid, solution } = req.body;
    const result = await problemSubmissionRepo.submitProblem(type, pid, solution);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
