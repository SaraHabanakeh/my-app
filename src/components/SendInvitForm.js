// SendInvitForm.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLocation} from 'react-router-dom';
import { GraphQLClient, gql } from 'graphql-request';
import { getAuthToken } from '../utils/auth';

const SendInvitForm = () => {
    const [email, setEmail] = useState('');
    const [documentUrl, setDocumentUrl] = useState('');
    const [responseMessage, setResponseMessage] = useState('');
    const authToken = getAuthToken();

    const location = useLocation();


    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const url = params.get('documentUrl');
        if (url) {
            setDocumentUrl(url);
        }
    }, [location]);


    const client = new GraphQLClient('https://ssreditor-ebgyajbnfme3ddcv.northeurope-01.azurewebsites.net/graphql/docs', {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        },
    });

    const UPDATE_ALLOWED_LIST_MUTATION = gql`
        mutation Updatedocument($id: ID!, $allowed: [String!]!) {
            updatedocument(id: $id, allowed: $allowed) {
                allowed
            }
        }
    `;

    const handleSubmit = async (e) => {
        e.preventDefault();

        const documentId = documentUrl.split('/').pop();

        try {
            // Send invitation email
            const inviteResponse = await fetch('https://ssreditor-ebgyajbnfme3ddcv.northeurope-01.azurewebsites.net/posts/mail/send-invite', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, documentUrl }),
            });

            const inviteData = await inviteResponse.json();

            if (!inviteResponse.ok) {
                setResponseMessage(inviteData.error || 'Failed to send invitation.');
                return;
            }

            // Update the document's allowed list
            const variables = {
                id: documentId,
                allowed: [email],
            };

            const updateResponse = await client.request(UPDATE_ALLOWED_LIST_MUTATION, variables);

            if (updateResponse.updatedocument) {
                setResponseMessage('Invitation sent successfully! ✔');
            } else {
                setResponseMessage('Failed to update the allowed list.');
            }
        } catch (error) {
            console.error('Error during invitation and update:', error);
            setResponseMessage('An error occurred. Please try again.');
        }
    };

    return (
        <div>
          <h1>Send Invitation</h1>
          <form onSubmit={handleSubmit}>
            <div>
              <input
                id="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Email Address"
              />
            </div>
            <button type="submit" className='button-new'>Send</button>
          </form>
          <Link to="/documents" className="nav-link">Back to Document List</Link>
          {responseMessage && <p>{responseMessage}</p>}

        </div>
    );
};

export default SendInvitForm;
