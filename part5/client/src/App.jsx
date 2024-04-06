import { useState, useEffect } from 'react'
import './App.css'
import LoginForm from './components/LoginForm'
import Blogs from './components/Blogs'


function App() {

  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const userDetails = localStorage.getItem('userDetails');
    if (userDetails) {
      setUser(JSON.parse(userDetails));
    }
  }, []);

  if (message) {
    setTimeout(() => {
      setMessage('');
    }, 5000);
  }

  return (
    user === null
    ? 
    <>
      <h1>Log into Application</h1>
      <p>{message}</p>
      <LoginForm setUser={setUser} setMessage={setMessage} />
    </>
    : 
    <>
      <h1>Blogs</h1>
      <p>{message}</p>
      <p> {user.name} logged in</p>
      <Blogs setUser={setUser} setMessage={setMessage} />
    </>
  );
}

export default App
