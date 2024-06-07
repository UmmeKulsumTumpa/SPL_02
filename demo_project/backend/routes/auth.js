const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const Contestant = require('../models/Contestant');

// Function to authenticate user
const authenticateUser = async (username, password) => {
	// Check if the user is an admin
	let user = await Admin.findOne({ username });
	if (user && user.password === password) {
		return { username: user.username, role: 'admin' };
	}

	// Check if the user is a contestant
	user = await Contestant.findOne({ username });
	if (user && user.password === password) {
		return { username: user.username, role: 'contestant' };
	}

	// Return null if no user is found
	return null;
};

// Route for user login
router.post('/login', async (req, res) => {
	const { username, password } = req.body;

	try {
		const user = await authenticateUser(username, password);

		if (user) {
			// Authentication successful
			res.json({ success: true, username: user.username, role: user.role });
		} else {
			// Authentication failed
			res.json({ success: false, error: 'Invalid username or password' });
		}
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

module.exports = router;
