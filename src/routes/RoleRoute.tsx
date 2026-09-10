import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { UserRole } from "../types/user";

interface RoleRouteProps {
  allowedRoles: UserRole[];
}

const RoleRoute = ({ allowedRoles }: RoleRouteProps) => {
  const { currentUser, role } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default RoleRoute;
