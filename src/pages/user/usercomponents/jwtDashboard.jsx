import React, { useContext } from 'react';
import { AuthContext } from './jwtAuthContext';
import { Navigate } from 'react-router-dom';

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

function Dashboard({ children }) {
  const { token, loading } = useContext(AuthContext);

  const tokenFromCookies = !token ? getCookie('accessToken') : null;

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!token && !tokenFromCookies) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export default Dashboard;


