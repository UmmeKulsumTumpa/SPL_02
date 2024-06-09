const express = require('express');
const router = express.Router();
const approvedContestRepo = require('../repositories/approved_contest_repo');

// Get all approved contests
router.get('/', approvedContestRepo.getAllApprovedContests);

// Get a single approved contest by ID
router.get('/:id', approvedContestRepo.getApprovedContestById);

// Create a new approved contest
router.post('/create', approvedContestRepo.createApprovedContest);

// Update an existing approved contest
router.put('/update/:id', approvedContestRepo.updateApprovedContest);

// Delete an approved contest
router.delete('/delete/:id', approvedContestRepo.deleteApprovedContest);

module.exports = router;
