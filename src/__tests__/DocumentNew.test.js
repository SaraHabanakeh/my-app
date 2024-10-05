import { render, screen , fireEvent, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom';
import DocumentForm from '../components/DocumentForm';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';

describe('DocumentForm', () => {
  const mock = new MockAdapter(axios);

  it('renders the form for creating a new document', () => {
    render(
      <MemoryRouter initialEntries={['/new']}>
        <Routes>
          <Route path="/new" element={<DocumentForm />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('New Document')).toBeInTheDocument();
    expect(screen.getByLabelText(/Title:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Content:/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Save/i })).toBeInTheDocument();
  });


  it('submits new data when Save button is clicked', async () => {

    mock.onPost('https://ssreditor-ebgyajbnfme3ddcv.northeurope-01.azurewebsites.net/posts/new').reply(200, {
      title: 'Test Title',
      content: 'Test Content',
    });

    render(
      <MemoryRouter initialEntries={['/new']}>
        <Routes>
          <Route path="/new" element={<DocumentForm />} />
        </Routes>
      </MemoryRouter>
    );


    fireEvent.change(screen.getByLabelText(/Title:/i), { target: { value: 'Test Title' } });
    fireEvent.change(screen.getByLabelText(/Content:/i), { target: { value: 'Test Content' } });
    fireEvent.click(screen.getByRole('button', { name: /Save/i }));

    await waitFor(() => {
      expect(mock.history.post.length).toBe(1);
    });


    expect(mock.history.post[0].data).toEqual(JSON.stringify({
      title: 'Test Title',
      content: 'Test Content',
    }));
  });

});
