import { Home, FileText, User, CreditCard, Bell } from "lucide-react";
import { NavLink, Outlet } from "react-router";

const menuItems = [
  { name: "Dashboard", icon: Home, path: "/client-dashboard/client-dashboard" },
  { name: "My Policies", icon: FileText, path: "/customer/policies" },
  { name: "My Profile", icon: User, path: "/customer/profile" },
  { name: "Payments", icon: CreditCard, path: "/customer/payments" },
  { name: "Notifications", icon: Bell, path: "/customer/notifications" },
];

export default function ClientSidebar() {
  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-full w-72 bg-white border-r border-gray-200 shadow-lg flex flex-col">
        {/* Logo / Brand */}
        <div className="px-6 py-6 flex items-center justify-center border-b border-gray-200">
          <span className="text-2xl font-bold text-indigo-600">InsurePro</span>
        </div>

        {/* Menu */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.name}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 font-medium hover:bg-indigo-50 hover:text-indigo-700 transition ${
                        isActive ? "bg-indigo-100 text-indigo-700" : ""
                      }`
                    }
                  >
                    <Icon className="w-5 h-5" />
                    {item.name}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer / Logout */}
        <div className="px-6 py-6 border-t border-gray-200">
          <button className="w-full bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition">
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-72 p-6 bg-gray-50 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
