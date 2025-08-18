
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Explicitly set React for Zustand to use
window.React = React;

// Ensure the root element exists
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found. Please add a div with id "root" to your HTML.');
}

// Create and render the root
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
