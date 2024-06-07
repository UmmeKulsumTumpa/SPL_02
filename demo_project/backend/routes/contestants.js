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
    checkContestantExists
} = require('../repositories/contestant_repo');

router.get('/', getAllContestants);

router.post('/add', addNewContestant);

router.delete('/remove/:username', removeContestant);

router.put('/update/:username', updateContestant);

router.get('/username/:username', getContestantByUsername);

router.get('/email/:email', getContestantByEmail);

router.post('/submit/:username', submitProblemSolution);

router.get('/contestantExist/:username', checkContestantExists);

module.exports = router;
