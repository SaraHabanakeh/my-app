//NewDocumentForm

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraphQLClient, gql } from 'graphql-request';
import { getUserEmail, getAuthToken } from '../utils/auth';

function NewDocumentForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();
  const userEmail = getUserEmail();
  const authToken = getAuthToken();

  const ADD_DOCUMENT_MUTATION = gql`
    mutation AddDocument($title: String!, $content: String!, $allowed: [String!]) {
      adddocument(title: $title, content: $content, allowed: $allowed) {
        _id
        title
        content
        allowed
      }
    }
  `;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const client = new GraphQLClient('https://ssreditor-ebgyajbnfme3ddcv.northeurope-01.azurewebsites.net/graphql/docs', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
    });

    const documentData = {
      title,
      content,
      allowed: [userEmail],
    };

    try {
      await client.request(ADD_DOCUMENT_MUTATION, documentData);
      navigate('/documents');
    } catch (error) {
      console.error('Error creating document:', error);
    }
  };

  return (
    <div>
      <h1>New Document</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
        />
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Content"
          required
        />
        <button type="submit" className='button-new'>Save</button>
      </form>
    </div>
  );
}

export default NewDocumentForm;
