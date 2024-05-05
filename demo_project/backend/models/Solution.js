const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const solutionSchema = new Schema({
  sid: { type: String, required: true },
  problem: { type: Schema.Types.ObjectId, ref: 'Problem', required: true }
});

const Solution = mongoose.model('Solution', solutionSchema);
module.exports = Solution;