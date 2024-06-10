const mongoose = require('mongoose');

const customProblemSchema = new mongoose.Schema({
  problemId: { type: String, required: true, unique: true },
  problemTitle: { type: String, required: true },
  timeLimit: { type: String, required: true },
  memoryLimit: { type: String, required: true },
  problemDescription: { type: Buffer, contentType: String },
  inputFile: { type: Buffer, contentType: String },
  outputFile: { type: Buffer, contentType: String },
});

const CustomProblem = mongoose.model('CustomProblem', customProblemSchema);

module.exports = CustomProblem;
