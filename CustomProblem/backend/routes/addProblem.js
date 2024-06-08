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
    const { problemTitle, timeLimit, memoryLimit } = req.body;
    if (!problemTitle || !timeLimit || !memoryLimit) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (req.files['problemDescription'][0].mimetype !== 'application/pdf') {
      return res.status(400).json({ error: 'Problem description must be a PDF file' });
    }
    if (req.files['inputFile'][0].mimetype !== 'text/plain') {
      return res.status(400).json({ error: 'Input file must be a TXT file' });
    }
    if (req.files['outputFile'][0].mimetype !== 'text/plain') {
      return res.status(400).json({ error: 'Output file must be a TXT file' });
    }

    const problemId = await generateProblemId();

    const temporaryData = new TemporaryData({
      problemId,
      problemTitle,
      timeLimit,
      memoryLimit,
      problemDescription: req.files['problemDescription'][0].buffer,
      problemDescriptionContentType: req.files['problemDescription'][0].mimetype,
      inputFile: req.files['inputFile'][0].buffer,
      inputFileContentType: req.files['inputFile'][0].mimetype,
      outputFile: req.files['outputFile'][0].buffer,
      outputFileContentType: req.files['outputFile'][0].mimetype,
    });

    await temporaryData.save();
    res.json({ problemId });
  } catch (error) {
    console.error('Error saving problem:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

module.exports = router;

