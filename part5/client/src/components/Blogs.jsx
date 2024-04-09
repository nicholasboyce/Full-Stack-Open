import Blog from "./Blog";
import CreateBlogForm from "./CreateBlogForm";
import ToggleBlogForm from "./ToggleBlogForm";
import { useState, useEffect, useRef } from "react";
import apiService from '../services/apiService';

const Blogs = ({ setUser, setMessage }) => {

    const [blogs, setBlogs] = useState(null);

    useEffect(() => {
        const fetchBlogs = async () => {
            const blogsData = await apiService.getAll('/api/blogs');
            blogsData.sort((first, second) => second.likes - first.likes);
            setBlogs(blogsData);
        }

        fetchBlogs();
    }, []);

    const blogFormRef = useRef();

    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem('userDetails');
        setBlogs(null);
        setUser(null);
    }

    const updateBlogStatus = (newBlogs, newMessage) => {
        blogFormRef.current.toggleVisibility();
        setBlogs(blogs.concat(newBlogs));
        setMessage(newMessage);
    }

    return (
        <>
        <button type="button" onClick={handleLogout}>Log out</button>
        <ToggleBlogForm ref={blogFormRef}>
            <CreateBlogForm updateBlogStatus={updateBlogStatus} />
        </ToggleBlogForm>
        {blogs && blogs.map(blog => {
            return <Blog key={blog.id} blog={blog} />
        })}
        </>
    )
}

export default Blogs;