const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const problemSchema = new Schema({
	pid: { type: String, required: true },
	title: { type: String, required: true },
	testCase: { type: String, required: true },
	statement: { type: String, required: true },
	constraints: { type: String, required: true },
	alias: {type: String}
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