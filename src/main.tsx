import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './app/App';
// import './styles/themes.css';
import './styles/style.css';
import '@/lib/i18n';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);