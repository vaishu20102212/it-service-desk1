import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const user = localStorage.getItem("user");

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  try {
    const parsed = JSON.parse(user);
    if (!parsed || !parsed.id) {
      localStorage.removeItem("user");
      return <Navigate to="/login" replace />;
    }
  } catch {
    localStorage.removeItem("user");
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
