import { useState } from "react";
import apiService from "../services/apiService";

const Blog = ({ blog }) => {

    const [showBlog, setShowBlog] = useState(false);
    const [buttonTextIndex, setButtonTextIndex] = useState(0);
    const [likes, setLikes] = useState(blog.likes);
    const text = ['View', 'Cancel'];

    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: 'solid',
        borderWidth: 1,
        marginBottom: 5
    }

    const buttonGroup = {
        display: 'flex',
        columnGap: '1rem',
        alignItems: 'center'
    }

    const toggleVisibility = () => {
        setShowBlog(!showBlog);
        setButtonTextIndex((buttonTextIndex + 1) % 2);
    }

    const handleLikeClick = async () => {
        try {
            const response = await apiService.likeBlogPost(`/api/blogs/${blog.id}`, likes + 1);
            const updatedBlog = await response.json();
            setLikes(updatedBlog.likes);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div style={blogStyle}>
            <div style={buttonGroup}>
                <p>{blog.title} by {blog.author}</p>
                <button onClick={toggleVisibility}>{text[buttonTextIndex]}</button>
            </div>
            {showBlog && 
                <div>
                    <p>{blog.url}</p>
                    <div style={buttonGroup}>
                        <p>likes: {likes}</p>
                        <button onClick={handleLikeClick}>Like</button>
                    </div>
                    <p>{blog.user.username}</p>
                </div>
            }
        </div>
    )
}

export default Blog;