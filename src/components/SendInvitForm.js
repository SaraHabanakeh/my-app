// SendInvitForm.js

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const SendInvitForm = () => {
    const [email, setEmail] = useState('');
    const [documentUrl, setDocumentUrl] = useState('');
    const [responseMessage, setResponseMessage] = useState('');

    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const url = params.get('documentUrl');
        if (url) {
            setDocumentUrl(url);
        }
    }, [location]);

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
                setResponseMessage(inviteData.error);
                return;
            }

            // Update the document's allowed list
            const updateResponse = await axios.post(
                `https://ssreditor-ebgyajbnfme3ddcv.northeurope-01.azurewebsites.net/posts/${documentId}`,
                { allowed: [email] }
            );


            if (updateResponse.status === 200) {
                setResponseMessage('Invitation sent successfully!');
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
          {responseMessage && <p>{responseMessage}</p>}
        </div>
      );
};      
export default SendInvitForm;
