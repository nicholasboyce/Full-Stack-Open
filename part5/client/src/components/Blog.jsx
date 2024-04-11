import { useState } from 'react';
import PropTypes from 'prop-types';

const Blog = ({ blog, username, likeUp, deleteBlogPost }) => {

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
  };

  const buttonGroup = {
    display: 'flex',
    columnGap: '1rem',
    alignItems: 'center'
  };

  const toggleVisibility = () => {
    setShowBlog(!showBlog);
    setButtonTextIndex((buttonTextIndex + 1) % 2);
  };

  const handleLikeClick = async () => {
    try {
      const updatedBlog = await likeUp(blog.id, likes);
      setLikes(updatedBlog.likes);
    } catch (error) {
      console.error(error);
    }
  };

  const removeItem = async () => {
    if (window.confirm(`Remove ${blog.title} by ${blog.author}?`)) {
      try {
        await deleteBlogPost(blog.id);
      } catch (error) {
        console.error(error);
      }
    }
  };

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
                  {blog.user.username === username && <button onClick={removeItem}>remove</button>}
                </div>
      }
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.shape({
    title: PropTypes.string,
    author: PropTypes.string,
    url: PropTypes.string,
    likes: PropTypes.number,
    user: PropTypes.shape({
      username: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired
    })
  }),
};

export default Blog;