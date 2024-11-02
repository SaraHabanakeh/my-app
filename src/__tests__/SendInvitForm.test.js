// src/__tests__/SendInvitForm.test.js

import { render, screen } from '@testing-library/react';
import SendInvitForm from '../components/SendInvitForm';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

describe('SendInvitForm', () => {
  it('renders the Send Invitation form correctly', () => {
    render(
      <MemoryRouter>
        <SendInvitForm />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /send invitation/i })).toBeInTheDocument();

    expect(screen.getByPlaceholderText(/email address/i)).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();

    expect(screen.getByRole('link', { name: /back to document list/i })).toBeInTheDocument();
  });
});
