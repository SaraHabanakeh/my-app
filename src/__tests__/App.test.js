// src/test/App.test.js
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'
import App from '../App';

test('renders create new document link', () => {
    render(<App />);
    const linkElement = screen.getByText(/create new document/i);
    expect(linkElement).toBeInTheDocument();
});
