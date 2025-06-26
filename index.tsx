import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// Removed HashRouter

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    {/* HashRouter removed, App will connect to Zustand store and manage views with local state */}
    <App />
  </React.StrictMode>
);