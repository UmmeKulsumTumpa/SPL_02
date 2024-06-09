const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const solutionSchema = new mongoose.Schema({
  sid: { type: String, default: uuidv4, unique: true },
  problem: { type: mongoose.Schema.Types.ObjectId, ref: 'TempProblem', required: true },
  solutionCode: { type: String, required: true },
  verdict: { type: String, default: 'Pending' },
  execTime: { type: Number, default: 0 },
});

const Solution = mongoose.model('Solution', solutionSchema);

module.exports = Solution;
