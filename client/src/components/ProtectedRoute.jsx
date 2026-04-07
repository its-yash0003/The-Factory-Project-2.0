import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSkeleton from './LoadingSkeleton';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
