const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const problemSchema = new Schema({
    pid: { type: String, required: true },
    title: { type: String, required: true },
    statement: { type: String, required: true },
    constraints: { type: String, required: true },
    testCase: { type: String, required: true }
});

const contestSchema = new Schema({
    cid: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    problems: [problemSchema],
    author: {
        authorName: { type: String, required: true },
        authorEmail: { type: String, required: true }
    },
    requestTime: { type: Date, required: true }
});

const Contest = mongoose.model('Contest', contestSchema);
module.exports = Contest;
