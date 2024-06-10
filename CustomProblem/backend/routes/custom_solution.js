const express = require('express');
const multer = require('multer');
const { submitSolution } = require('../repositories/custom_solution_submission');

const router = express.Router();
const upload = multer();

// POST route to submit solution
router.post('/', upload.single('solutionFile'), async (req, res) => {
    try {
        const { problemId } = req.body;
        const solutionFile = req.file;

        if (!solutionFile) {
            return res.status(400).json({ error: 'Solution file is required' });
        }

        const result = await submitSolution(problemId, solutionFile);

        res.json(result);
    } catch (error) {
        console.error('Error submitting solution:', error);
        if (error.response) {
            console.error('Error response data:', error.response.data);
            console.error('Error response status:', error.response.status);
            console.error('Error response headers:', error.response.headers);
            res.status(error.response.status).json({ error: 'Piston API error', details: error.response.data });
        } else if (error.request) {
            console.error('Error request data:', error.request);
            res.status(500).json({ error: 'No response from Piston API', details: error.message });
        } else {
            console.error('Error message:', error.message);
            res.status(500).json({ error: 'Server error', details: error.message });
        }
    }
});

module.exports = router;
