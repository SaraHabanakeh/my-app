// RegisterForm.js

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const RegisterForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [responseMessage, setResponseMessage] = useState('');
    const [token, setToken] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('https://ssreditor-ebgyajbnfme3ddcv.northeurope-01.azurewebsites.net/posts/user/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                const userToken = data.data.token || '';
                setToken(userToken);
                setResponseMessage('Registration successful!');
            } else {
                setResponseMessage(data.errors ? data.errors.detail : 'Registration failed.');
            }
        } catch (error) {
            setResponseMessage('Error registering account.');
        }
    };

    return (
        <div>
          <h1>Sign Up</h1>
          <form onSubmit={handleSubmit}>
            <div>
              <input
                id="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Email"
              />
            </div>
            <div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Password"
              />
            </div>
            <button type="submit" className="button-login">Register</button>
          </form>
          {responseMessage && <p>{responseMessage}</p>}
          <Link to="/">Back to Login</Link>
        </div>
      );
      
};

export default RegisterForm;
