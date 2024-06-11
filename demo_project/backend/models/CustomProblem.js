const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const testCaseSchema = new mongoose.Schema({
  input: { type: String, required: true },
  output: { type: String, required: true },
});

const customProblemSchema = new mongoose.Schema({
  problemId: { type: String, required: true },
  problemTitle: { type: String, required: true },
  timeLimit: { type: String, required: true },
  memoryLimit: { type: String, required: true },
  problemDescription: { type: String, required: true },
  testCases: [testCaseSchema],
  inputFile: { type: Buffer, required: true },
  inputFileContentType: { type: String, required: true },
  outputFile: { type: Buffer, required: true },
  outputFileContentType: { type: String, required: true },
});

const CustomProblem = mongoose.model('CustomProblem', customProblemSchema);

module.exports = CustomProblem;