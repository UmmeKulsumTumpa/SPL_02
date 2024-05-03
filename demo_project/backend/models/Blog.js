const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogSchema = new Schema({
  bid: { type: String, required: true },
  likes: { type: Number, default: 0 },
  comments: { type: Number, default: 0 },
  title: { type: String, required: true },
  content: { type: String, required: true }
});

const Blog = mongoose.model('Blog', blogSchema);
module.exports = Blog;