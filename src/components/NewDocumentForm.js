//NewDocumentForm

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getUserEmail } from '../utils/auth';

function NewDocumentForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();
  const userEmail = getUserEmail();
  console.log('User Email:', userEmail);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const documentData = {
      title,
      content,
      allowed: [userEmail]
  };

    try {
      const response = await axios.post(`https://ssreditor-ebgyajbnfme3ddcv.northeurope-01.azurewebsites.net/posts/new`, documentData);
      

      console.log('Document created:', response.data);
      

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
        />
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Content"
          className="input-field"
        />
        <button type="submit" className='button-new'>Save</button>
      </form>
    </div>
  );
}  
export default NewDocumentForm;
