import Blog from "./Blog";
import { useState, useEffect } from "react";
import apiService from '../services/apiService';

const Blogs = ({ setUser }) => {

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

    return (
        <>
        {blogs && blogs.map(blog => {
            return <Blog key={blog.id} blog={blog} />
        })}
        <button type="button" onClick={handleLogout}>Log out</button>
        </>
    )
}

export default Blogs;