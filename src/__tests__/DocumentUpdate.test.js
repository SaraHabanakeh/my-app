import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import UpdateDocumentForm from '../components/UpdateDocumentForm';
import { MemoryRouter } from 'react-router-dom';
import { GraphQLClient } from 'graphql-request';
import { getAuthToken, getUserEmail } from '../utils/auth';
import { io } from 'socket.io-client';
import { useParams, useNavigate } from 'react-router-dom';

// Mock dependencies
jest.mock('../utils/auth', () => ({
    getAuthToken: jest.fn(),
    getUserEmail: jest.fn(),
}));

jest.mock('socket.io-client');
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn(),
    useNavigate: jest.fn(),
}));

describe('UpdateDocumentForm', () => {
    beforeEach(() => {
        useParams.mockReturnValue({ id: '1' });
        getAuthToken.mockReturnValue('test-token');
        getUserEmail.mockReturnValue('test@example.com');
        io.mockReturnValue({
            emit: jest.fn(),
            on: jest.fn(),
            disconnect: jest.fn(),
            off: jest.fn(),
        });
    });

    it('renders form fields and buttons', async () => {
        render(
            <MemoryRouter>
                <UpdateDocumentForm />
            </MemoryRouter>
        );

        expect(screen.getByText('Edit Document')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Save/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /Invite to Edit/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Code Mode/i })).toBeInTheDocument();
    });

    it('fetches and displays document data', async () => {
        GraphQLClient.prototype.request = jest.fn().mockResolvedValue({
            document: { title: 'Sample Title', content: 'Sample Content', code: false },
        });

        render(
            <MemoryRouter>
                <UpdateDocumentForm />
            </MemoryRouter>
        );

        await waitFor(() => expect(screen.getByDisplayValue('Sample Title')).toBeInTheDocument());
        expect(screen.getByDisplayValue('Sample Content')).toBeInTheDocument();
    });

    it('handles title and content updates with socket events', async () => {
        const socketMock = io();
        render(
            <MemoryRouter>
                <UpdateDocumentForm />
            </MemoryRouter>
        );

        const [titleInput, contentInput] = screen.getAllByRole('textbox');
        fireEvent.change(titleInput, { target: { value: 'Updated Title' } });
        fireEvent.change(contentInput, { target: { value: 'Updated Content' } });

        await waitFor(() => {
            expect(socketMock.emit).toHaveBeenCalledWith('typingTitle', expect.any(Object));
            expect(socketMock.emit).toHaveBeenCalledWith('typingContent', expect.any(Object));
        });
    });

    it('submits and updates document', async () => {
        GraphQLClient.prototype.request = jest.fn().mockResolvedValue({});
        const navigateMock = jest.fn();
        useNavigate.mockReturnValue(navigateMock);

        render(
            <MemoryRouter>
                <UpdateDocumentForm />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByRole('button', { name: /Save/i }));

        await waitFor(() => expect(GraphQLClient.prototype.request).toHaveBeenCalledWith(
            expect.stringContaining('UpdateDocument'),
            expect.objectContaining({ id: '1', title: expect.any(String), content: expect.any(String), code: expect.any(Boolean) })
        ));
        expect(navigateMock).toHaveBeenCalledWith('/documents');
    });
});
