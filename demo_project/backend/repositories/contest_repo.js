// repositories/contest_repo.js
const Contest = require('../models/Contest');
const Problem = require('../models/Problem');

let contestCounter = 0;

const getNextContestId = async () => {
    const highestContest = await Contest.findOne().sort({ cid: -1 });
    contestCounter = highestContest ? parseInt(highestContest.cid.slice(1)) : 0;
    return `CS${++contestCounter}`;
};

// Get all contests
const getAllContests = async (req, res) => {
    try {
        const contests = await Contest.find().populate('problems');
        res.json(contests);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch contests', details: err.message });
    }
};

// Get a single contest by ID
const getContestById = async (req, res) => {
    try {
        const contest = await Contest.findOne({ cid: req.params.id }).populate('problems');
        if (!contest) {
            return res.status(404).json({ error: 'Contest not found' });
        }
        res.json(contest);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch contest', details: err.message });
    }
};

// Create a new contest
const createContest = async (req, res) => {
    try {
        const { title, description, startTime, endTime, problems } = req.body;

        if (!title || !description || !startTime || !endTime || !problems) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const cid = await getNextContestId();
        const problemDocs = await Promise.all(problems.map(async (prob, index) => {
            const problem = new Problem({ ...prob, pid: `${cid}_P${index + 1}` });
            return await problem.save();
        }));

        const newContest = new Contest({
            cid,
            title,
            description,
            startTime: new Date(startTime),
            endTime: new Date(endTime),
            problems: problemDocs.map(p => p._id)
        });

        const savedContest = await newContest.save();
        res.status(201).json(savedContest);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create contest', details: err.message });
    }
};

// Update an existing contest
const updateContest = async (req, res) => {
    try {
        const { title, description, startTime, endTime, problems } = req.body;
        const updatedFields = { title, description, startTime: new Date(startTime), endTime: new Date(endTime) };

        if (problems) {
            const problemDocs = await Promise.all(problems.map(async (prob, index) => {
                if (prob._id) {
                    return await Problem.findByIdAndUpdate(prob._id, prob, { new: true });
                } else {
                    const problem = new Problem({ ...prob, pid: `${req.params.id}_P${index + 1}` });
                    return await problem.save();
                }
            }));
            updatedFields.problems = problemDocs.map(p => p._id);
        }

        const updatedContest = await Contest.findOneAndUpdate(
            { cid: req.params.id },
            updatedFields,
            { new: true }
        ).populate('problems');

        if (!updatedContest) {
            return res.status(404).json({ error: 'Contest not found' });
        }
        res.json(updatedContest);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update contest', details: err.message });
    }
};

// Delete a contest
const deleteContest = async (req, res) => {
    try {
        const contest = await Contest.findOne({ cid: req.params.id });
        if (!contest) {
            return res.status(404).json({ error: 'Contest not found' });
        }

        await Problem.deleteMany({ _id: { $in: contest.problems } });
        await Contest.findOneAndDelete({ cid: req.params.id });

        res.json({ message: 'Contest and its problems deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete contest', details: err.message });
    }
};

module.exports = {
    getAllContests,
    getContestById,
    createContest,
    updateContest,
    deleteContest
};
