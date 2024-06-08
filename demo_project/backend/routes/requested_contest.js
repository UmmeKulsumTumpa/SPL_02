const express = require('express');
const router = express.Router();
const contestRepo = require('../repositories/requested_contest_repo');

// Get all contests
router.get('/', contestRepo.getAllContests);

// Get a single contest by ID
router.get('/:id', contestRepo.getContestById);

// Create a new contest
router.post('/create', contestRepo.createContest);

// Update an existing contest
router.put('/update/:id', contestRepo.updateContest);

// Delete a contest
router.delete('/delete/:id', contestRepo.deleteContest);

module.exports = router;
