const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const problemSetterSchema = new Schema({
  pid: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  registrationDate: { type: Date, default: Date.now }
});

const ProblemSetter = mongoose.model('ProblemSetter', problemSetterSchema);
module.exports = ProblemSetter;
