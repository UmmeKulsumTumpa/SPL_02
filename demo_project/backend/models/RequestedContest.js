
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const testCaseSchema = new mongoose.Schema({
    input: { type: String, required: true },
    output: { type: String, required: true },
  });

const baseProblemSchema = new Schema({
    type: { type: String, required: true, enum: ['CS', 'CF'] },
    title: { type: String },
    pid: { type: String },
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

const contestSchema = new Schema({
    cid: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    problems: [baseProblemSchema],
    author: {
        authorName: { type: String, required: true },
        authorEmail: { type: String, required: true }
    },
    requestTime: { type: Date, required: true }
});

const Contest = mongoose.model('Contest', contestSchema);
module.exports = Contest;
