import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import DocumentList from './components/DocumentList';
import DocumentDetail from './components/DocumentDetail';
import DocumentForm from './components/DocumentForm';
import './App.css';

function App() {
    return (
        <div className="App">
            <header className="App-header"></header>

            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<DocumentList />} />
                    <Route path="/document/:id" element={<DocumentDetail />} />
                    <Route path="/new" element={<DocumentForm />} />
                    <Route path="/edit/:id" element={<DocumentForm />} />
                </Routes>
            </BrowserRouter>

        </div>
    );
}

export default App;
