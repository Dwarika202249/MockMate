import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../redux/slices/authSlice';

const PublicRoute = ({ element: Component, restricted, ...rest }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  return isAuthenticated && restricted ? <Navigate to="/dashboard" /> : <Component {...rest} />;
};

export default PublicRoute;
