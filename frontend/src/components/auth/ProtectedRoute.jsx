import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user, isEmployee, isSafetyOfficer, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#FF5E3A] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const userRole = user?.role;

  const isUserAllowed =
    allowedRoles.length === 0 ||
    allowedRoles.some(r => {
      if (r === 'worker' || r === 'employee') return isEmployee;
      if (r === 'admin' || r === 'safety_officer') return isSafetyOfficer;
      return r === userRole;
    });

  if (!isUserAllowed) {
    // Redirect employees to Employee Dashboard, safety officers to Officer Dashboard
    if (isEmployee) {
      return <Navigate to="/employee-dashboard" replace />;
    }
    return <Navigate to="/officer-dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
