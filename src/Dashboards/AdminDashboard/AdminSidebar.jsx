import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUsers,
  FaFileAlt,
  FaDollarSign,
  FaClipboardList,
  FaBell,
} from "react-icons/fa";
import { NavLink,Outlet } from "react-router";


export default function AdminSidebar() {


  const sidebarLinks = [
    { name: "Dashboard", icon: <FaUsers />, path: "/admin-dashboard/dashboard" },
    {
      name: "Applications",
      icon: <FaClipboardList />,
      path: "/admin-dashboard/manage-applications",
      badge: 24,
    },
    { name: "Users", icon: <FaDollarSign />, path: "/admin-dashboard/manage-users" },
    { name: "Policies", icon: <FaFileAlt />, path: "/admin-dashboard/manage-policies" },
  ];

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-indigo-700 to-indigo-900 text-white flex flex-col shadow-lg sticky top-0 h-screen flex-shrink-0">
        <div className="flex items-center justify-center px-4 py-5 border-b border-indigo-500">
          <span className="text-xl font-bold tracking-wide">Admin Panel</span>
        </div>

        <nav className="flex-1 mt-6">
          {sidebarLinks.map((link, i) => (
            <NavLink
              to={link.path}
              key={i}
              className={({ isActive }) =>
                `flex items-center justify-between gap-4 px-4 py-3 rounded-r-xl transition-colors duration-300 ${
                  isActive ? "bg-indigo-600" : "hover:bg-indigo-600"
                }`
              }
            >
              <div className="flex items-center gap-4">
                {link.icon}
                <span className="font-medium">{link.name}</span>
              </div>
              {link.badge > 0 && (
                <span className="bg-yellow-400 text-black text-xs px-2 py-0.5 rounded-full font-semibold">
                  {link.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="px-4 py-6 border-t border-indigo-500 flex items-center gap-3">
          <img
            src="https://i.pravatar.cc/40"
            alt="Admin"
            className="rounded-full w-10 h-10"
          />
          <div className="flex flex-col">
            <span className="font-semibold">Admin</span>
            <span className="text-sm text-gray-200">Super Admin</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative">
        <Outlet></Outlet>
      </div>
    </div>
  );
}
