import { useState } from 'react'
import './App.css'
import LoginForm from './components/LoginForm'
import Blogs from './components/Blogs'


function App() {

  const [user, setUser] = useState(null);

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
      <Blogs />
    </>
  );
}

export default App
