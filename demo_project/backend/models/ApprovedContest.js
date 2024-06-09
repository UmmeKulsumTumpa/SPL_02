const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const approvedProblemSchema = new Schema({
    pid: { type: String, required: true },
    title: { type: String, required: true },
    statement: { type: String, required: true },
    constraints: { type: String, required: true },
    testCase: { type: String, required: true }
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
    approvalTime: { type: Date, required: true }
});

const ApprovedContest = mongoose.model('ApprovedContest', contestSchema);
module.exports = ApprovedContest;
