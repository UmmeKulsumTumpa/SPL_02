const router = require('express').Router();
const scraper = require('../repositories/scraper');
const Problem = require('../models/Problem');

// Route for retrieving problems from Codeforces or HackerRank
router.get('/retrieve/:type/:pid', async (req, res) => {
  try {
    const { type, pid } = req.params;
    const problemData = await scraper(type, pid);

    if (type === 'CF') {
      const { title, timeLimit, memoryLimit, input, output, statement, link, submitLink } = problemData;
      const testCase = JSON.stringify(statement.sampleTests);

      const newProblem = new Problem({
        pid: `${type}/${pid}`,
        title,
        testCase,
        statement: statement.text.join('\n'),
        constraints: `Time Limit: ${timeLimit}\nMemory Limit: ${memoryLimit}\n${input}\n${output}`,
      });

      await newProblem.save();
      res.json(newProblem);
    } else if (type === 'HR') {
      // Handle HackerRank problem data
      res.status(501).json({ error: 'HackerRank problem retrieval not implemented' });
    } else {
      res.status(400).json({ error: 'Invalid problem type' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Retrieve all problems
router.get('/', async (req, res) => {
  try {
    const problems = await Problem.find();
    res.json(problems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
