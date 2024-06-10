const express = require('express');
const SolutionVisualizationRepository = require('../repositories/SolutionVisualizationRepository');

const router = express.Router();

router.post('/solutions/visualize', async (req, res) => {
    const { solutionId, testCase } = req.body;
    const cfgData = await SolutionVisualizationRepository.generateCFG(solutionId, testCase);
    res.json(cfgData);
});

module.exports = router;
