import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Three pages, so a path check is all the routing needed. The admin and the
// projects page are split into their own chunks, downloaded only when opened.
const AdminApp = lazy(() => import('./admin/AdminApp.jsx'));
const AllProjects = lazy(() => import('./pages/AllProjects.jsx'));

const path = window.location.pathname.replace(/\/+$/, '');
const isAdmin = path === '/admin' || path.startsWith('/admin/');
const isProjects = path === '/projects';

function Page() {
  if (isAdmin) return <AdminApp />;
  if (isProjects) return <AllProjects />;
  return <App />;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Suspense fallback={null}>
      <Page />
    </Suspense>
  </React.StrictMode>
);
