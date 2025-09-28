import { useState, useRef, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router";
import {
  Home,
  FileText,
  User,
  CreditCard,
  Bell,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import clsx from "clsx";
import useAuth from "../../hooks/UseAuth";

const menuItems = [
  { name: "Dashboard", icon: Home, path: "/client-dashboard" },
  {
    name: "My Policies",
    icon: FileText,
    path: "/client-dashboard/my-policies",
  },
  {
    name: "Payment Status",
    icon: CreditCard,
    path: "/client-dashboard/my-payments",
  },
  {
    name: "Claim Policies",
    icon: Bell,
    path: "/client-dashboard/claim-policies",
  },
];

export default function ClientSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const dropdownRef = useRef(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Preload profile image with fallback
  const [profileImage, setProfileImage] = useState("/default-avatar.png");
  useEffect(() => {
    if (user?.photoURL) {
      const img = new Image();
      img.src = user.photoURL;
      img.onload = () => setProfileImage(user.photoURL);
    }
  }, [user]);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside
        className={clsx(
          "fixed top-0 left-0 h-full bg-white/90 backdrop-blur-md border-r border-gray-200 shadow-lg flex flex-col transition-all duration-300",
          collapsed ? "w-20" : "w-72"
        )}
      >
        {/* Logo + Toggle */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-gray-200">
          {!collapsed && (
            <span className="text-2xl font-bold text-indigo-600 tracking-tight">
              Client Dashboard
            </span>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded hover:bg-gray-100 transition"
            aria-label="Toggle sidebar"
          >
            {collapsed ? (
              <ChevronRight className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>

        {/* User Info */}


<div
  className={clsx(
    "flex items-center px-6 py-5 border-b border-gray-200 gap-3 relative hover:bg-gray-50 cursor-pointer transition",
    collapsed && "justify-center"
  )}
  onClick={() => navigate("/client-dashboard/profile")}
>
  <img
    src={profileImage}
    alt={user?.displayName || "Client"}
    className={clsx(
      "rounded-full border-2 border-indigo-400 hover:scale-105 hover:shadow-md transition-all",
      collapsed ? "w-8 h-8" : "w-12 h-12"
    )}
  />
  {!collapsed && (
    <div className="flex flex-col">
      <span className="font-semibold text-gray-900">
        {user?.displayName || "Client"}
      </span>
      <span className="text-sm text-gray-500">Client</span>
    </div>
  )}
</div>


        {/* Menu Links */}
        <nav className="flex-1 px-2 py-6 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map(({ name, icon: Icon, path }) => (
              <li key={name}>
                <NavLink
                  to={path}
                  end={path === "/client-dashboard"}
                  className={({ isActive }) =>
                    clsx(
                      "flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all text-gray-700 hover:bg-indigo-50",
                      isActive &&
                        "bg-indigo-100 text-indigo-700 font-semibold border-l-4 border-indigo-500"
                    )
                  }
                  title={collapsed ? name : ""}
                >
                  <Icon className="w-5 h-5" />
                  {!collapsed && name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>





{/* Footer */}
<div className="px-6 py-6 flex flex-col gap-2 border-t border-gray-200 mt-auto">
  {collapsed ? (
    <button
      onClick={() => (window.location.href = "/")}
      className="w-12 h-12 mx-auto rounded-full hover:bg-indigo-100 transition flex items-center justify-center"
      title="Back to Homepage"
    >
      <Home className="w-6 h-6 text-gray-700" />
    </button>
  ) : (
    <button
      onClick={() => (window.location.href = "/")}
      className="w-full px-4 py-3 text-left text-gray-700 rounded-lg hover:bg-indigo-100 transition font-medium flex items-center gap-2"
    >
      <Home className="w-5 h-5 text-gray-700" />
      Back to Homepage
    </button>
  )}
</div>







      </aside>

      {/* Main Content */}
      <main
        className={clsx(
          "flex-1 min-h-screen bg-gray-50 p-6 transition-all duration-300",
          collapsed ? "ml-20" : "ml-72"
        )}
      >
        <Outlet />
      </main>
    </div>
  );
}
