// src/__tests__/RegisterForm.test.js

import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import RegisterForm from '../components/RegisterForm';
import { MemoryRouter } from 'react-router-dom';

// Test for RegisterForm
describe('RegisterForm', () => {

    it('shows an error message on registration failure', async () => {
        jest.mock('graphql-request', () => {
            return {
                GraphQLClient: jest.fn().mockImplementation(() => {
                    return {
                        request: jest.fn().mockRejectedValue(new Error('Registration failed')),
                    };
                }),
                gql: jest.fn(),
            };
        });

        render(
            <MemoryRouter>
                <RegisterForm />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText(/Email/i), {
            target: { value: 'test@example.com' },
        });
        fireEvent.change(screen.getByPlaceholderText(/Password/i), {
            target: { value: 'testpassword' },
        });
        fireEvent.click(screen.getByRole('button', { name: /Register/i }));

        expect(await screen.findByText('Registration failed. Please try again.')).toBeInTheDocument();
    });
});
