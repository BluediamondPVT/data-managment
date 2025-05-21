// src/routes/PrivateRoute.jsx
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('loggedIn') === 'true';
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
