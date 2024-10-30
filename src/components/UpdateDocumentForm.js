// UpdateDocumentForm.js

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { GraphQLClient, gql } from 'graphql-request';
import { getAuthToken } from '../utils/auth';
import { io } from 'socket.io-client';

const UpdateDocumentForm = () => {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();
  const authToken = getAuthToken();

  // GraphQL client setup
  const client = new GraphQLClient('https://ssreditor-ebgyajbnfme3ddcv.northeurope-01.azurewebsites.net/graphql/docs', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
  });

  // GraphQL queries and mutations
  const FETCH_DOCUMENT_QUERY = gql`
    query GetDocument($id: ID!) {
      document(id: $id) {
        title
        content
      }
    }
  `;

  const UPDATE_DOCUMENT_MUTATION = gql`
    mutation UpdateDocument($id: ID!, $title: String!, $content: String!) {
      updatedocument(id: $id, title: $title, content: $content) {
        title
        content
      }
    }
  `;

  // WebSocket connection and event handling
  useEffect(() => {
    const newSocket = io('https://ssreditor-ebgyajbnfme3ddcv.northeurope-01.azurewebsites.net', {
      auth: { token: authToken },
    });
    setSocket(newSocket);

    // Join the document
    newSocket.emit('joinDocument', { documentId: id, email: authToken });

    // Listen for incoming changes
    newSocket.on('receiveTypingContent', (newContent) => {
      setContent(newContent);
    });

    newSocket.on('receiveTypingTitle', (newTitle) => {
      setTitle(newTitle);
    });

    // Cleanup function to disconnect the socket and remove listeners
    return () => {
      newSocket.disconnect();
      newSocket.off('receiveTypingContent');
      newSocket.off('receiveTypingTitle');
    };
  }, [id, authToken]);

  // Fetch the document data when the component mounts
  useEffect(() => {
    async function fetchData() {
      try {
        const variables = { id };
        const data = await client.request(FETCH_DOCUMENT_QUERY, variables);
        setTitle(data.document.title);
        setContent(data.document.content);
      } catch (error) {
        console.error('Error fetching document:', error);
      }
    }
    fetchData();
  }, [id]);

  // Handle form submission to update the document
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const variables = { id, title, content };
      await client.request(UPDATE_DOCUMENT_MUTATION, variables);
      navigate('/documents');
    } catch (error) {
      console.error('Error updating document:', error);
    }
  };

  const documentUrl = `https://www.student.bth.se/~sahb23/editor/#/edit/${id}`;

  return (
    <div>
      <h1>Edit Document</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (socket) {
                socket.emit('typingTitle', e.target.value); // Emit change
              }
            }}
          />
        </label>
        <label>
          Content:
          <input
            type="text"
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              if (socket) {
                socket.emit('typingContent', e.target.value); // Emit change
              }
            }}
          />
        </label>
        <button type="submit" className='button-update'>Save Changes</button>
      </form>
      <Link to={`/invite?documentUrl=${encodeURIComponent(documentUrl)}`} className='button'>Invite to Edit</Link>
    </div>
  );
};

export default UpdateDocumentForm;
