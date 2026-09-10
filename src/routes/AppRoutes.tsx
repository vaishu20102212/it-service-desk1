import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import Tickets from "../pages/Tickets/Tickets";
import TicketDetails from "../pages/Tickets/TicketDetails";
import Users from "../pages/Users/Users";
import Categories from "../pages/Categories/Categories";
import Reports from "../pages/Reports/Reports";
import Profile from "../pages/Profile/Profile";
import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Login Route */}
      <Route path="/login" element={<Login />} />

      {/* Protected Routes (All authenticated users) */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/tickets/:id" element={<TicketDetails />} />
        <Route path="/profile" element={<Profile />} />

        {/* Admin Only Routes (Section 2, 12, 13, 21, 25) */}
        <Route element={<RoleRoute allowedRoles={["admin"]} />}>
          <Route path="/users" element={<Users />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/reports" element={<Reports />} />
        </Route>
      </Route>

      {/* Default redirects */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;