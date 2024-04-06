import Blog from "./Blog";
import { useState, useEffect } from "react";
import apiService from '../services/apiService';

const Blogs = () => {

    const [blogs, setBlogs] = useState(null);

    useEffect(() => {
        const fetchBlogs = async () => {
            const blogsData = await apiService.getAll('/api/blogs');
            setBlogs(blogsData);
        }

        fetchBlogs();

    }, []);

    return (
        <>
        {blogs && blogs.map(blog => {
            return <Blog key={blog.id} blog={blog} />
        })}
        </>
    )
}

export default Blogs;