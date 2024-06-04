const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const submittedProblemSchema = new Schema({
    type: String,
    pid: String,
    solution: String,
    result: Schema.Types.Mixed,
}, { _id: false });

const contestantSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    registrationDate: { type: Date, default: Date.now },
    submittedProblems: [submittedProblemSchema],
});

const Contestant = mongoose.model("Contestant", contestantSchema);
module.exports = Contestant;
