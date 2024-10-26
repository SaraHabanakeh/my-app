// UpdateDocumentForm.js

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams , Link} from 'react-router-dom';
import axios from 'axios';

function UpdateDocumentForm() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`https://ssreditor-ebgyajbnfme3ddcv.northeurope-01.azurewebsites.net/posts/${id}`);
        setTitle(response.data.title);
        setContent(response.data.content);
      } catch (error) {
        console.error('Error fetching document:', error);
      }
    }
    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const documentData = { title, content };

    try {
      await axios.post(`https://ssreditor-ebgyajbnfme3ddcv.northeurope-01.azurewebsites.net/posts/${id}`, documentData);
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
