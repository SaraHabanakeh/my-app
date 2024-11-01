import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { GraphQLClient, gql } from 'graphql-request';
import { getAuthToken, getUserEmail } from '../utils/auth';
import { io } from 'socket.io-client';
import Editor from '@monaco-editor/react';

const UpdateDocumentForm = () => {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [socket, setSocket] = useState(null);
  const [isCodeMode, setIsCodeMode] = useState(false);
  const [output, setOutput] = useState('');

  const navigate = useNavigate();
  const authToken = getAuthToken();
  const userEmail = getUserEmail();

  const client = new GraphQLClient('https://ssreditor-ebgyajbnfme3ddcv.northeurope-01.azurewebsites.net/graphql/docs', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`,
    },
  });

  const FETCH_DOCUMENT_QUERY = gql`
    query GetDocument($id: ID!) {
      document(id: $id) {
        title
        content
        code
      }
    }
  `;

  const UPDATE_DOCUMENT_MUTATION = gql`
    mutation UpdateDocument($id: ID!, $title: String!, $content: String!, $code: Boolean!) {
      updatedocument(id: $id, title: $title, content: $content, code: $code) {
        title
        content
        code
      }
    }
  `;

  //Socket
  useEffect(() => {
    const newSocket = io('https://ssreditor-ebgyajbnfme3ddcv.northeurope-01.azurewebsites.net', {
      auth: { token: authToken },
    });
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
      newSocket.emit('joinDocument', { documentId: id, email: userEmail });
    });

    newSocket.on('receiveTypingContent', (newContent) => {
      setContent(newContent);
    });

    newSocket.on('receiveTypingTitle', (newTitle) => {
      setTitle(newTitle);
    });


    return () => {
      newSocket.off('receiveTypingContent');
      newSocket.off('receiveTypingTitle');
      newSocket.disconnect();
    };
  }, [id, userEmail, authToken]);

  useEffect(() => {
    async function fetchData() {
      try {
        const variables = { id };
        const data = await client.request(FETCH_DOCUMENT_QUERY, variables);
        setTitle(data.document.title);
        setContent(data.document.content);
        setIsCodeMode(data.document.code !== undefined ? data.document.code : false);
      } catch (error) {
        console.error('Error fetching document:', error);
      }
    }
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const variables = { id, title, content, code: isCodeMode };
      console.log('Updating document with variables:', variables);
      await client.request(UPDATE_DOCUMENT_MUTATION, variables);
      navigate('/documents');
    } catch (error) {
      console.error('Error updating document:', error.response.errors);
    }
  };

  const handleTypingContent = (value) => {
    setContent(value);
    if (socket) {
      socket.emit('typingContent', { documentId: id, userEmail, content: value });
    }
  };

  const handleTypingTitle = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (socket) {
      socket.emit('typingTitle', { documentId: id, userEmail, title: newTitle });
    }
  };

  // Execute code
  const handleExecuteCode = async () => {
    if (isCodeMode) {
      console.log("Executing code:", content);

      try {
        const base64Code = btoa(content);
        const response = await fetch("https://execjs.emilfolino.se/code", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code: base64Code }),
        });

        const result = await response.json();
        const decodedOutput = atob(result.data);
        setOutput(decodedOutput);
      } catch (error) {
        console.error("Error executing code:", error);
        setOutput("Error executing code");
      }
    }
  };



  const documentUrl = `https://www.student.bth.se/~sahb23/editor/#/edit/${id}`;

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          <input
            type="text"
            value={title}
            onChange={handleTypingTitle}
            className="title-input"
          />
        </label>
        <label>
          <div className="editor-container">
            {isCodeMode ? (
              <>
                <Editor
                  height="400px"
                  language="javascript"
                  value={content}
                  onChange={handleTypingContent}
                  className="content-input"
                />
                <button 
                  onClick={(e) => { e.preventDefault(); handleExecuteCode(); }} 
                  className="run-button"
                >
                  ⏵
                </button>
              </>
            ) : (
              <textarea
                value={content}
                onChange={(e) => handleTypingContent(e.target.value)}
                rows="10"
                className="content-input"
                style={{ width: '100%' }}
              />
            )}
          </div>
        </label>

        <pre>{output}</pre>

        <div className="button-container">
          <button type="submit" className="button-update">Save</button>
          <Link to={`/invite?documentUrl=${encodeURIComponent(documentUrl)}`} className="button-invite">Invite to Edit</Link>
        </div>
        <div className="button-container">
          <button onClick={(e) => { e.preventDefault(); setIsCodeMode(prev => !prev); }} className="button-code">
            {isCodeMode ? 'Text Mode' : 'Code Mode'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateDocumentForm;
