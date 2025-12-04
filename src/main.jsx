// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ParticiparPage from './pages/ParticiparPage';
import HostPage from './pages/HostPage';
import './index.css';
import './App.css';
import AdminLinksPage from './pages/AdminLinksPage.jsx';

const HOST_PATH = import.meta.env.VITE_SORTEO_HOST_PATH || '/host';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>


      <Routes>
        <Route path="/" element={<ParticiparPage />} />
        <Route path="/participar" element={<ParticiparPage />} />
        <Route path={HOST_PATH} element={<HostPage />} />
        <Route path="/admin-links" element={<AdminLinksPage />} />
      </Routes>

    </BrowserRouter>
  </React.StrictMode>
);
