// DocumentDetail.js

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { GraphQLClient, gql } from 'graphql-request';
import { getAuthToken } from '../utils/auth';

function DocumentDetail() {
  const { id } = useParams();
  const [document, setDocument] = useState(null);
  const [error, setError] = useState(null);

  const authToken = getAuthToken();
  const client = new GraphQLClient('https://ssreditor-ebgyajbnfme3ddcv.northeurope-01.azurewebsites.net/graphql/docs', {
    headers: {
      'content-type': 'application/json',
      'Authorization': `Bearer ${authToken}`,
    },
  });

  const DOCUMENT_QUERY = gql`
    query Document($id: ID!) {
      document(id: $id) {
        _id
        title
        content
      }
    }
  `;

  useEffect(() => {
    async function fetchDocument() {
      try {
        const variables = { id };
        const data = await client.request(DOCUMENT_QUERY, variables);

        if (data.document) {
          setDocument(data.document);
        } else {
          setError('Document not found.');
        }
      } catch (err) {
        console.error('Error fetching document:', err);
        setError('Error fetching document');
      }
    }

    fetchDocument();
  }, [id, client]);

  if (error) return <div>{error}</div>;

  return (
    <div>
      {document ? (
        <>
          <h1>{document.title}</h1>
          <p>{document.content}</p>
        </>
      ) : (
        <p>Document not found.</p>
      )}
      <Link to="/documents" className='button'>Back to Document List</Link>
    </div>
  );
}

export default DocumentDetail;
