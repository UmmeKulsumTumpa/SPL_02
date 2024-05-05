const express = require('express');
const router = express.Router();
const Contestant = require('../models/Contestant');

// Route for user login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the contestant with the provided username
    const contestant = await Contestant.findOne({ username });

    // Check if the contestant exists and the password is correct
    if (contestant && contestant.password === password) {
      // Authentication successful
      res.json({ success: true });
    } else {
      // Authentication failed
      res.json({ success: false, error: 'Invalid username or password' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;