import { useState, useRef } from "react";
import { NavLink, Outlet } from "react-router";
import {
  LayoutDashboard,
  Users,
  FileText,
  DollarSign,
  ClipboardList,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
  Settings,
} from "lucide-react";
import clsx from "clsx";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/admin-dashboard" },
  { name: "Manage Users", icon: Users, path: "/admin-dashboard/manage-users" },
  { name: "Manage Applications", icon: ClipboardList, path: "/admin-dashboard/manage-applications" },
  { name: "Manage Policies", icon: FileText, path: "/admin-dashboard/manage-policies" },
  { name: "Manage Payments", icon: DollarSign, path: "/admin-dashboard/manage-payments" },
];

export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const user = { name: "Nafi", role: "Super Admin", avatar: "https://i.pravatar.cc/40?img=5" };

  // Close dropdown if clicked outside
  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setDropdownOpen(false);
    }
  };
  if (typeof window !== "undefined") {
    window.addEventListener("click", handleClickOutside);
  }

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
          {!collapsed && <span className="text-2xl font-bold text-indigo-600 tracking-tight">AdminPanel</span>}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded hover:bg-gray-100 transition"
            aria-label="Toggle sidebar"
          >
            {collapsed ? <ChevronRight className="w-5 h-5 text-gray-600" /> : <ChevronLeft className="w-5 h-5 text-gray-600" />}
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
            <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full border-2 border-indigo-400" />
            {!collapsed && (
              <div className="flex flex-col">
                <span className="font-semibold text-gray-900">{user.name}</span>
                <span className="text-sm text-gray-500">{user.role}</span>
              </div>
            )}
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && !collapsed && (
            <div className="absolute left-0 top-full mt-2 w-52 bg-white border border-gray-200 shadow-lg rounded-md overflow-hidden z-50">
              <NavLink
                to="/admin-dashboard/profile"
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

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto mt-4 px-2">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.name}>
                  <NavLink
                    to={item.path}
                    end={item.path === "/admin-dashboard"}
                    className={({ isActive }) =>
                      clsx(
                        "flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all text-gray-700 hover:bg-indigo-50",
                        isActive && "bg-indigo-100 text-indigo-700 font-semibold border-l-4 border-indigo-500"
                      )
                    }
                    title={collapsed ? item.name : ""}
                  >
                    <Icon className="w-5 h-5" />
                    {!collapsed && item.name}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="px-6 py-6 mt-auto flex flex-col gap-2">
          {!collapsed ? (
            <button
              onClick={() => (window.location.href = "/")}
              className="w-full px-3 py-2 text-left text-gray-700 rounded-lg hover:bg-indigo-50 transition font-medium"
            >
              Back to Homepage
            </button>
          ) : null}

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

        {!collapsed && (
          <div className="px-6 py-2 border-t border-gray-200">
            <span className="text-gray-500 text-sm">© 2025 LifeSure</span>
          </div>
        )}
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
