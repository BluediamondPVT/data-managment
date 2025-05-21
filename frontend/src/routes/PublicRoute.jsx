// src/routes/PublicRoute.jsx
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('loggedIn') === 'true';
  return isAuthenticated ? <Navigate to="/" /> : children;
};

export default PublicRoute;
