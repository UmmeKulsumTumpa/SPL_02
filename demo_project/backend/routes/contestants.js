const express = require('express');
const router = express.Router();
const {
	getAllContestants,
	addNewContestant,
	removeContestant,
	updateContestant,
	getContestantByUsername,
	getContestantByEmail,
	submitProblemSolution
} = require('../repositories/contestant_repo'); // Updated import

// Route to get all contestants
router.get('/', getAllContestants);

// Route to add a new contestant
router.post('/add', addNewContestant);

// Route to remove a contestant by username
router.delete('/remove/:username', removeContestant);

// Route to update a contestant by username
router.put('/update/:username', updateContestant);

// Route to retrieve a single contestant by username
router.get('/username/:username', getContestantByUsername);

// Route to retrieve a single contestant by email
router.get('/email/:email', getContestantByEmail);

// Route to submit a problem solution
router.post('/submit/:username', submitProblemSolution);

module.exports = router;
