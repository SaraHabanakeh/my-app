import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';


function DocumentForm() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
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
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const documentData = { title, content };

    try {
      if (id) {
        await axios.post(`https://ssreditor-ebgyajbnfme3ddcv.northeurope-01.azurewebsites.net/posts/${id}`, documentData);
      } else {
        await axios.post(`https://ssreditor-ebgyajbnfme3ddcv.northeurope-01.azurewebsites.net/posts/new`, documentData);
      }
      navigate('/');
    } catch (error) {
      console.error('Error saving document:', error);
    }
  };

  return (
    <div>
      <h1>{id ? 'Edit Document' : 'New Document'}</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
        <label>
          Content:
          <input  type="text" value={content} onChange={(e) => setContent(e.target.value)} />
        </label>
        <button type="submit" className='button'>Save</button>
      </form>
    </div>
  );
}

export default DocumentForm;
