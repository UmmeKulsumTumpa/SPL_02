const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const problemSchema = new Schema({
  pid: { type: String, required: true },
  title: { type: String, required: true },
  testCase: { type: String, required: true },
  statement: { type: String, required: true },
  constraints: { type: String, required: true }
});

const Problem = mongoose.model('Problem', problemSchema);
module.exports = Problem;