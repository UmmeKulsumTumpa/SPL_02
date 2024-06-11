const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const CustomProblem = require('../models/CustomProblem');
const { submitSolution } = require('../repositories/custom_solution_submission');
const Solution = require('../models/Solution');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/submit/:contestId/:username', upload.single('solutionFile'), async (req, res) => {
    const { contestId, username } = req.params;
    const { problemId: pid } = req.body;

    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }

    const solutionCode = fs.readFileSync(req.file.path, 'utf8');
    console.log('solution', solutionCode);

    try {
        console.log('before submitting');
        const result = await submitSolution(pid, req.file, contestId, username); // Pass contestId and username
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        // Clean up uploaded file
        fs.unlinkSync(req.file.path);
    }
});

// Added route to retrieve a solution by sid
router.get('/solution/:sid', async (req, res) => {
    const { sid } = req.params;

    try {
        const solution = await Solution.findOne({ sid });
        if (!solution) {
            return res.status(404).json({ error: 'Solution not found.' });
        }
        res.json(solution);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
