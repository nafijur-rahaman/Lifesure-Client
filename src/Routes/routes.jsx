import { createBrowserRouter } from "react-router";
import Root from "../Layout/RootLayout/Root";
import Home from "../Pages/Home/Home";
import Register from "../Pages/Register/Register";
import Login from "../Pages/Login/Login";
import Blogs from "../Pages/Blogs/Blogs";
import BlogDetails from "../Pages/BlogDetails/BlogDetails";
import Policies from "../Pages/Policies/Policies";
import PolicyDetails from "../Pages/PoliceyDetails/PolicyDetails";
import QuotePage from "../Pages/QuotePage/QuotePage";
import ApplicationPage from "../Pages/ApplicationPage/Application";

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
      },{
        path: "/blogs",
        element:<Blogs></Blogs>
      },{
        path:"/blog/",
        element:<BlogDetails></BlogDetails>,
       
      },
       {
          path: "/policies",
          element: <Policies></Policies>
        },
        {
          path: "/policy-details",
          element: <PolicyDetails></PolicyDetails>
        },{
          path:"/quote-page",
          element: <QuotePage></QuotePage>
        },{
          path: "/application-page",
          element: <ApplicationPage></ApplicationPage>
        }
    ],
  },
]);
