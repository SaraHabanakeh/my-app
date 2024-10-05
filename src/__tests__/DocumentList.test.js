import { render, screen, cleanup } from '@testing-library/react';
import DocumentList from '../components/DocumentList.js';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';


describe('DocumentList', () => {

//test rendering
  it('renders without crashing', () => {
    render(
      <MemoryRouter>
        <DocumentList />
      </MemoryRouter>
    );
    expect(screen.getByText(/Documents list/i)).toBeInTheDocument();
  });

//test fetching data
  it('fetches and displays document titles', async () => {
    const mock = new MockAdapter(axios);
    const documents = [
      { _id: '66f34ed981b7b1e257d908fa', title: 'Document 1', content: 'This is Document 1' },
      { _id: '66f34ed981b7b1e257d908fb', title: 'Document 2', content: 'This is Document 2' },
      { _id: '66f34ed981b7b1e257d908fc', title: 'Document 3', content: 'This is Document 3' },
      { _id: '66f34ed981b7b1e257d908fd', title: 'Document 4', content: 'This is Document 4' },
    ];

    mock.onGet('https://ssreditor-ebgyajbnfme3ddcv.northeurope-01.azurewebsites.net/posts/').reply(200, {data:documents});

    render(
      <MemoryRouter>
        <DocumentList />
      </MemoryRouter>
    );

    expect(await screen.findByText('Document 1')).toBeInTheDocument();
    expect(await screen.findByText('Document 2')).toBeInTheDocument();
    expect(await screen.findByText('Document 3')).toBeInTheDocument();
    expect(await screen.findByText('Document 4')).toBeInTheDocument();
  });


//test error handeling
  it('displays error message when data fetching fails', async () => {
    const mock = new MockAdapter(axios);
  
    mock.onGet('https://ssreditor-ebgyajbnfme3ddcv.northeurope-01.azurewebsites.net/posts/').reply(500);
  
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  
    render(
      <MemoryRouter>
        <DocumentList />
      </MemoryRouter>
    );

    expect(await screen.findByText(/documents list/i)).toBeInTheDocument();
  
    expect(consoleSpy).toHaveBeenCalled();
    expect(consoleSpy.mock.calls[0][0]).toContain('Error fetching documents');
  
    consoleSpy.mockRestore();

  });
});
