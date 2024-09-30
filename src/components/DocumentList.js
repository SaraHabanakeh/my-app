//DocumentList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function DocumentList() {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('http://localhost:1337/');
        console.log('Response:', response);
        setDocuments(response.data);
      } catch (error) {
        console.error('Error fetching documents:', error);
      }
    }
    fetchData();
  }, []);

  return (
    <div>
      <h1>Documents List</h1>
      <ul>
        {documents.map((document) => (
          <li key={document._id}>
            <Link to={`/document/${document._id}`}  className="doc">{document.title}</Link>
            <Link to={`/edit/${document._id}`} className="button1">Edit </Link>
          </li>
        ))}
      </ul>
      <Link to="/new" className="button">Create New Document</Link>
    </div>
  );
}

export default DocumentList;
