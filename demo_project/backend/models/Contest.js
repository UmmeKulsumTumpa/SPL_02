const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Problem = require('./Problem');

const contestSchema = new Schema({
	cid: { type: String, required: true },
	title: { type: String, required: true },
	description: { type: String, required: true },
	startTime: { type: Date, required: true },
	endTime: { type: Date, required: true },
	problems: [{ type: Schema.Types.ObjectId, ref: 'Problem' }]
});

const Contest = mongoose.model('Contest', contestSchema);
module.exports = Contest;
