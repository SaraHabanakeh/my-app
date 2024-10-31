//UpdateDocumentForm.js

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { GraphQLClient, gql } from 'graphql-request';
import { getAuthToken, getUserEmail } from '../utils/auth';
import { io } from 'socket.io-client';
import Editor from '@monaco-editor/react';

const UpdateDocumentForm = () => {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [socket, setSocket] = useState(null);
  const [isCodeMode, setIsCodeMode] = useState(false);

  const navigate = useNavigate();
  const authToken = getAuthToken();
  const userEmail = getUserEmail();

  const client = new GraphQLClient('https://ssreditor-ebgyajbnfme3ddcv.northeurope-01.azurewebsites.net/graphql/docs', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
  });

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

  useEffect(() => {
    const newSocket = io('https://ssreditor-ebgyajbnfme3ddcv.northeurope-01.azurewebsites.net', {
      auth: { token: authToken },
    });
    setSocket(newSocket);

    newSocket.emit('joinDocument', { documentId: id, email: userEmail });

    newSocket.on('receiveTypingContent', (newContent) => {
      setContent(newContent);
    });
    newSocket.on('receiveTypingTitle', (newTitle) => {
      setTitle(newTitle);
    });

    return () => {
      newSocket.disconnect();
      newSocket.off('receiveTypingContent');
      newSocket.off('receiveTypingTitle');
    };
  }, [id, userEmail, authToken]);

  useEffect(() => {
    async function fetchData() {
      try {
        const variables = { id };
        const data = await client.request(FETCH_DOCUMENT_QUERY, variables);
        setTitle(data.document.title);
        setContent(data.document.content);
        setIsCodeMode(data.document.code);
      } catch (error) {
        console.error('Error fetching document:', error);
      }
    }
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const variables = { id, title, content, code: isCodeMode };
      await client.request(UPDATE_DOCUMENT_MUTATION, variables);
      navigate('/documents');
    } catch (error) {
      console.error('Error updating document:', error);
    }
  };

  const handleTypingContent = (newContent) => {
    setContent(newContent);
    socket.emit('typingContent', { documentId: id, userEmail, content: newContent });
  };

  const handleTypingTitle = (newTitle) => {
    setTitle(newTitle);
    socket.emit('typingTitle', { documentId: id, userEmail, title: newTitle });
  };

  const documentUrl = `https://www.student.bth.se/~sahb23/editor/#/edit/${id}`;

  return (
<div>
  <h1>Edit Document</h1>
  <form onSubmit={handleSubmit}>
    <label>
      {isCodeMode ? (
        <Editor
          height="50px"
          language="plaintext"
          value={title}
          onChange={(value) => handleTypingTitle(value || '')}
          className="title-input"
        />
      ) : (
        <input
          type="text"
          value={title}
          onChange={(e) => handleTypingTitle(e.target.value)}
          className="title-input"
        />
      )}
    </label>
    <label>
      {isCodeMode ? (
        <Editor
          height="400px"
          language="javascript"
          value={content}
          onChange={(value) => handleTypingContent(value || '')}
          className="content-input"
        />
      ) : (
        <textarea
          value={content}
          onChange={(e) => handleTypingContent(e.target.value)}
          rows="10"
          className="content-input"
          style={{ width: '100%' }}
        />
      )}
    </label>

    <div className="button-container">
      <button type="submit" className="button-update">Save Changes</button>
      <Link to={`/invite?documentUrl=${encodeURIComponent(documentUrl)}`} className="button-invite">Invite to Edit</Link>
    </div>

    <button onClick={(e) => { e.preventDefault(); setIsCodeMode(prev => !prev); }} className="button-code">
      {isCodeMode ? 'Text Mode' : 'Code Mode'}
    </button>
  </form>
</div>
  );
};

export default UpdateDocumentForm;
