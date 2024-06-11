const express = require('express');
const multer = require('multer');
const { createCustomProblem, getCustomProblemById, getAllCustomProblems, updateCustomProblemById } = require('../repositories/custom_problem_repo');

const router = express.Router();
const upload = multer();

// Define the route for creating a custom problem
router.post('/', upload.fields([
  { name: 'inputFile' },
  { name: 'outputFile' },
]), createCustomProblem);

// Define the route for getting a custom problem by ID
router.get('/get_problem/:problemId', getCustomProblemById);

// Define the route for getting all custom problems
router.get('/get_all_problems', getAllCustomProblems);

// Define the route for updating a custom problem by ID
router.put('/update/:problemId', upload.fields([
  { name: 'inputFile' },
  { name: 'outputFile' },
]), updateCustomProblemById);

// Test route to verify routing
// router.get('/test', (req, res) => {
//   res.json({ message: 'Test route works' });
// });

// // Catch-all route for undefined paths
// router.use((req, res, next) => {
//   console.log(req.params);
//   res.status(404).json({ error: 'Route not found' });
// });

module.exports = router;
