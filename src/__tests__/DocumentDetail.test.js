// src/__tests__/DocumentDetail.test.js
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DocumentDetail from '../components/DocumentDetail'; // Import DocumentDetail
import { MemoryRouter } from 'react-router-dom';
import { GraphQLClient } from 'graphql-request';
import { getAuthToken } from '../utils/auth';
import { useParams } from 'react-router-dom';

// Mock `getAuthToken` from auth utils
jest.mock('../utils/auth', () => ({
    getAuthToken: jest.fn(),
}));

// Mock `useParams` from `react-router-dom`
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn(),
}));

describe('DocumentDetail', () => {
    it('displays document title and content when document is available', async () => {
        // Mock parameters and token as expected by the component
        useParams.mockReturnValue({ id: '1' });
        getAuthToken.mockReturnValue('test-token');

        // Mock data returned from GraphQL request
        const mockDocument = {
            document: { _id: '1', title: 'Sample Document', content: 'This is a sample content.' },
        };
        GraphQLClient.prototype.request = jest.fn().mockResolvedValue(mockDocument);

        // Render DocumentDetail within a router
        render(
            <MemoryRouter>
                <DocumentDetail />
            </MemoryRouter>
        );

        // Assert that title and content appear when document is available
        await waitFor(() => expect(screen.getByText('Sample Document')).toBeInTheDocument());
        await waitFor(() => expect(screen.getByText('This is a sample content.')).toBeInTheDocument());
    });

    /*it('displays an error message when there is a fetch error', async () => {
        // Mock parameters and token
        useParams.mockReturnValue({ id: '1' });
        getAuthToken.mockReturnValue('test-token');

        // Mock GraphQL request to throw an error
        GraphQLClient.prototype.request = jest.fn().mockRejectedValue(new error('Error fetching document:'));

        // Render DocumentDetail within a router
        render(
            <MemoryRouter>
                <DocumentDetail />
            </MemoryRouter>
        );

        // Assert that the error message is displayed
        await waitFor(() => expect(screen.getByText('Error fetching document')).toBeInTheDocument());
    });*/
});
