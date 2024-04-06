import { useState } from "react";
import apiService from "../services/apiService";

const CreateBlogForm = ({ updateBlogStatus }) => {

    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [url, setURL] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = { title, author, url };
        try {
            const response = await apiService.createBlogPost('/api/blogs', data);
            const body = await response.json();

            if (response.status === 201) {
                const newMessage = {
                    text: `A new blog, ${body.title} by ${body.author} has been added!`,
                    status: 'success'
                };
                setTitle('');
                setAuthor('');
                setURL('');
                updateBlogStatus(body, newMessage);
            } else {
                console.log(response.statusText);
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            <h2>Create New</h2>
            <form onSubmit={handleSubmit}>
                <p>
                    <label htmlFor="title">Title: </label>
                    <input type="text" id="title" name="title" value={title} onChange={(e) => setTitle(e.target.value)}/>
                </p>
                <p>
                    <label htmlFor="author">Author: </label>
                    <input type="text" id="author" name="author" value={author} onChange={(e) => setAuthor(e.target.value)}/>
                </p>
                <p>
                    <label htmlFor="url">URL: </label>
                    <input type="text" id="url" name="url" value={url} onChange={(e) => setURL(e.target.value)}/>
                </p>
                <button type="submit">Create</button>
            </form>
        </>
    )
}

export default CreateBlogForm;