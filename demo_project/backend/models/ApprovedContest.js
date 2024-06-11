// models/ApprovedContest.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const testCaseSchema = new mongoose.Schema({
    input: { type: String },
    output: { type: String },
});

const approvedProblemSchema = new Schema({
    type: { type: String, required: true },
    pid: { type: String },
    title: { type: String, required: true },
    statement: { type: String }, // only cf
    constraints: { type: String }, // only cf
    testCase: { type: String }, // only cf
    aliasName: { type: String },
    timeLimit: { type: String },
    memoryLimit: { type: String },
    problemDescription: { type: String },
    testCases: [testCaseSchema],
    inputFile: { type: Buffer },
    inputFileContentType: { type: String },
    outputFile: { type: Buffer },
    outputFileContentType: { type: String },
});

const contestSubmittedProblem = new Schema({
    type: String,
    pid: String,
    solution: String,
    result: Schema.Types.Mixed,
}, { _id: false });

const leaderboardSchema = new Schema({
    username: { type: String },
    totalSolved: { type: Number, default: 0 },
    totalSubmissionTime: { type: Number, default: 0 },
    submittedProblems: [contestSubmittedProblem],
});

const contestSchema = new Schema({
    acid: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    problems: [approvedProblemSchema],
    author: {
        authorName: { type: String, required: true },
        authorEmail: { type: String, required: true }
    },
    approvedBy: {
        adminName: { type: String, required: true },
        adminEmail: { type: String, required: true }
    },
    approvalTime: { type: Date },
    participatedUsers: [{ type: String }],
    leaderboard: [leaderboardSchema]
});

const ApprovedContest = mongoose.model('ApprovedContest', contestSchema);
module.exports = ApprovedContest;
