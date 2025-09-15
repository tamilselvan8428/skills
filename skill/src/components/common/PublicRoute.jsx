import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const PublicRoute = ({ children, restricted = false }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  if (loading) {
    // Show loading spinner or skeleton screen
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If route is restricted and user is authenticated, redirect to the intended page or home
  if (isAuthenticated && restricted) {
    return <Navigate to={from} replace />;
  }

  return children;
};

export default PublicRoute;
