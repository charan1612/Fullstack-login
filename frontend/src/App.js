import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check for token in localStorage on initial load
    return Boolean(localStorage.getItem('token'));
  });

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={
          <Login setIsAuthenticated={setIsAuthenticated} />
        } />
        <Route path="/signup" element={<Signup />} />

        {/* Protected route */}
        <Route path="/dashboard" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Dashboard setIsAuthenticated={setIsAuthenticated} />
          </ProtectedRoute>
        } />

        {/* Root path redirect */}
        <Route path="/" element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        } />
      </Routes>
    </Router>
  );
};

// Protected Route Component
const ProtectedRoute = ({ children, isAuthenticated }) => {
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default App;
