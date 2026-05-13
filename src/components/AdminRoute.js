/**
 * AdminRoute Component
 * Protects admin-only routes with role-based access control
 * Redirects unauthorized users to homepage
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin } = useAuth();

  // Not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but not admin
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Admin user - render children
  return children;
};

export default AdminRoute;
