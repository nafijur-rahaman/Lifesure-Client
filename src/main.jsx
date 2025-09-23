import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { RouterProvider } from "react-router/dom";
import "./index.css";
import { router } from "./Routes/routes";
import ThemeProvider from "./Context/ThemeProvider";
import AuthContextProvider from "./Context/AuthContextProvider";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
    <AuthContextProvider>
      <RouterProvider router={router} />
      </AuthContextProvider>
    </ThemeProvider>
  </StrictMode>
);
