const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contestantSchema = new Schema({
  uid: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  registrationDate: { type: Date, default: Date.now }
});

const Contestant = mongoose.model('Contestant', contestantSchema);
module.exports = Contestant;