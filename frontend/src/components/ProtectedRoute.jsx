import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, adminRequired = false }) {
  const auth = useSelector(state => state.auth || {});
  const userInfo = auth.userInfo;
  const token = auth.token;

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (adminRequired && (!userInfo || userInfo.isAdmin !== true)) {
    return <Navigate to="/" replace />;
  }

  return children;
}