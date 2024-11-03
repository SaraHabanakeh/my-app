// src/__tests__/DocumentList.test.js

import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DocumentList from '../components/DocumentList';
import { MemoryRouter } from 'react-router-dom';
import { GraphQLClient } from 'graphql-request';
import { getUserEmail, getAuthToken } from '../utils/auth';


jest.mock('../utils/auth', () => ({
    getUserEmail: jest.fn(),
    getAuthToken: jest.fn(),
}));

describe('DocumentList', () => {

    it('renders documents when available', async () => {

        getUserEmail.mockReturnValue('test@example.com');
        getAuthToken.mockReturnValue('test-token');


        const mockDocuments = [
            { _id: '1', title: 'Document 1' },
            { _id: '2', title: 'Document 2' },
        ];

        GraphQLClient.prototype.request = jest.fn().mockResolvedValue({ userdocuments: mockDocuments });

        render(
            <MemoryRouter>
                <DocumentList />
            </MemoryRouter>
        );


        await waitFor(() => expect(screen.getByText('Document 1')).toBeInTheDocument());
        await waitFor(() => expect(screen.getByText('Document 2')).toBeInTheDocument());
    });

    it('shows a message when no documents are available', async () => {

        getUserEmail.mockReturnValue('test@example.com');
        getAuthToken.mockReturnValue('mock-token');


        GraphQLClient.prototype.request = jest.fn().mockResolvedValue({ userdocuments: [] });

        render(
            <MemoryRouter>
                <DocumentList />
            </MemoryRouter>
        );


        await waitFor(() => expect(screen.getByText('No documents available for your access.')).toBeInTheDocument());
    });
});
