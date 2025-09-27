import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// This line imports all the styles from our global CSS file.
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);