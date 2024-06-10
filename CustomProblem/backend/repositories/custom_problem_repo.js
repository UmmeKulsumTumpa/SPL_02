const CustomProblem = require('../models/CustomProblem');

// Generate problem ID
const generateProblemId = async () => {
  const count = await CustomProblem.countDocuments();
  return `CS/${count + 1}T`;
};

// Logic for creating a custom problem
const createCustomProblem = async (req, res) => {
  try {
    const { problemTitle, timeLimit, memoryLimit, problemDescription, testCases } = req.body;
    const inputFile = req.files['inputFile'][0];
    const outputFile = req.files['outputFile'][0];

    if (!problemTitle || !timeLimit || !memoryLimit || !problemDescription || !testCases) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const problemId = await generateProblemId();

    const customProblem = new CustomProblem({
      problemId,
      problemTitle,
      timeLimit,
      memoryLimit,
      problemDescription,
      testCases: JSON.parse(testCases), // Assuming test cases are sent as a JSON string
      inputFile: inputFile.buffer,
      inputFileContentType: inputFile.mimetype,
      outputFile: outputFile.buffer,
      outputFileContentType: outputFile.mimetype,
    });

    await customProblem.save();
    res.json({ problemId });
  } catch (error) {
    console.error('Error saving problem:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

module.exports = { createCustomProblem };
