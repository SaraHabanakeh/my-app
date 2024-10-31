// RegisterForm.js

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GraphQLClient, gql } from 'graphql-request';

const RegisterForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [responseMessage, setResponseMessage] = useState('');


    const client = new GraphQLClient('https://ssreditor-ebgyajbnfme3ddcv.northeurope-01.azurewebsites.net/graphql/auth', {
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const REGISTER_MUTATION = gql`
        mutation Register($email: String!, $password: String!) {
            register(email: $email, password: $password) {
                message
                user {
                    email
                }
            }
        }
    `;

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const variables = { email, password };
            const data = await client.request(REGISTER_MUTATION, variables);

            if (data.register) {
                setResponseMessage(data.register.message || 'Registration successful! ✔');
            } else {
                setResponseMessage('Registration failed. Please try again.');
            }

        } catch (error) {
            console.error('Error during registration:', error);
            
            const errorMessage = error?.response?.errors?.[0]?.message || 'Error registering account. Please try again.';
            setResponseMessage(errorMessage);
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
