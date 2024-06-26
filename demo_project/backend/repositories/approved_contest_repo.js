// controllers/approvedContestRepo.js

const ApprovedContest = require('../models/ApprovedContest');
const axios = require('axios');

const getNextContestId = async () => {
    const contestCount = await ApprovedContest.countDocuments();
    return `CS${contestCount + 1}`;
};

// let reqcontestCounter = 0;

// const getNextContestId = async () => {
//     const highestContest = await ApprovedContest.findOne().sort({ acid: -1 });
//     reqcontestCounter = highestContest ? parseInt(highestContest.acid.replace('CS', '')) : 0;
//     return `CS${++reqcontestCounter}`;
// };

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
        const { title, description, startTime, endTime, problems, author, approvedBy, approvalTime } = req.body;
        const acid = await getNextContestId();

        if (!title || !description || !startTime || !endTime || !problems || !author || !approvedBy || !approvalTime) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const formattedProblems = problems.map(problem => {
            const formattedProblem = {
                type: problem.type,
                pid: problem.pid,
                title: problem.title,
                statement: problem.statement,
                constraints: problem.constraints,
                testCase: problem.testCase,
                aliasName: problem.aliasName,
                timeLimit: problem.timeLimit,
                memoryLimit: problem.memoryLimit,
                problemDescription: problem.problemDescription,
                testCases: problem.testCases.map(tc => ({
                    input: tc.input,
                    output: tc.output
                })),
                inputFile: problem.inputFile ? Buffer.from(problem.inputFile, 'base64') : undefined,
                inputFileContentType: problem.inputFileContentType,
                outputFile: problem.outputFile ? Buffer.from(problem.outputFile, 'base64') : undefined,
                outputFileContentType: problem.outputFileContentType,
            };
            return formattedProblem;
        });

        const newApprovedContest = new ApprovedContest({
            acid,
            title,
            description,
            startTime: new Date(startTime),
            endTime: new Date(endTime),
            problems: formattedProblems,
            author,
            approvedBy,
            approvalTime: new Date(approvalTime)
        });

        const savedContest = await newApprovedContest.save();
        // console.log('approved', savedContest);
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
            const problemDocs = problems.map(problem => {
                const problemDoc = {
                    type: problem.type,
                    pid: problem.pid,
                    title: problem.title,
                    statement: problem.statement,
                    constraints: problem.constraints,
                    testCase: problem.testCase,
                    aliasName: problem.aliasName,
                    timeLimit: problem.timeLimit,
                    memoryLimit: problem.memoryLimit,
                    problemDescription: problem.problemDescription,
                    testCases: problem.testCases.map(tc => ({
                        input: tc.input,
                        output: tc.output
                    })),
                    inputFile: problem.inputFile ? Buffer.from(problem.inputFile, 'base64') : undefined,
                    inputFileContentType: problem.inputFileContentType,
                    outputFile: problem.outputFile ? Buffer.from(problem.outputFile, 'base64') : undefined,
                    outputFileContentType: problem.outputFileContentType,
                };
                return problemDoc;
            });
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
        res.status( 500 ).json({ error: 'Failed to delete approved contest', details: err.message });
    }
};

// Register a user for a specific approved contest
const registerUserForContest = async (req, res) => {
    try {
        const { username } = req.body;
        const { id } = req.params;

        // Find the contest by acid
        const contest = await ApprovedContest.findOne({ acid: id });
        if (!contest) {
            return res.status(404).json({ error: 'Approved contest not found' });
        }

        // Check if the user is already registered
        if (contest.participatedUsers.includes(username)) {
            return res.status(400).json({ error: 'User is already registered for this contest' });
        }

        // Add the user to the participatedUsers array
        contest.participatedUsers.push(username);

        // Save the updated contest document
        const updatedContest = await contest.save();

        res.json(updatedContest);
    } catch (err) {
        res.status(500).json({ error: 'Failed to register user for contest', details: err.message });
    }
};

// Submit a problem solution
const submitProblemSolution = async (req, res) => {
    const { acid, username } = req.params;
    const { type, pid, solution } = req.body;

    try {
        // Call the solution route to submit the problem
        const response = await axios.post('http://localhost:8000/api/solution/submit', {
            type,
            pid,
            solution,
        });

        const submissionResult = response.data;

        // Update the contest's leaderboard with the submission result
        const contest = await ApprovedContest.findOne({ acid });
        if (!contest) {
            return res.status(404).json({ error: 'Contest not found' });
        }

        // Find the user in the leaderboard or add them if they don't exist
        const leaderboardEntry = contest.leaderboard.find(entry => entry.username === username);
        const currentTime = new Date();
        const contestStartTime = new Date(contest.startTime);
        const submissionTime = Math.floor((currentTime - contestStartTime) / 1000); // Convert to seconds

        if (leaderboardEntry) {
            leaderboardEntry.submittedProblems.push({
                type,
                pid,
                solution,
                result: submissionResult,
            });

            if (submissionResult.verdict === 'OK') {
                leaderboardEntry.totalSolved += 1;
            }

            leaderboardEntry.totalSubmissionTime += submissionTime;
        } else {
            const newEntry = {
                username,
                totalSolved: submissionResult.verdict === 'OK' ? 1 : 0,
                totalSubmissionTime: submissionTime,
                submittedProblems: [{
                    type,
                    pid,
                    solution,
                    result: submissionResult,
                }],
            };

            contest.leaderboard.push(newEntry);
        }

        // Save the updated contest
        const updatedContest = await contest.save();

        res.json(submissionResult);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Submit a custom problem solution
const customSubmitSolution = async (req, res) => {
    const { acid, username } = req.params;
    const { sid } = req.body;

    try {
        console.log('sid: ', sid);
        // Fetch the submission result from the custom problem submission route using the sid
        const response = await axios.get(`http://localhost:8000/api/custom_solution_submit/solution/${sid}`);
        const submissionResult = response.data;
        console.log('response:', response.data);

        // Declare and assign the verdict
        let verdict;
        if (submissionResult.verdict === 'Accepted') {
            verdict = 'OK';
        } else {
            verdict = submissionResult.verdict;
        }

        // Update the contest's leaderboard with the submission result
        const contest = await ApprovedContest.findOne({ acid });
        if (!contest) {
            return res.status(404).json({ error: 'Contest not found' });
        }

        // Find the user in the leaderboard or add them if they don't exist
        const leaderboardEntry = contest.leaderboard.find(entry => entry.username === username);
        const currentTime = new Date();
        const contestStartTime = new Date(contest.startTime);
        const submissionTime = Math.floor((currentTime - contestStartTime) / 1000); // Convert to seconds

        if (leaderboardEntry) {
            leaderboardEntry.submittedProblems.push({
                type: 'CS',
                pid: submissionResult.problemId,
                solution: submissionResult.solutionCode,
                result: submissionResult,
            });

            if (verdict === 'OK') {
                leaderboardEntry.totalSolved += 1;
            }

            leaderboardEntry.totalSubmissionTime += submissionTime;
        } else {
            const newEntry = {
                username,
                totalSolved: verdict === 'OK' ? 1 : 0,
                totalSubmissionTime: submissionTime,
                submittedProblems: [{
                    type: 'CS',
                    pid: submissionResult.problemId,
                    solution: submissionResult.solutionCode,
                    result: submissionResult,
                }],
            };

            contest.leaderboard.push(newEntry);
        }

        // Save the updated contest
        const updatedContest = await contest.save();

        res.json(submissionResult);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};




// Get contests by contestant name
const getContestsByContestantName = async (req, res) => {
    try {
        const { username } = req.params;

        // Find contests where the leaderboard contains the given username
        const contests = await ApprovedContest.find({
            'leaderboard.username': username
        });

        // Filter the leaderboard to include only entries matching the given username
        const filteredContests = contests.map(contest => {
            const filteredLeaderboard = contest.leaderboard.filter(entry => entry.username === username);
            return {
                ...contest.toObject(),
                leaderboard: filteredLeaderboard
            };
        });

        res.json(filteredContests);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch contests by contestant name', details: err.message });
    }
};

module.exports = {
    getAllApprovedContests,
    getApprovedContestById,
    createApprovedContest,
    updateApprovedContest,
    deleteApprovedContest,
    registerUserForContest,
    submitProblemSolution,
    getContestsByContestantName,
    customSubmitSolution,
};
