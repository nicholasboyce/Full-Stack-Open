import { useState } from 'react';
import apiService from '../services/apiService';

const LoginForm = ({ setUser, setMessage }) => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    const credentials = { username, password };
    try {
      const loginResponse = await apiService.login('/api/login', credentials);
      if (loginResponse.status === 200) {
        const userDetails = await loginResponse.json();
        localStorage.setItem('userDetails', JSON.stringify(userDetails));
        apiService.setToken(userDetails.token);
        setUser(userDetails);
      } else {
        const errorDetails = await loginResponse.json();
        const newMessage = {
          text: errorDetails.error,
          status: 'error'
        };
        setMessage(newMessage);
      }
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <form onSubmit={handleLogin} aria-labelledby='login-heading'>
      <p>
        <label htmlFor='username'>Username: </label>
        <input type="text" id='username' name='username' value={username} onChange={(e) => setUsername(e.target.value)}/>
      </p>
      <p>
        <label htmlFor="password">Password: </label>
        <input type="password" id='password' name='password' value={password} onChange={(e) => setPassword(e.target.value)} />
      </p>
      <button type='submit'>Login</button>
    </form>
  );
};

export default LoginForm;