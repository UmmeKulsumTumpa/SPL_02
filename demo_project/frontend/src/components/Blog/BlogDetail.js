import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import '../../styles/BlogDetail.css';

const BlogDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [blog, setBlog] = useState(null);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);

    useEffect(() => {
        api.get(`/blogs/${id}`)
            .then(response => {
                setBlog(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the blog!', error);
            });

        // Fetch comments
        api.get(`/blogs/${id}/comments`)
            .then(response => {
                setComments(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the comments!', error);
            });
    }, [id]);

    const handleLike = () => {
        api.post(`/blogs/${id}/like`)
            .then(response => {
                setBlog(response.data);
            })
            .catch(error => {
                console.error('There was an error liking the blog!', error);
            });
    };

    const handleDislike = () => {
        api.post(`/blogs/${id}/dislike`)
            .then(response => {
                setBlog(response.data);
            })
            .catch(error => {
                console.error('There was an error disliking the blog!', error);
            });
    };

    const handleComment = () => {
        if (!comment) return;

        api.post(`/blogs/${id}/comments`, { content: comment })
            .then(response => {
                setComments([...comments, response.data]);
                setComment('');
            })
            .catch(error => {
                console.error('There was an error posting the comment!', error);
            });
    };

    if (!blog) {
        return <div>Loading...</div>;
    }

    return (
        <div className="blog-detail-container">
            <h2>{blog.title}</h2>
            <p>{blog.content}</p>
            <div className="blog-detail-actions">
                <button onClick={handleLike} className="like-button">Like ({blog.likes})</button>
                <button onClick={handleDislike} className="dislike-button">Dislike ({blog.dislikes})</button>
            </div>
            <div className="comments-section">
                <h3>Comments</h3>
                <ul>
                    {comments.map((c, index) => (
                        <li key={index}>{c.content}</li>
                    ))}
                </ul>
                <div className="comment-box">
                    <input 
                        type="text" 
                        value={comment} 
                        onChange={(e) => setComment(e.target.value)} 
                        placeholder="Add a comment" 
                    />
                    <button onClick={handleComment} className="btn btn-primary">Post Comment</button>
                </div>
            </div>
            <button onClick={() => navigate(-1)} className="btn btn-secondary btn-back">Back</button>
        </div>
    );
};

export default BlogDetail;