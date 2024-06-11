const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: String,
    topic: String,
    content: String,
    files: [String],
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 }
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;