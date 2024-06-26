const router = require('express').Router();
const scraper = require('../repositories/scraper');
const Problem = require('../models/Problem');

// Route for retrieving problem details from Codeforces or HackerRank using scraper
router.get('/retrieve/:type/:pid', async (req, res) => {
  try {
    const { type, pid } = req.params;
    const problemData = await scraper(type, pid);
    res.json(problemData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route for adding a new problem to the database
router.post('/add', async (req, res) => {
  try {
    const { type, pid } = req.body;

    // Check if the problem already exists in the database
    const existingProblem = await Problem.findOne({ pid: `${type}/${pid}` });
    if (existingProblem) {
      return res.status(400).json({ error: 'Problem already exists in the database' });
    }

    // Call the scraper function to get problem details
    const problemData = await scraper(type, pid);

    // Extract problem details from scraper function result
    const { title, timeLimit, memoryLimit, input, output, statement, link, submitLink } = problemData;

    // Create a new Problem instance
    const newProblem = new Problem({
      pid: `${type}/${pid}`,
      title,
      testCase: JSON.stringify(statement.sampleTests),
      statement: JSON.stringify(statement),
      constraints: `Time Limit: ${timeLimit}\nMemory Limit: ${memoryLimit}\n${input}\n${output}`,
    });

    // Save the new problem to the database
    await newProblem.save();

    // Send the newly added problem as response
    res.json(newProblem);
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

// Route for adding an array of contest problems
router.post('/add_contest_problems/:contestId', async (req, res) => {
  try {
    const { contestId } = req.params;
    const { problems } = req.body;

    // Iterate over the problems array
    for (const problemDetails of problems) {
      const {
        type,
        pid,
        title,
        statement,
        constraints,
        testCase,
        aliasName,
        timeLimit,
        memoryLimit,
        problemDescription,
        testCases,
        inputFile,
        inputFileContentType,
        outputFile,
        outputFileContentType,
      } = problemDetails;

      // Check if the problem already exists in the database
      const existingProblem = await Problem.findOne({ pid });

      if (!existingProblem) {
        // Create a new problem object with the fields from the request body
        const newProblem = new Problem({
          type: type || '',
          pid: pid || '',
          title: title || '',
          statement: statement || '',
          constraints: constraints || '',
          testCase: testCase || '',
          aliasName: aliasName || '',
          timeLimit: timeLimit || '',
          memoryLimit: memoryLimit || '',
          problemDescription: problemDescription || '',
          testCases: testCases || [],
          inputFile: inputFile || null,
          inputFileContentType: inputFileContentType || '',
          outputFile: outputFile || null,
          outputFileContentType: outputFileContentType || '',
          contestId: contestId || '',
        });

        // Save the new problem to the database
        await newProblem.save();
      }
    }

    // Send a success response
    res.json({ status: 'success', message: 'Problems added successfully' });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

module.exports = router;

