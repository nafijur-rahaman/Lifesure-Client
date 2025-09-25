import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { RouterProvider } from "react-router/dom";
import "./index.css";
import { router } from "./Routes/routes";
import ThemeProvider from "./Context/ThemeProvider";
import AuthContextProvider from "./Context/AuthContextProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
    <AuthContextProvider>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      </QueryClientProvider>
      </AuthContextProvider>
    </ThemeProvider>
  </StrictMode>
);
