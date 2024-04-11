import Blog from './Blog';
import CreateBlogForm from './CreateBlogForm';
import ToggleBlogForm from './ToggleBlogForm';
import { useState, useEffect, useRef } from 'react';
import apiService from '../services/apiService';

const Blogs = ({ setUser, setMessage }) => {

  const [blogs, setBlogs] = useState(null);
  const username = JSON.parse(localStorage.getItem('userDetails')).username;

  const fetchBlogs = async () => {
    const blogsData = await apiService.getAll('/api/blogs');
    blogsData.sort((first, second) => second.likes - first.likes);
    setBlogs(blogsData);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const blogFormRef = useRef();

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('userDetails');
    setBlogs(null);
    setUser(null);
  };

  const updateBlogStatus = async (newBlogs, newMessage) => {
    blogFormRef.current.toggleVisibility();
    const concattedBlogs = blogs.concat(newBlogs);
    setBlogs(concattedBlogs.sort((first, second) => second.likes - first.likes));
    setMessage(newMessage);
  };

  const likeUp = async (id, likes) => {
    const response = await apiService.likeBlogPost(`/api/blogs/${id}`, likes + 1);
    const updatedBlog = await response.json();
    return updatedBlog;
  };

  const createBlogPost = async (data) => {
    const response = await apiService.createBlogPost('/api/blogs', data);
    return response;
  };

  const deleteBlogPost =  async (id) => {
    const response = await apiService.deleteBlogPost(`/api/blogs/${id}`);
    if (response.status !== 204) {
      throw new Error('Deletion failed');
    }
    setBlogs(blogs.filter((blog) => blog.id !== id));
  };

  return (
    <>
      <button type="button" onClick={handleLogout}>Log out</button>
      <ToggleBlogForm ref={blogFormRef}>
        <CreateBlogForm updateBlogStatus={updateBlogStatus} createBlogPost={createBlogPost} />
      </ToggleBlogForm>
      {blogs && blogs.map(blog => {
        console.log(blog);
        return <Blog key={blog.id} blog={blog} username={username} likeUp={likeUp} deleteBlogPost={deleteBlogPost} />;
      })}
    </>
  );
};

export default Blogs;