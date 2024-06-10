const express = require('express');
const multer = require('multer');
const BlogRepository = require('../repositories/BlogRepository');

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Temporary directory to store files

router.get('/blogs', async (req, res) => {
    const blogs = await BlogRepository.getAllBlogs();
    res.json(blogs);
});

router.get('/blogs/:id', async (req, res) => {
    const blog = await BlogRepository.getBlogById(req.params.id);
    res.json(blog);
});

router.get('/blogs/:id/comments', async (req, res) => {
    const comments = await BlogRepository.getComments(req.params.id);
    res.json(comments);
});

router.post('/blogs', upload.array('files'), async (req, res) => {
    const blogData = {
        title: req.body.title,
        topic: req.body.topic,
        content: req.body.content,
        files: req.files.map(file => file.path), // Save file paths
        likes: 0,
        dislikes: 0
    };

    const blog = await BlogRepository.createBlog(blogData);
    res.json(blog);
});

router.post('/blogs/:id/comments', async (req, res) => {
    const commentData = {
        content: req.body.content,
        blogId: req.params.id
    };
    const comment = await BlogRepository.addComment(commentData);
    res.json(comment);
});

router.post('/blogs/:id/like', async (req, res) => {
    const result = await BlogRepository.likeBlog(req.params.id);
    res.json(result);
});

router.post('/blogs/:id/dislike', async (req, res) => {
    const result = await BlogRepository.dislikeBlog(req.params.id);
    res.json(result);
});

module.exports = router;
