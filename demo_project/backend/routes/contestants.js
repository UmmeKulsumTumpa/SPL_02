const express = require('express');
const router = express.Router();
const {
    getAllContestants,
    addNewContestant,
    removeContestant,
    updateContestant,
    getContestantByUsername,
    getContestantByEmail,
    submitProblemSolution,
    checkContestantExists,
    updateContestantPassword // Import the new function
} = require('../repositories/contestant_repo');

router.get('/', getAllContestants);

router.post('/add', addNewContestant);

router.delete('/remove/:username', removeContestant);

router.put('/update/:username', updateContestant);

router.get('/username/:username', getContestantByUsername);

router.get('/email/:email', getContestantByEmail);

router.post('/submit/:username', submitProblemSolution);

router.get('/contestantExist/:username', checkContestantExists);

// Add the new route for updating password
router.post('/change-password/:username', updateContestantPassword);

module.exports = router;
