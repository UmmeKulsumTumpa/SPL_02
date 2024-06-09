const ApprovedContest = require('../models/ApprovedContest');
const axios = require('axios');

let contestCounter = 0;

const getNextContestId = async () => {
    const highestContest = await ApprovedContest.findOne().sort({ acid: -1 });
    contestCounter = highestContest ? parseInt(highestContest.acid.slice(2)) : 0; // Adjust slice to match 'AC' prefix
    return `CS${++contestCounter}`;
};

// Get all approved contests
const getAllApprovedContests = async (req, res) => {
    try {
        const contests = await ApprovedContest.find();
        res.json(contests);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch approved contests', details: err.message });
    }
};

// Get a single approved contest by ID
const getApprovedContestById = async (req, res) => {
    try {
        const contest = await ApprovedContest.findOne({ acid: req.params.id });
        if (!contest) {
            return res.status(404).json({ error: 'Approved contest not found' });
        }
        res.json(contest);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch approved contest', details: err.message });
    }
};

// Create a new approved contest
const createApprovedContest = async (req, res) => {
    try {
        const {title, description, startTime, endTime, problems, author, approvedBy, approvalTime } = req.body;
        const acid = await getNextContestId();

        if (!title || !description || !startTime || !endTime || !problems || !author || !approvedBy || !approvalTime) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const newApprovedContest = new ApprovedContest({
            acid,
            title,
            description,
            startTime: new Date(startTime),
            endTime: new Date(endTime),
            problems,
            author,
            approvedBy,
            approvalTime: new Date(approvalTime)
        });

        const savedContest = await newApprovedContest.save();
        res.status(201).json(savedContest);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create approved contest', details: err.message });
    }
};

// Update an existing approved contest
const updateApprovedContest = async (req, res) => {
    try {
        const { title, description, startTime, endTime, problems, author, approvedBy, approvalTime } = req.body;
        const updatedFields = { title, description, startTime: new Date(startTime), endTime: new Date(endTime), author, approvedBy, approvalTime: new Date(approvalTime) };

        if (problems) {
            const problemDocs = await Promise.all(problems.map(async (prob, index) => {
                if (prob.pid) {
                    const problemDetails = await fetchProblemDetails(prob.type, prob.pid);
                    return {
                        pid: prob.pid,
                        title: problemDetails.title,
                        statement: JSON.stringify(problemDetails.statement),
                        constraints: `Time Limit: ${problemDetails.timeLimit}\nMemory Limit: ${problemDetails.memoryLimit}\n${problemDetails.input}\n${problemDetails.output}`,
                        testCase: JSON.stringify(problemDetails.statement.sampleTests)
                    };
                } else if (prob._id) {
                    return { ...prob };
                } else {
                    return { ...prob, pid: `${req.params.id}_P${index + 1}` };
                }
            }));
            updatedFields.problems = problemDocs;
        }

        const updatedContest = await ApprovedContest.findOneAndUpdate(
            { acid: req.params.id },
            updatedFields,
            { new: true }
        );

        if (!updatedContest) {
            return res.status(404).json({ error: 'Approved contest not found' });
        }
        res.json(updatedContest);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update approved contest', details: err.message });
    }
};

// Delete an approved contest
const deleteApprovedContest = async (req, res) => {
    try {
        const contest = await ApprovedContest.findOne({ acid: req.params.id });
        if (!contest) {
            return res.status(404).json({ error: 'Approved contest not found' });
        }

        await ApprovedContest.findOneAndDelete({ acid: req.params.id });

        res.json({ message: 'Approved contest and its problems deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete approved contest', details: err.message });
    }
};

module.exports = {
    getAllApprovedContests,
    getApprovedContestById,
    createApprovedContest,
    updateApprovedContest,
    deleteApprovedContest
};
