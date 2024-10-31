// DocumentList.js

import React, { useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { GraphQLClient, gql } from 'graphql-request';
import { getUserEmail, getAuthToken} from '../utils/auth';
import docIcon from '../doc.JPG';

function DocumentList() {
  const [documents, setDocuments] = useState([]);
  const userEmail = getUserEmail();
  const [responseMessage, setResponseMessage] = useState('');
  const authToken = getAuthToken();

  const client = new GraphQLClient('https://ssreditor-ebgyajbnfme3ddcv.northeurope-01.azurewebsites.net/graphql/docs', {
    headers: {
      'content-type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
  });

  const USER_DOCUMENTS_QUERY = gql`
    query UserDocuments($email: String!) {
    userdocuments(email: $email) {
    _id
    title
    allowed
      }
    }`;

    useEffect(() => {
      async function fetchDocuments() {
        try {
          const variables = { email: userEmail };
          const data = await client.request(USER_DOCUMENTS_QUERY, variables);

          if (data.userdocuments) {
            setDocuments(data.userdocuments);
            console.log(documents)
          } else {
            setResponseMessage('No documents available for your access.');
          }
        } catch (err) {
          console.error('Error fetching documents:', err);

        }
      }
  
      fetchDocuments();
    }, [userEmail]);


  return (
    <div>
      <h1>Documents</h1>
      <ul>
        {documents.length > 0 ? (
          documents.map((document) => (
            <li key={document._id}>
              <img src={docIcon} alt="Document icon" className="doc-icon" />
              <Link to={`/document/${document._id}`} className="doc">{document.title}</Link>

              <Link to={`/edit/${document._id}`}>✎</Link>
            </li>
          ))
        ) : (
          <p>No documents available for your access.</p>
        )}
      </ul>
      <Link to="/new" className="nav-link"> ➕Create New Document</Link>
      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
}

export default DocumentList;
