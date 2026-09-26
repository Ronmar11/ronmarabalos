import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Two pages, so a path check is all the routing needed. The admin is split
// into its own chunk that only downloads when /admin is actually opened.
const AdminApp = lazy(() => import('./admin/AdminApp.jsx'));
const path = window.location.pathname.replace(/\/+$/, '');
const isAdmin = path === '/admin' || path.startsWith('/admin/');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {isAdmin ? (
      <Suspense fallback={null}>
        <AdminApp />
      </Suspense>
    ) : (
      <App />
    )}
  </React.StrictMode>
);
