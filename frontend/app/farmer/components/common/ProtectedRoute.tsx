import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth, UserRole } from '../../context/AuthContext';

interface ProtectedRouteProps {
  requiredRole?: UserRole;
  children?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  requiredRole,
  children,
}) => {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    // If not authenticated, redirect to the shared login gateway at "/"
    return <Navigate to="/" replace />;
  }

  if (requiredRole && role !== requiredRole) {
    // If authenticated under a different role, redirect to the appropriate portal
    if (role === 'FARMER') return <Navigate to="/farmer/dashboard" replace />;
    if (role === 'OFFICER') return <Navigate to="/officer" replace />;
    if (role === 'ADMIN') return <Navigate to="/admin" replace />;
    return <Navigate to="/" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};
