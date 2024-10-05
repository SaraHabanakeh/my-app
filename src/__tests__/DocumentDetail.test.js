import { render, screen, cleanup } from '@testing-library/react';
import DocumentDetail from '../components/DocumentDetail';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import '@testing-library/jest-dom';

describe('DocumentDetail', () => {
    const mock = new MockAdapter(axios);
    const document = {
        "_id": "66f34ed981b7b1e257d908fa",
        "title": "Document 1",
        "content": "This is Document 1 "
    };

    //fetching a specific document
    it('displays the document by its sent id', async () => {

        mock.onGet('https://ssreditor-ebgyajbnfme3ddcv.northeurope-01.azurewebsites.net/posts/66f34ed981b7b1e257d908fa').reply(200, document);

        render(
            <MemoryRouter initialEntries={['/document/66f34ed981b7b1e257d908fa']}>
                <Routes>
                    <Route path="/document/:id" element={<DocumentDetail />} />
                </Routes>
            </MemoryRouter>
        );

        expect(await screen.findByText('Document 1')).toBeInTheDocument();
        expect(screen.getByText('This is Document 1')).toBeInTheDocument();
    });

    // Error handling test
    it('displays an error message on fetch failure', async () => {
        // Mock an error response
        mock.onGet('https://ssreditor-ebgyajbnfme3ddcv.northeurope-01.azurewebsites.net/posts/66f34ed981b7b1e257d908fa').reply(404);
    
        render(
            <MemoryRouter initialEntries={['/document/66f34ed981b7b1e257d908fa']}>
                <Routes>
                    <Route path="/document/:id" element={<DocumentDetail />} />
                </Routes>
            </MemoryRouter>
        );
        expect(await screen.findByText(/error fetching document/i)).toBeInTheDocument();
    });
    
});

