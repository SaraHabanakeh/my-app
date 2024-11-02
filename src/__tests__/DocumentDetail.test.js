// src/__tests__/DocumentDetail.test.js

import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DocumentDetail from '../components/DocumentDetail';
import { MemoryRouter } from 'react-router-dom';
import { GraphQLClient } from 'graphql-request';
import { getAuthToken } from '../utils/auth';
import { useParams } from 'react-router-dom';


jest.mock('../utils/auth', () => ({
    getAuthToken: jest.fn(),
}));


jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn(),
}));

describe('DocumentDetail', () => {
    it('displays document title and content when document is available', async () => {

        useParams.mockReturnValue({ id: '1' });
        getAuthToken.mockReturnValue('test-token');

        const mockDocument = {
            document: { _id: '1', title: 'Sample Document', content: 'This is a sample content.' },
        };
        GraphQLClient.prototype.request = jest.fn().mockResolvedValue(mockDocument);

        render(
            <MemoryRouter>
                <DocumentDetail />
            </MemoryRouter>
        );

        await waitFor(() => expect(screen.getByText('Sample Document')).toBeInTheDocument());
        await waitFor(() => expect(screen.getByText('This is a sample content.')).toBeInTheDocument());
    });
});
