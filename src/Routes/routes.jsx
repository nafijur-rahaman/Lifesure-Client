import { createBrowserRouter } from "react-router";
import PrivateRoute from "../Context/PrivateRoute";
import RoleRoute from "../Context/RoleRoute";

// Layouts
import Root from "../Layout/RootLayout/Root";
import AdminSidebar from "../Dashboards/AdminDashboard/AdminSidebar";
import AgentSidebar from "../Dashboards/AgentDashboard/AgentSidebar";
import ClientSidebar from "../Dashboards/ClientDashboard/ClientSidebar";

// Public Pages
import Home from "../Pages/Home/Home";
import Register from "../Pages/Register/Register";
import Login from "../Pages/Login/Login";
import Blogs from "../Pages/Blogs/Blogs";

// Private Pages (any logged-in user)
import Policies from "../Pages/Policies/Policies";
import PolicyDetails from "../Pages/PoliceyDetails/PolicyDetails";
import QuotePage from "../Pages/QuotePage/QuotePage";
import ApplicationPage from "../Pages/ApplicationPage/Application";

// Admin Pages
import Dashboard from "../Dashboards/AdminDashboard/Dashboard";
import Profile from "../Components/Profile/Profile";
import ManageApplications from "../Dashboards/AdminDashboard/ManageApplications";
import ManageUsers from "../Dashboards/AdminDashboard/ManageUsers";
import ManagePolicies from "../Dashboards/AdminDashboard/ManagePolicies";
import ManagePayment from "../Dashboards/AdminDashboard/ManagePayment";

// Agent Pages
import AgentDashboard from "../Dashboards/AgentDashboard/AgentDashboard";
import AssignedCustomer from "../Dashboards/AgentDashboard/AssignedCustomer";
import PolicyClearance from "../Dashboards/AgentDashboard/PolicyClearance";

// Client Pages
import ClientDashboard from "../Dashboards/ClientDashboard/ClientDashboard";
import MyPolicies from "../Dashboards/ClientDashboard/MyPolicies";
import Payments from "../Dashboards/ClientDashboard/Payments";
import PaymentPage from "../Dashboards/ClientDashboard/PaymentPage";
import ClaimRequestPage from "../Dashboards/ClientDashboard/ClaimRequestPage";

// Errors
import Page404 from "../Components/Page404/Page404";
import Unauthorized from "../Components/Unauthorized/Unauthorized";
import ManageBlogs from "../Components/ManageBlogs/ManageBlogs";
import CreateBlogs from "../Components/CreateBlogs/CreateBlogs";

export const router = createBrowserRouter([
  // Public routes
  {
    path: "/",
    element: <Root />,
    errorElement: <Page404 />,
    children: [
      { index: true, element: <Home /> },
      { path: "register", element: <Register /> },
      { path: "login", element: <Login /> },
      { path: "blogs", element: <Blogs /> },
      { path: "policies", element: <Policies /> },
      {
        path: "/policy-details/:id",
        element: (
          <PrivateRoute>
            <PolicyDetails />
          </PrivateRoute>
        ),
      },
      {
        path: "/quote-page/:id",
        element: (
          <PrivateRoute>
            <QuotePage />
          </PrivateRoute>
        ),
      },
      {
        path: "/application-page/:id",
        element: (
          <PrivateRoute>
            <ApplicationPage />
          </PrivateRoute>
        ),
      },
    ],
  },

  // Admin Dashboard (role-based)
  {
    path: "/admin-dashboard",
    element: (
      <RoleRoute allowedRoles={["admin"]}>
        <AdminSidebar />
      </RoleRoute>
    ),
    errorElement: <Page404 />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "profile", element: <Profile /> },
      { path: "manage-applications", element: <ManageApplications /> },
      { path: "manage-blogs", element: <ManageBlogs /> },
      { path: "create-blogs", element: <CreateBlogs /> },
      { path: "manage-users", element: <ManageUsers /> },
      { path: "manage-policies", element: <ManagePolicies /> },
      { path: "manage-payments", element: <ManagePayment /> },
    ],
  },

  // Agent Dashboard (role-based)
  {
    path: "/agent-dashboard",
    element: (
      <RoleRoute allowedRoles={["agent"]}>
        <AgentSidebar />
      </RoleRoute>
    ),
    errorElement: <Page404 />,
    children: [
      { index: true, element: <AgentDashboard /> },
      { path: "assigned-customers", element: <AssignedCustomer /> },
      { path: "profile", element: <Profile /> },
      { path: "manage-blogs", element: <ManageBlogs /> },
      { path: "create-blogs", element: <CreateBlogs /> },
      { path: "policy-clearance", element: <PolicyClearance /> },
    ],
  },

  // Client Dashboard (role-based)
  {
    path: "/client-dashboard",
    element: (
      <RoleRoute allowedRoles={["customer"]}>
        <ClientSidebar />
      </RoleRoute>
    ),
    errorElement: <Page404 />,
    children: [
      { index: true, element: <ClientDashboard /> },
      { path: "profile", element: <Profile /> },
      { path: "my-policies", element: <MyPolicies /> },
      { path: "my-payments", element: <Payments /> },
      { path: "payment-page/:id", element: <PaymentPage /> },
      { path: "claim-policies", element: <ClaimRequestPage /> },
    ],
  },

  // Unauthorized route
  { path: "/unauthorized", element: <Unauthorized /> },

  // Catch-all 404
  { path: "*", element: <Page404 /> },
]);
