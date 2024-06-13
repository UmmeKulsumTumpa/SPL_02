const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const testCaseSchema = new mongoose.Schema({
    input: { type: String },
    output: { type: String },
});

const problemSchema = new Schema({
	// pid: { type: String, required: true },
	// title: { type: String, required: true },
	// testCase: { type: String, required: true },
	// statement: { type: String, required: true },
	// constraints: { type: String, required: true },
	// alias: {type: String},

	contestId: {type: String},
	type: { type: String },
    pid: { type: String },
    title: { type: String },
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

const Problem = mongoose.model('Problem', problemSchema);
module.exports = Problem;

/*

// models/Problem.js
const mongoose = require('mongoose');

const ProblemSchema = new mongoose.Schema({
  pid: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  statement: {
	text: [String],
	inputSpec: [String],
	outputSpec: [String],
	sampleTests: [{ input: String, output: String }],
	notes: [String]
  },
  constraints: { type: String, required: true },
  testCase: [{ input: String, output: String }]
});

module.exports = mongoose.model('Problem', ProblemSchema);

*/