const express = require('express');
const multer = require('multer');
const TemporaryData = require('../models/TempProblem');

const router = express.Router();
const upload = multer();

// Generate problem ID
const generateProblemId = async () => {
  const count = await TemporaryData.countDocuments();
  return `CS/${count + 1}T`;
};

router.post('/', upload.fields([
  { name: 'problemDescription' },
  { name: 'inputFile' },
  { name: 'outputFile' },
]), async (req, res) => {
  try {
    const { problemTitle, timeLimit, memoryLimit, testCases } = req.body;
    const problemId = await generateProblemId();

    const temporaryData = new TemporaryData({
      problemId,
      problemTitle,
      timeLimit,
      memoryLimit,
      problemDescription: req.files['problemDescription'][0].buffer,
      problemDescriptionContentType: req.files['problemDescription'][0].mimetype,
      testCases,
      inputFile: req.files['inputFile'][0].buffer,
      inputFileContentType: req.files['inputFile'][0].mimetype,
      outputFile: req.files['outputFile'][0].buffer,
      outputFileContentType: req.files['outputFile'][0].mimetype,
    });

    await temporaryData.save();
    res.json({ problemId });
  } catch (error) {
    console.error('Error saving problem', error);
    res.status(500).send('Server error');
  }
});

module.exports = router;
