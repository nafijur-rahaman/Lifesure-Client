import { Users, FileText, Edit3, CheckCircle, LogOut } from "lucide-react";
import { NavLink, Outlet } from "react-router"; 

const navItems = [
    { name: "Dashboard", icon: Users, path: "/agent-dashboard/agent-dashboard" },
  { name: "Assigned Customers", icon: Users, path: "/agent-dashboard/assigned-customers" },
  { name: "Manage Blogs", icon: FileText, path: "/agent-dashboard/manage-blogs" },
  { name: "Create New Blog Post", icon: Edit3, path: "/agent-dashboard/create-blog" },
  { name: "Policy Clearance", icon: CheckCircle, path: "/agent-dashboard/policy-clearance" },
];

export default function AgentSidebar() {
  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="w-72 h-screen bg-white shadow-xl border-r border-gray-100 fixed left-0 top-0 flex flex-col">
        {/* Brand / Logo */}
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-2xl font-bold text-indigo-600 tracking-tight">
            Agent Panel
          </h1>
          <p className="text-sm text-gray-500 mt-1">Insurance Dashboard</p>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map(({ name, icon: Icon, path }) => (
            <NavLink
              key={name}
              to={path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                  isActive
                    ? "bg-indigo-50 text-indigo-600 shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-indigo-600"
                }`
              }
            >
              <Icon className="w-5 h-5" />
              {name}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-6 border-t border-gray-100">
          <button className="flex items-center gap-3 text-red-600 font-medium hover:bg-red-50 px-4 py-3 rounded-xl w-full transition">
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-50 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
