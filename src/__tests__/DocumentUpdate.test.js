import { render, screen , fireEvent, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom';
import DocumentForm from '../components/DocumentForm';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';

describe('DocumentForm', () => {

    const mock = new MockAdapter(axios);

    it('loads and updates existing document when Save button is clicked', async () => {
      const documentId = '123';
  
      mock.onGet(`https://ssreditor-ebgyajbnfme3ddcv.northeurope-01.azurewebsites.net/posts/${documentId}`).reply(200, {
        title: 'Original Title',
        content: 'Original Content',
      });
  

      mock.onPost(`https://ssreditor-ebgyajbnfme3ddcv.northeurope-01.azurewebsites.net/posts/${documentId}`).reply(200, {
        title: 'Updated Title',
        content: 'Updated Content',
      });
  
      render(
        <MemoryRouter initialEntries={[`/edit/${documentId}`]}>
          <Routes>
            <Route path="/edit/:id" element={<DocumentForm />} />
          </Routes>
        </MemoryRouter>
      );
  
      await waitFor(() => {
        expect(screen.getByLabelText(/Title:/i)).toHaveValue('Original Title');
        expect(screen.getByLabelText(/Content:/i)).toHaveValue('Original Content');
      });
  

      fireEvent.change(screen.getByLabelText(/Title:/i), { target: { value: 'Updated Title' } });
      fireEvent.change(screen.getByLabelText(/Content:/i), { target: { value: 'Updated Content' } });
  
      fireEvent.click(screen.getByRole('button', { name: /Save/i }));
  
      await waitFor(() => {
        expect(mock.history.post.length).toBe(1);
      });

      expect(mock.history.post[0].data).toEqual(JSON.stringify({
        title: 'Updated Title',
        content: 'Updated Content',
      }));
    });

});