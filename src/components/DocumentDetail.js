// DocumentDetail.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

function DocumentDetail() {
  const { id } = useParams();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDocument() {
      try {
        const response = await axios.get(`https://ssreditor-ebgyajbnfme3ddcv.northeurope-01.azurewebsites.net/posts/${id}`);
        console.log('Response:', response);

        setDocument(response.data);
      } catch (err) {
        setError('Error fetching document');
      } finally {
        setLoading(false);
      }
    }

    fetchDocument();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>{document.title}</h1>
      <p>{document.content}</p>
      <Link to="/" className='button'>Back to Document List</Link>
    </div>
  );
}

export default DocumentDetail;
