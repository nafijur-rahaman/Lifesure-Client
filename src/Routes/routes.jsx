import { createBrowserRouter } from "react-router";
import Root from "../Layout/RootLayout/Root";
import Home from "../Pages/Home/Home";
import Register from "../Pages/Register/Register";
import Login from "../Pages/Login/Login";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root></Root>,
    children: [
      {
        index: true,
        path: "/",
        element: <Home></Home>,
      },
      {
        path: "/register",
        element: <Register></Register>
      },{
        path: "/login",
        element: <Login></Login>
      }
    ],
  },
]);
