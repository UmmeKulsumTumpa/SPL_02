const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    content: String,
    blogId: { type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
