import { useState, useEffect } from 'react'
import './App.css'
import LoginForm from './components/LoginForm'
import Blogs from './components/Blogs'


function App() {

  const [user, setUser] = useState(null);

  useEffect(() => {
    const userDetails = localStorage.getItem('userDetails');
    if (userDetails) {
      setUser(JSON.parse(userDetails));
    }
  }, []);

  return (
    user === null
    ? 
    <>
      <h1>Log into Application</h1>
      <LoginForm setUser={setUser} />
    </>
    : 
    <>
      <h1>Blogs</h1>
      <p> {user.name} logged in</p>
      <Blogs setUser={setUser} />
    </>
  );
}

export default App
