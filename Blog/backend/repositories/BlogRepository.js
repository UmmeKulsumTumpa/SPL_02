const Blog = require('../models/Blog');
const Comment = require('../models/Comment');

class BlogRepository {
    static async getAllBlogs() {
        return Blog.find();
    }

    static async getBlogById(id) {
        return Blog.findById(id);
    }

    static async createBlog(blogData) {
        const blog = new Blog(blogData);
        return blog.save();
    }

    static async getComments(blogId) {
        return Comment.find({ blogId });
    }

    static async addComment(commentData) {
        const comment = new Comment(commentData);
        return comment.save();
    }

    static async likeBlog(id) {
        return Blog.findByIdAndUpdate(id, { $inc: { likes: 1 } }, { new: true });
    }

    static async dislikeBlog(id) {
        return Blog.findByIdAndUpdate(id, { $inc: { dislikes: 1 } }, { new: true });
    }
}

module.exports = BlogRepository;
