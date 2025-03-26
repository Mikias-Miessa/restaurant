import { Navigate } from "react-router-dom";

function RoleBasedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default RoleBasedRoute;
