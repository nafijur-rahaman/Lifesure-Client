import { useState, useRef } from "react";
import { NavLink, Outlet } from "react-router";
import {
  Users,
  FileText,
  Edit3,
  CheckCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
  Settings,
} from "lucide-react";
import clsx from "clsx";
import useAuth from "../../hooks/UseAuth";

const navItems = [
  { name: "Dashboard", icon: Users, path: "/agent-dashboard" },
  {
    name: "Assigned Customers",
    icon: Users,
    path: "/agent-dashboard/assigned-customers",
  },
  {
    name: "Manage Blogs",
    icon: FileText,
    path: "/agent-dashboard/manage-blogs",
  },
  {
    name: "Policy Clearance",
    icon: CheckCircle,
    path: "/agent-dashboard/policy-clearance",
  },
];

export default function AgentSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user } = useAuth();

  // Close dropdown when clicking outside
  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target))
      setDropdownOpen(false);
  };
  if (typeof window !== "undefined")
    window.addEventListener("click", handleClickOutside);

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
            <div>
              <h1 className="text-2xl font-bold text-indigo-600 tracking-tight">
                Agent Panel
              </h1>
              <p className="text-sm text-gray-500 mt-1">Insurance Dashboard</p>
            </div>
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

        {/* User Info + Dropdown */}
        <div
          className={clsx(
            "flex items-center px-6 py-5 border-b border-gray-200 gap-3 relative",
            collapsed && "justify-center"
          )}
          ref={dropdownRef}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDropdownOpen(!dropdownOpen);
            }}
            className="flex items-center gap-3 w-full focus:outline-none"
          >
            <img
              src={user?.PhotoURL}
              alt={user?.displayName}
              className="w-12 h-12 rounded-full border-2 border-indigo-400"
            />
            {!collapsed && (
              <div className="flex flex-col">
                <span className="font-semibold text-gray-900">{user?.displayName}</span>
                <span className="text-sm text-gray-500">Agent</span>
              </div>
            )}
          </button>

          {/* Dropdown */}
          {dropdownOpen && !collapsed && (
            <div className="absolute left-0 top-full mt-2 w-52 bg-white border border-gray-200 shadow-lg rounded-md overflow-hidden z-50">
              <NavLink
                to="/agent-dashboard/profile"
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition"
              >
                <User className="w-4 h-4" /> Profile
              </NavLink>
              <button
                onClick={() => console.log("Logout")}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 transition w-full text-left"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          )}
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-2 py-6 overflow-y-auto">
          <ul className="space-y-2">
            {navItems.map(({ name, icon: Icon, path }) => (
              <li key={name}>
                <NavLink
                  to={path}
                  end={path === "/agent-dashboard"}
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
        <div className="px-6 py-6 border-t border-gray-200 flex flex-col gap-2">
          {!collapsed && (
            <>
              <button
                onClick={() => (window.location.href = "/")}
                className="w-full px-4 py-3 text-left text-gray-700 rounded-lg hover:bg-indigo-50 transition font-medium"
              >
                Back to Homepage
              </button>

              <button
                onClick={() => console.log("Logout")}
                className="flex items-center gap-3 text-red-600 font-medium hover:bg-red-50 px-4 py-3 rounded-lg w-full transition"
              >
                <LogOut className="w-5 h-5" /> Logout
              </button>
            </>
          )}

          {collapsed && (
            <button
              onClick={() => console.log("Logout")}
              className="p-2 text-red-600 rounded hover:bg-red-50 transition"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
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
