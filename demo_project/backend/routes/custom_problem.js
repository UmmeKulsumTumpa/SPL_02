const express = require('express');
const multer = require('multer');
const { createCustomProblem } = require('../repositories/custom_problem_repo');

const router = express.Router();
const upload = multer();

// Define the route for creating a custom problem
router.post('/', upload.fields([
  { name: 'problemDescription' },
  { name: 'inputFile' },
  { name: 'outputFile' },
]), createCustomProblem);

module.exports = router;
