// UpdateDocumentForm.js

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { GraphQLClient, gql } from 'graphql-request';
import { getAuthToken } from '../utils/auth';

const UpdateDocumentForm = () => {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();
  const authToken = getAuthToken();


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
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
        <label>
          <input type="text" value={content} onChange={(e) => setContent(e.target.value)} />
        </label>
        <button type="submit" className='button-update'>Save Changes</button>
      </form>
      <Link to={`/invite?documentUrl=${encodeURIComponent(documentUrl)}`} className='button'>Invite to Edit</Link>
    </div>
  );
}

export default UpdateDocumentForm;
