import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import './index.css';

// Lazy load components for code splitting
const DashboardPageLazy = React.lazy(() => import('./pages/DashboardPage'));
const LoginPageLazy = React.lazy(() => import('./pages/LoginPage'));
const NotFoundPageLazy = React.lazy(() => import('./pages/NotFoundPage'));

function App() {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  return (
    <ThemeProvider>
      <Router>
        <div className="app">
          <Routes>
            <Route 
              path="/login" 
              element={
                <React.Suspense fallback={<div>Loading...</div>}>
                  <LoginPageLazy />
                </React.Suspense>
              } 
            />
            <Route 
              path="/dashboard/*" 
              element={
                <ProtectedRoute>
                  <React.Suspense fallback={<div>Loading...</div>}>
                    <DashboardPageLazy />
                  </React.Suspense>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/" 
              element={<Navigate to="/dashboard" replace />}
            />
            <Route 
              path="*" 
              element={
                <React.Suspense fallback={<div>Loading...</div>}>
                  <NotFoundPageLazy />
                </React.Suspense>
              } 
            />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
