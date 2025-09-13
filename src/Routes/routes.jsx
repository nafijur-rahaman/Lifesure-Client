import { createBrowserRouter } from "react-router";
import Root from "../Layout/RootLayout/Root";
import Home from "../Pages/Home/Home";

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
    ],
  },
]);
