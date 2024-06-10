const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const approvedProblemSchema = new Schema({
    type: { type: String, required: true },
    pid: { type: String },
    title: { type: String, required: true },
    statement: { type: String },
    constraints: { type: String },
    testCase: { type: String },
    description: { type: Buffer, contentType: String },
    aliasName: {type: String},
});

const contestSubmittedProblem = new Schema({
    type: String,
    pid: String,
    solution: String,
    result: Schema.Types.Mixed,
}, { _id: false });

const leaderboardSchema = new Schema({
    username: { type: String, required: true },
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
