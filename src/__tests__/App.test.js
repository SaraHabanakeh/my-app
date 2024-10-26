// src/test/App.test.js
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'
import App from '../App';

test('renders Start page Login Form', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /Login/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
});
