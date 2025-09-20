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
import ManageApplications from "../Dashboards/AdminDashboard/ManageApplications";
import AdminSidebar from "../Dashboards/AdminDashboard/AdminSidebar";
import Dashboard from "../Dashboards/AdminDashboard/Dashboard";
import ManageUsers from "../Dashboards/AdminDashboard/ManageUsers";
import ManagePolicies from "../Dashboards/AdminDashboard/ManagePolicies";
import ManagePayment from "../Dashboards/AdminDashboard/ManagePayment";
import AgentSidebar from "../Dashboards/AgentDashboard/AgentSidebar";
import AgentDashboard from "../Dashboards/AgentDashboard/AgentDashboard";
import AssignedCustomer from "../Dashboards/AgentDashboard/AssignedCustomer";
import ManageBlogs from "../Dashboards/AgentDashboard/ManageBlogs";
import CreateBlogs from "../Dashboards/AgentDashboard/CreateBlogs";
import PolicyClearance from "../Dashboards/AgentDashboard/PolicyClearance";
import ClientSidebar from "../Dashboards/ClientDashboard/ClientSidebar";
import ClientDashboard from "../Dashboards/ClientDashboard/ClientDashboard";
import MyPolicies from "../Dashboards/ClientDashboard/MyPolicies";
import Payments from "../Dashboards/ClientDashboard/Payments";
import PaymentPage from "../Dashboards/ClientDashboard/PaymentPage";
import ClaimRequestPage from "../Dashboards/ClientDashboard/ClaimRequestPage";

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
        element: <Register></Register>,
      },
      {
        path: "/login",
        element: <Login></Login>,
      },
      {
        path: "/blogs",
        element: <Blogs></Blogs>,
      },
      {
        path: "/blog/",
        element: <BlogDetails></BlogDetails>,
      },
      {
        path: "/policies",
        element: <Policies></Policies>,
      },
      {
        path: "/policy-details",
        element: <PolicyDetails></PolicyDetails>,
      },
      {
        path: "/quote-page",
        element: <QuotePage></QuotePage>,
      },
      {
        path: "/application-page",
        element: <ApplicationPage></ApplicationPage>,
      },
    ],
  },

  {
    path: "/admin-dashboard",
    element: <AdminSidebar></AdminSidebar>,
    children: [
      {
        path: "",
        element: <Dashboard></Dashboard>,
      },
      {
        path: "manage-applications",
        element: <ManageApplications></ManageApplications>,
      },
      {
        path: "manage-users",
        element: <ManageUsers></ManageUsers>,
      },
      {
        path: "manage-policies",
        element: <ManagePolicies></ManagePolicies>,
      },
      {
        path: "manage-payments",
        element: <ManagePayment></ManagePayment>,
      },
    ],
  },
  {
    path: "/agent-dashboard",
    element: <AgentSidebar></AgentSidebar>,
    children: [
      {
        path: "",
        element: <AgentDashboard></AgentDashboard>,
      },
      {
        path: "assigned-customers",
        element: <AssignedCustomer></AssignedCustomer>,
      },
      {
        path: "manage-blogs",
        element: <ManageBlogs></ManageBlogs>,
      },
      {
        path: "create-blog",
        element: <CreateBlogs></CreateBlogs>,
      },
      {
        path: "policy-clearance",
        element: <PolicyClearance></PolicyClearance>,
      },
    ],
  },
  {
    path: "/client-dashboard",
    element: <ClientSidebar></ClientSidebar>,
    children: [
      {
        path: "",
        element: <ClientDashboard></ClientDashboard>,
      },
      {
        path:'my-policies',
        element: <MyPolicies></MyPolicies>
      },{
        path: "my-payments",
        element: <Payments></Payments>
      },{
        path: "payment-page",
        element: <PaymentPage></PaymentPage>
      },
      {
        path: "claim-policies",
        element: <ClaimRequestPage></ClaimRequestPage>
      }
    ],
  },
]);
