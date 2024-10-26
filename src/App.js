import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import DocumentList from './components/DocumentList';
import DocumentDetail from './components/DocumentDetail';
import NewDocumentForm from './components/NewDocumentForm';
import UpdateDocumentForm from './components/UpdateDocumentForm';
import SendInvitForm from './components/SendInvitForm';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import PrivateRoute from './components/PrivateRoute'; 
import './App.css';

function App() {
    return (
        <div className="App">
            <header className="App-header"></header>

            <Router>
                <Routes>
                    <Route path="/" element={<LoginForm />} />
                    <Route path="/register" element={<RegisterForm />} />
                    <Route path="/documents" element={<PrivateRoute element={DocumentList} />} />
                    <Route path="/document/:id" element={<PrivateRoute element={DocumentDetail} />} />
                    <Route path="/new" element={<PrivateRoute element={NewDocumentForm} />} />
                    <Route path="/edit/:id" element={<PrivateRoute element={UpdateDocumentForm} />} />
                    <Route path="/invite" element={<PrivateRoute element={SendInvitForm} />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
