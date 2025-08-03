import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';

const PublicRoute = ({ element: Component, restricted, ...rest }) => {
  return isAuthenticated() && restricted ? <Navigate to="/dashboard" /> : <Component {...rest} />;
};

export default PublicRoute;
