import React from "react";
import { Navigate, useLocation } from "react-router";

import useAuth from "../hooks/UseAuth";
import useUserRole from "../hooks/UserRole";
import Spinner from "../Components/Spinner/Spinner";


const RoleRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();
  const { role, roleLoading } = useUserRole();
  const {pathname}= useLocation();

  if (loading || roleLoading) return <Spinner></Spinner>;

  if (!user || !user.email) {
   return <Navigate state={pathname} to={'/login'}></Navigate>
  }

  if (!allowedRoles.includes(role)) {
    const redirectPath =
      role === "admin"
        ? "/admin-dashboard"
        : role === "agent"
        ? "/agent-dashboard"
        : "/client-dashboard";
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default RoleRoute;
