import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RoleBasedRedirect = () => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // If user hasn't completed registration, redirect to personal info
  if (user.isRegistrationComplete === false) {
    return <Navigate to="/personal-info" replace />;
  }
  
  if (user.role === 'patient') {
    return <Navigate to="/patient-dashboard" replace />;
  } else if (user.role === 'physiotherapist') {
    return <Navigate to="/physio-dashboard" replace />;
  }
  
  return <Navigate to="/login" replace />;
};

export default RoleBasedRedirect;