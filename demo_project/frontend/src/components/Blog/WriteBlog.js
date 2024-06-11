import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../utils/api';
import '../../styles/WriteBlog.css';

const WriteBlog = () => {
    const [title, setTitle] = useState('');
    const [topic, setTopic] = useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState([]);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        setFiles(e.target.files);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('topic', topic);
        formData.append('content', content);

        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
        }

        api.post('/blogs', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(response => {
            alert('Your blog has been successfully posted.');
            navigate('/blog');
        })
        .catch(error => {
            console.error('There was an error posting the blog!', error);
        });
    };

    return (
        <div className="write-blog-container">
            <h2>Write Blog</h2>
            <form onSubmit={handleSubmit} className="write-blog-form">
                <div className="form-group">
                    <label>Blog Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label>Blog Topic</label>
                    <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        required
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label>Blog</label>
                    <div className="editor-toolbar">
                        <button type="button" className="tool-btn bold">B</button>
                        <button type="button" className="tool-btn italic">I</button>
                        <button type="button" className="tool-btn underline">U</button>
                        <button type="button" className="tool-btn">A</button>
                        <button type="button" className="tool-btn color" style={{ backgroundColor: 'brown' }}></button>
                        <button type="button" className="tool-btn color" style={{ backgroundColor: 'blue' }}></button>
                        <button type="button" className="tool-btn color" style={{ backgroundColor: 'magenta' }}></button>
                    </div>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        className="form-control content-box"
                    ></textarea>
                </div>
                <div className="form-group">
                    <label>Attach Images/Files</label>
                    <input
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        className="form-control"
                    />
                </div>
                <button type="submit" className="btn btn-primary">Post</button>
            </form>
            <Link to="/blog" className="btn btn-secondary btn-back">Back</Link>
        </div>
    );
};

export default WriteBlog;