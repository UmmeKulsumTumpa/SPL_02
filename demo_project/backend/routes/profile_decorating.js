const express = require('express');
const router = express.Router();
const ApprovedContest = require('../models/ApprovedContest');
const { calculateUserProfileData } = require('../repositories/profile_decorating_repo');

router.get('/user-profile/:username', async (req, res) => {
    const {username} = req.params;
    // console.log(username);
    if (!username) {
        return res.status(400).send({ error: 'Username is required' });
    }

    try {
        const contests = await ApprovedContest.find({});
        // console.log(contests);
        const profileData = calculateUserProfileData(username, contests);
        console.log(profileData);
        res.send(profileData);
    } catch (error) {
        res.status(500).send({ error: 'An error occurred while fetching user profile data' });
    }
});

module.exports = router;
