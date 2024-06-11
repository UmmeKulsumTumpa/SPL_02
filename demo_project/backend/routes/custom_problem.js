const express = require('express');
const multer = require('multer');
const { createCustomProblem, getCustomProblemById, updateCustomProblemById } = require('../repositories/custom_problem_repo');

const router = express.Router();
const upload = multer();

// Define the route for creating a custom problem
router.post('/', upload.fields([
  { name: 'inputFile' },
  { name: 'outputFile' },
]), createCustomProblem);

// Define the route for getting a custom problem by ID
router.get('/get_problem/:problemId', getCustomProblemById);


// Define the route for updating a custom problem by ID
router.put('/update/:problemId', upload.fields([
  { name: 'inputFile' },
  { name: 'outputFile' },
]), updateCustomProblemById);

module.exports = router;
