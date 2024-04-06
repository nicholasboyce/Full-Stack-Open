import Blog from "./Blog";
import CreateBlogForm from "./CreateBlogForm";
import { useState, useEffect } from "react";
import apiService from '../services/apiService';

const Blogs = ({ setUser, setMessage }) => {

    const [blogs, setBlogs] = useState(null);

    useEffect(() => {
        const fetchBlogs = async () => {
            const blogsData = await apiService.getAll('/api/blogs');
            setBlogs(blogsData);
        }

        fetchBlogs();

    }, []);

    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem('userDetails');
        setBlogs(null);
        setUser(null);
    }

    const updateBlogStatus = (newBlogs, newMessage) => {
        setBlogs(blogs.concat(newBlogs));
        setMessage(newMessage);
    }

    return (
        <>
        <button type="button" onClick={handleLogout}>Log out</button>
        <CreateBlogForm updateBlogStatus={updateBlogStatus} />
        {blogs && blogs.map(blog => {
            return <Blog key={blog.id} blog={blog} />
        })}
        </>
    )
}

export default Blogs;