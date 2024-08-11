import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from './auth';

const PublicRoute = ({ element: Component, restricted, ...rest }) => {
  return isAuthenticated() && restricted ? <Navigate to="/dashboard" /> : <Component {...rest} />;
};

export default PublicRoute;
