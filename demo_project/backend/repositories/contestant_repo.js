const Contestant = require('../models/Contestant');
const axios = require('axios');
const role = 'contestant';
const bcrypt = require('bcrypt');

// Function to get all contestants
const getAllContestants = async (req, res) => {
    try {
        const contestants = await Contestant.find();
        res.json(contestants);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Function to add a new contestant
const addNewContestant = async (req, res) => {
    const { username, password, email } = req.body;

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
            username,
            password,
            email,
        });

        // Save the new contestant
        const savedContestant = await newContestant.save();
        res.json({success: true, contestant: savedContestant, role});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Function to remove a contestant by username
const removeContestant = async (req, res) => {
    const { username } = req.params;

    try {
        const removedContestant = await Contestant.findOneAndDelete({ username });
        if (!removedContestant) {
            return res.status(404).json({ error: 'Contestant not found' });
        }
        res.json({ message: 'Contestant removed successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Function to update a contestant by username
const updateContestant = async (req, res) => {
    const { username } = req.params;
    const { password, email } = req.body;

    try {
        const updatedContestant = await Contestant.findOneAndUpdate(
            { username },
            { password, email },
            { new: true }
        );
        if (!updatedContestant) {
            return res.status(404).json({ error: 'Contestant not found' });
        }
        res.json(updatedContestant);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Function to retrieve a single contestant by username
const getContestantByUsername = async (req, res) => {
    const { username } = req.params;

    try {
        const contestant = await Contestant.findOne({ username });
        if (!contestant) {
            return res.status(404).json({ error: 'Contestant not found' });
        }
        res.json(contestant);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Function to retrieve a single contestant by email
const getContestantByEmail = async (req, res) => {
    const { email } = req.params;

    try {
        const contestant = await Contestant.findOne({ email });
        if (!contestant) {
            return res.status(404).json({ error: 'Contestant not found' });
        }
        res.json(contestant);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Function to submit a problem solution
const submitProblemSolution = async (req, res) => {
    const { username } = req.params;
    const { type, pid, solution } = req.body;

    try {
        // Call the solution route to submit the problem
        const response = await axios.post('http://localhost:8000/api/solution/submit', {
            type,
            pid,
            solution,
        });

        const submissionResult = response.data;

        // Update the contestant's information with the submission result
        const updatedContestant = await Contestant.findOneAndUpdate(
            { username },
            {
                $push: {
                    submittedProblems: {
                        type,
                        pid,
                        solution,
                        result: submissionResult,
                    },
                },
            },
            { new: true }
        );

        if (!updatedContestant) {
            return res.status(404).json({ error: 'Contestant not found' });
        }

        res.json(submissionResult);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Function to check if a user exists
const checkContestantExists = async (req, res) => {
    const { username } = req.params;

    try {
        const contestant = await Contestant.findOne({ username });
        res.json({ exists: !!contestant });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Function to update a contestant's password
const updateContestantPassword = async (req, res) => {
    const { username } = req.params;
    const { currentPassword, newPassword } = req.body;

    try {
        // Find the contestant by username
        const contestant = await Contestant.findOne({ username });

        if (!contestant) {
            return res.status(404).json({ error: 'Contestant not found' });
        }

        // Check if the current password matches
        if (contestant.password !== currentPassword) {
            return res.status(400).json({ error: 'Current password is incorrect' });
        }

        // Update the contestant's password
        contestant.password = newPassword;
        await contestant.save();

        res.json({ success: true, message: 'Password updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getAllContestants,
    addNewContestant,
    removeContestant,
    updateContestant,
    getContestantByUsername,
    getContestantByEmail,
    submitProblemSolution,
    checkContestantExists,
    updateContestantPassword, // Add the new function to the exports
};
