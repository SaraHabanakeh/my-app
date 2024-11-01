import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import NewDocumentForm from '../components/NewDocumentForm';
import { MemoryRouter } from 'react-router-dom';
import { GraphQLClient } from 'graphql-request';
import { getAuthToken, getUserEmail } from '../utils/auth';
import { useNavigate } from 'react-router-dom';

// Mock dependencies
jest.mock('../utils/auth', () => ({
    getAuthToken: jest.fn(),
    getUserEmail: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

describe('NewDocumentForm', () => {
    beforeEach(() => {
        getAuthToken.mockReturnValue('test-token');
        getUserEmail.mockReturnValue('test@example.com');
        useNavigate.mockReturnValue(jest.fn());
    });

    it('renders form fields', () => {
        render(
            <MemoryRouter>
                <NewDocumentForm />
            </MemoryRouter>
        );

        expect(screen.getByPlaceholderText('Title')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Content')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Save/i })).toBeInTheDocument();
    });

    it('updates title and content state on input change', () => {
        render(
            <MemoryRouter>
                <NewDocumentForm />
            </MemoryRouter>
        );

        const titleInput = screen.getByPlaceholderText('Title');
        const contentInput = screen.getByPlaceholderText('Content');

        fireEvent.change(titleInput, { target: { value: 'Test Title' } });
        fireEvent.change(contentInput, { target: { value: 'Test Content' } });

        expect(titleInput.value).toBe('Test Title');
        expect(contentInput.value).toBe('Test Content');
    });

});

it('logs error on submission failure', async () => {
  const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
  GraphQLClient.prototype.request = jest.fn().mockRejectedValue(new Error('Network error'));

  render(
      <MemoryRouter>
          <NewDocumentForm />
      </MemoryRouter>
  );

  fireEvent.change(screen.getByPlaceholderText('Title'), { target: { value: 'Error Test' } });
  fireEvent.change(screen.getByPlaceholderText('Content'), { target: { value: 'Error Content' } });
  fireEvent.click(screen.getByRole('button', { name: /Save/i }));

  await waitFor(() => {

      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Error creating document:'), expect.any(Error));
  });

  consoleSpy.mockRestore();
});
