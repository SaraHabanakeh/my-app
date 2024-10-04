import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import DocumentList from './components/DocumentList';
import DocumentDetail from './components/DocumentDetail';
import DocumentForm from './components/DocumentForm';
import './App.css';

function App() {
    return (
        <div className="App">
            <header className="App-header"></header>

            <Router>
                <Routes>
                    <Route path="/" element={<DocumentList />} />
                    <Route path="/document/:id" element={<DocumentDetail />} />
                    <Route path="/new" element={<DocumentForm />} />
                    <Route path="/edit/:id" element={<DocumentForm />} />
                </Routes>
            </Router>

        </div>
    );
}

export default App;
