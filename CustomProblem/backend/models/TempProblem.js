const mongoose = require('mongoose');

const tempProblemSchema = new mongoose.Schema({
  problemId: { type: String, required: true },
  problemTitle: { type: String, required: true },
  timeLimit: { type: String, required: true },
  memoryLimit: { type: String, required: true },
  problemDescription: { type: Buffer, contentType: String },
  inputFile: { type: Buffer, contentType: String },
  outputFile: { type: Buffer, contentType: String },
});

const TempProblem = mongoose.model('TempProblem', tempProblemSchema);

module.exports = TempProblem;
