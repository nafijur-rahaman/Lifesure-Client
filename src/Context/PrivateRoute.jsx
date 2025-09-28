import React from "react";
import { Navigate, useLocation } from "react-router";
import Loading from "../components/Loader/Loader";
import useAuth from "../hooks/UseAuth";


const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const {pathname} = useLocation();

//   console.log(user);

  if (loading) return <Loading />;

  if (!user || !user.email) {
   return <Navigate state={pathname} to={'/login'}></Navigate>
  }

  return children;
};

export default PrivateRoute;
