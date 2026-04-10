import { Navigate, useLocation } from 'react-router-dom';

function PrivateRoute({ children, allowedRoles }) {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const normalizedRole = role?.toString().toLowerCase();

  if (!token || !role) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (
    Array.isArray(allowedRoles) &&
    !allowedRoles.map((allowed) => allowed.toLowerCase()).includes(normalizedRole)
  ) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default PrivateRoute;
