// DocumentList.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { getUserEmail } from '../utils/auth';

function DocumentList() {
  const [documents, setDocuments] = useState([]);
  const userEmail = getUserEmail();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('https://ssreditor-ebgyajbnfme3ddcv.northeurope-01.azurewebsites.net/posts/');
        const allDocuments = response.data.data;

        const accessibleDocuments = allDocuments.filter(doc => doc.allowed.includes(userEmail));
        
        setDocuments(accessibleDocuments);
      } catch (error) {
        console.error('Error fetching documents:', error);
      }
    }

    fetchData();
  }, [userEmail]);

  return (
    <div>
      <h1>Documents</h1>
      <ul>
        {documents.length > 0 ? (
          documents.map((document) => (
            <li key={document._id}>
              <Link to={`/document/${document._id}`} className="doc">{document.title}</Link>
              <Link to={`/edit/${document._id}`}>✎</Link>
            </li>
          ))
        ) : (
          <p>No documents available for your access.</p>
        )}
      </ul>
      <Link to="/new" className="link-doc"><span className="plus-icon">➕</span>Create New Document</Link>
    </div>
  );
}

export default DocumentList;
