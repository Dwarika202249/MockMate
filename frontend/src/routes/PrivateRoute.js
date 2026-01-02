import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectAuthInitializing } from '../redux/slices/authSlice';
import Loader from '../components/common/Loader';

const PrivateRoute = ({ element: Component, ...rest }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const initializing = useSelector(selectAuthInitializing);
  
  // Show loader while checking auth state
  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0118] via-[#1a0b2e] to-[#0f0520]">
        <Loader />
      </div>
    );
  }
  
  return isAuthenticated ? <Component {...rest} /> : <Navigate to="/login" />;
};

export default PrivateRoute;
