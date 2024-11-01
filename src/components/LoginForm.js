// LoginForm.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { handleLogin } from '../utils/auth.js';
import { GraphQLClient, gql } from 'graphql-request';



const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [responseMessage, setResponseMessage] = useState('');
    const navigate = useNavigate();

    const client = new GraphQLClient('https://ssreditor-ebgyajbnfme3ddcv.northeurope-01.azurewebsites.net/graphql/auth', {
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const LOGIN_MUTATION = gql`
        mutation Login($email: String!, $password: String!) {
            login(email: $email, password: $password) {
                message
                user {
                    email
                }
                token
            }
        }
    `;

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const variables = { email, password };
            const data = await client.request(LOGIN_MUTATION, variables);

            if (data.login) {
                const userToken = data.login.token;
                const userEmail = email;
                //console.log(data.login)

                handleLogin(userToken, userEmail);

                setResponseMessage('Login successful!');
                navigate('/documents');
            } else {
                setResponseMessage(data.login.message || 'Login failed. Please check your credentials.');
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
                <button type="submit" className="button-login">Login</button>
            </form>
            <p>Don't have an account? <Link to="/register">Sign up here</Link></p>
            {responseMessage && <p>{responseMessage}</p>}
        </div>
    );
};

export default LoginForm;
