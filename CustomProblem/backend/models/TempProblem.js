// models/TempProblem.js
const mongoose = require('mongoose');

const TempProblemSchema = new mongoose.Schema({
  problemId: { type: String, unique: true },
  problemTitle: String,
  timeLimit: Number,
  memoryLimit: Number,
  problemDescription: Buffer,
  problemDescriptionContentType: String,
  testCases: String,
  inputFile: Buffer,
  inputFileContentType: String,
  outputFile: Buffer,
  outputFileContentType: String,
}, { timestamps: true });

const TempProblem = mongoose.model('TempProblem', TempProblemSchema);

module.exports = TempProblem;
