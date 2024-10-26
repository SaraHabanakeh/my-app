// LoginForm.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { handleLogin } from '../utils/auth.js';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [responseMessage, setResponseMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('https://ssreditor-ebgyajbnfme3ddcv.northeurope-01.azurewebsites.net/posts/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();


            if (response.ok) {
                const userToken = data.data.token || '';
                const userEmail = email;
                console.log('User Email:', userEmail);

                handleLogin(userToken, userEmail);

                setResponseMessage('Login successful!');
                navigate('/documents');
            } else {

                setResponseMessage(data.errors ? data.errors.detail : 'Login failed. Please check your credentials.');
            }
        } catch (error) {
            console.error('Error during login:', error); 
            setResponseMessage('Login failed. Please try again later.');
        }
    };

    return (
    <div>
        <h1>Welcome! 👋</h1>
        <form onSubmit={handleSubmit}>
            <div>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    required
                />
            </div>
            <div>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                />
            </div>
            <button type="submit" className='button-login'>Login</button>
        </form>
        <p>Don't have an account? <Link to="/register">Sign up here</Link></p>
        {responseMessage && <p>{responseMessage}</p>}
    </div>

    );
};

export default LoginForm;
