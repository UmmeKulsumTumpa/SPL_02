const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contestSchema = new Schema({
  cid: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true }
});

const Contest = mongoose.model('Contest', contestSchema);
module.exports = Contest;