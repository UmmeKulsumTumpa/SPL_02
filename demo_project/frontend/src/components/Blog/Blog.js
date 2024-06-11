import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import '../../styles/Blog.css';

const Blog = () => {
    const [blogs, setBlogs] = useState([]);
    const [userBlogs, setUserBlogs] = useState([]);

    useEffect(() => {
        // Fetch all blogs
        api.get('/blogs')
            .then(response => {
                setBlogs(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the blogs!', error);
            });

        // Fetch user's blogs
        api.get('/user/blogs')
            .then(response => {
                setUserBlogs(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the user blogs!', error);
            });
    }, []);

    return (
        <div className="blog-container">
            <div className="blog-stats">
                <h2>Number of blogs: {blogs.length}</h2>
                <h3>Your blogs: {userBlogs.length}</h3>
            </div>
            <div className="blog-actions">
                <Link to="/write-blog" className="btn btn-primary">Write blog</Link>
            </div>
            <ul className="blog-list">
                {blogs.map(blog => (
                    <li key={blog._id} className="blog-item">
                        <Link to={`/blog/${blog._id}`}>{blog.title}</Link>
                    </li>
                ))}
            </ul>
            <Link to="/" className="btn btn-secondary btn-back">Back</Link>
        </div>
    );
};

export default Blog;
