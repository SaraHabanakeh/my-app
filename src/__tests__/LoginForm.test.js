// src/__tests__/LoginForm.test.js

import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginForm from '../components/LoginForm';
import { MemoryRouter } from 'react-router-dom';

describe('LoginForm', () => {
    // Test form renders correctly
    it('renders the login form', () => {
        render(
            <MemoryRouter>
                <LoginForm />
            </MemoryRouter>
        );

        expect(screen.getByPlaceholderText(/Email Address/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();

        expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
    });

    // Test to simulate a successful login
    it('logs in successfully', async () => {
        render(
            <MemoryRouter>
                <LoginForm />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText(/Email Address/i), { 
            target: { value: 'test@example.com' } 
        });
        fireEvent.change(screen.getByPlaceholderText(/Password/i), { 
            target: { value: 'password123' } 
        });

        fireEvent.click(screen.getByRole('button', { name: /Login/i }));

        expect(await screen.findByText('Login successful!')).toBeInTheDocument();
    });
});
