import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUsers,
  FaFileAlt,
  FaDollarSign,
  FaClipboardList,
  FaBell,
} from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { NavLink, Outlet } from "react-router";

const sampleData = [
  { month: "Jan", policies: 400 },
  { month: "Feb", policies: 300 },
  { month: "Mar", policies: 500 },
  { month: "Apr", policies: 450 },
  { month: "May", policies: 600 },
];

const Dashboard = () => {
  const [showNotifications, setShowNotifications] = useState(false);

  const cards = [
    {
      title: "Total Users",
      value: 1245,
      icon: <FaUsers />,
      colorFrom: "from-blue-500",
      colorTo: "to-indigo-600",
    },
    {
      title: "Active Policies",
      value: 987,
      icon: <FaFileAlt />,
      colorFrom: "from-purple-500",
      colorTo: "to-pink-500",
    },
    {
      title: "Pending Applications",
      value: 24,
      icon: <FaClipboardList />,
      colorFrom: "from-yellow-400",
      colorTo: "to-orange-500",
    },
    {
      title: "Total Revenue",
      value: "$1.2M",
      icon: <FaDollarSign />,
      colorFrom: "from-green-400",
      colorTo: "to-teal-500",
    },
  ];
  return (
    <div>
      {/* Main Content */}
      <div className="flex-1 flex flex-col relative">
        {/* Top Bar */}
        <div className="flex justify-between items-center px-6 py-4 bg-white shadow-md sticky top-0 z-20">
          <input
            type="text"
            placeholder="Search..."
            className="px-4 py-2 border rounded-md w-1/3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="flex items-center gap-4 relative">
            <FaBell
              className="text-gray-600 text-xl cursor-pointer relative"
              onClick={() => setShowNotifications(!showNotifications)}
            />
            <img
              src="https://i.pravatar.cc/40"
              alt="admin"
              className="rounded-full w-10 h-10"
            />
          </div>
        </div>

        {/* Notification Panel */}
        <AnimatePresence>
          {showNotifications && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute right-6 top-16 w-80 bg-white rounded-2xl shadow-lg p-4 z-30"
            >
              <h3 className="font-bold text-gray-700 mb-2">Notifications</h3>
              <div className="divide-y divide-gray-200">
                <div className="py-2 text-sm">
                  New application submitted by John Doe
                </div>
                <div className="py-2 text-sm">
                  Policy renewal due for Jane Smith
                </div>
                <div className="py-2 text-sm">
                  Revenue goal achieved this month!
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 15px 30px rgba(0,0,0,0.2)",
              }}
              className={`p-6 rounded-2xl flex items-center gap-4 text-white bg-gradient-to-r ${card.colorFrom} ${card.colorTo} shadow-lg transform transition`}
            >
              <div className="text-3xl">{card.icon}</div>
              <div>
                <p className="text-sm">{card.title}</p>
                <p className="text-2xl font-bold">{card.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <h2 className="text-xl font-bold mb-4">Monthly Policies</h2>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={sampleData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="policies"
                  stroke="#4f46e5"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <h2 className="text-xl font-bold mb-4">Revenue (Placeholder)</h2>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={sampleData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="policies"
                  stroke="#10b981"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
