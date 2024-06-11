const Contest = require('../models/RequestedContest');
const axios = require('axios');

let reqcontestCounter = 0;

const getNextContestId = async () => {
    const highestContest = await Contest.findOne().sort({ cid: -1 });
    reqcontestCounter = highestContest ? parseInt(highestContest.cid.replace('CS-req', '')) : 0;
    return `CS-req${++reqcontestCounter}`;
};

const fetchProblemDetails = async (type, pid) => {
    console.log(pid);
    const url = type === 'CF'
        ? `http://localhost:8000/api/problem/retrieve/${type}/${pid}`
        : `http://localhost:8000/api/add_custom_problem/get_problem/${pid}`;
    const response = await axios.get(url);
    console.log(response.data);
    return response.data;
};

// Get all contests
const getAllContests = async (req, res) => {
    try {
        const contests = await Contest.find();
        res.json(contests);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch contests', details: err.message });
    }
};

// Get a single contest by ID
const getContestById = async (req, res) => {
    try {
        const contest = await Contest.findOne({ cid: req.params.id });
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
        const { title, description, startTime, endTime, problems, author, requestTime } = req.body;

        if (!title || !description || !startTime || !endTime || !problems || !author || !requestTime) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const cid = await getNextContestId();

        const problemDocs = await Promise.all(problems.map(async (prob, index) => {
            const problemDetails = await fetchProblemDetails(prob.type, prob.pid);
            console.log(problemDetails);
            if (prob.type === 'CF') {
                const problemDoc = {
                    type: prob.type,
                    pid: `${prob.type}/${prob.pid}`,
                    title: problemDetails.title,
                    statement: JSON.stringify(problemDetails.statement),
                    constraints: `Time Limit: ${problemDetails.timeLimit}\nMemory Limit: ${problemDetails.memoryLimit}\n${problemDetails.input}\n${problemDetails.output}`,
                    testCase: JSON.stringify(problemDetails.statement.sampleTests)
                };
                if (prob.aliasName) problemDoc.aliasName = prob.aliasName;
                return problemDoc;
            } else if (prob.type === 'CS') {
                const problemDoc = {
                    type: prob.type,
                    pid: `${prob.pid}`,
                    title: problemDetails.problemTitle,
                    problemDescription: problemDetails.problemDescription,
                    constraints: `Time Limit: ${problemDetails.timeLimit}\nMemory Limit: ${problemDetails.memoryLimit}`,
                    testCase: JSON.stringify(problemDetails.testCases),
                    inputFile: problemDetails.inputFile,
                    inputFileContentType: problemDetails.inputFileContentType,
                    outputFile: problemDetails.outputFile,
                    outputFileContentType: problemDetails.outputFileContentType,
                };
                if (prob.aliasName) problemDoc.aliasName = prob.aliasName;
                return problemDoc;
            } else {
                throw new Error('Unsupported problem type');
            }
        }));

        console.log(problemDocs);

        const newContest = new Contest({
            cid,
            title,
            description,
            startTime: new Date(startTime),
            endTime: new Date(endTime),
            problems: problemDocs,
            author,
            requestTime: new Date(requestTime)
        });

        console.log(newContest);

        const savedContest = await newContest.save();
        console.log(savedContest);
        res.status(201).json(savedContest);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create contest', details: err.message });
    }
};

// Update an existing contest
const updateContest = async (req, res) => {
    try {
        const { title, description, startTime, endTime, problems, author, requestTime } = req.body;
        const updatedFields = { title, description, startTime: new Date(startTime), endTime: new Date(endTime), author, requestTime: new Date(requestTime) };

        if (problems) {
            const problemDocs = await Promise.all(problems.map(async (prob, index) => {
                const problemDetails = await fetchProblemDetails(prob.type, prob.pid);
                if (prob.type === 'CF') {
                    const problemDoc = {
                        type: prob.type,
                        pid: prob.pid,
                        title: problemDetails.title,
                        statement: JSON.stringify(problemDetails.statement),
                        constraints: `Time Limit: ${problemDetails.timeLimit}\nMemory Limit: ${problemDetails.memoryLimit}\n${problemDetails.input}\n${problemDetails.output}`,
                        testCase: JSON.stringify(problemDetails.statement.sampleTests)
                    };
                    if (prob.aliasName) problemDoc.aliasName = prob.aliasName;
                    return problemDoc;
                } else if (prob.type === 'CS') {
                    const problemDoc = {
                        type: prob.type,
                        pid: `${prob.type}/${prob.pid}`,
                        title: problemDetails.problemTitle,
                        statement: problemDetails.problemDescription,
                        constraints: `Time Limit: ${problemDetails.timeLimit}\nMemory Limit: ${problemDetails.memoryLimit}`,
                        testCase: JSON.stringify(problemDetails.testCases)
                    };
                    if (prob.aliasName) problemDoc.aliasName = prob.aliasName;
                    return problemDoc;
                } else {
                    throw new Error('Unsupported problem type');
                }
            }));
            updatedFields.problems = problemDocs;
        }

        const updatedContest = await Contest.findOneAndUpdate(
            { cid: req.params.id },
            updatedFields,
            { new: true }
        );

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
