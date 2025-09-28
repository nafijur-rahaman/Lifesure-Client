import React from "react";
import { Navigate, useLocation } from "react-router";
import useAuth from "../hooks/UseAuth";
import Spinner from "../Components/Spinner/Spinner";



const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const {pathname} = useLocation();

//   console.log(user);

  if (loading) return <Spinner></Spinner>;

  if (!user || !user.email) {
   return <Navigate state={pathname} to={'/login'}></Navigate>
  }

  return children;
};

export default PrivateRoute;
