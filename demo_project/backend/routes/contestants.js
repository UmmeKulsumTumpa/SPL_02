const express = require('express');
const router = express.Router();
const Contestant = require('../models/Contestant');

// Route to get all contestants
router.get('/', async (req, res) => {
  try {
    const contestants = await Contestant.find();
    res.json(contestants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route to add a new contestant
router.post('/', async (req, res) => {
  const { uid, username, password, email } = req.body;

  try {
    // Check if the username or email already exists
    const existingContestant = await Contestant.findOne({
      $or: [{ username }, { email }],
    });

    if (existingContestant) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    // Create a new contestant
    const newContestant = new Contestant({
      uid,
      username,
      password,
      email,
    });

    // Save the new contestant
    const savedContestant = await newContestant.save();
    res.json(savedContestant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;