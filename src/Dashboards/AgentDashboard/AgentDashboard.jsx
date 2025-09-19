import { useState } from "react";
import {
  Users,
  FileText,
  CheckCircle,
  Edit3,
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

// Sample data
const stats = {
  blogs: 12,
  customers: 35,
  policies: 20,
};

const activityData = [
  { month: "Jan", blogs: 1, customers: 3, policies: 2 },
  { month: "Feb", blogs: 2, customers: 5, policies: 3 },
  { month: "Mar", blogs: 1, customers: 4, policies: 1 },
  { month: "Apr", blogs: 3, customers: 6, policies: 5 },
  { month: "May", blogs: 2, customers: 7, policies: 4 },
  { month: "Jun", blogs: 3, customers: 5, policies: 3 },
];

const recentActivity = [
  { type: "Blog Posted", name: "How to choose life insurance", date: "2025-09-15" },
  { type: "Customer Assigned", name: "John Doe", date: "2025-09-14" },
  { type: "Policy Cleared", name: "Term Life Insurance", date: "2025-09-13" },
];

export default function AgentDashboard() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen ml-72">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center gap-4 border border-gray-100">
          <FileText className="w-8 h-8 text-indigo-600" />
          <div>
            <p className="text-sm text-gray-500">Total Blogs</p>
            <p className="text-2xl font-bold text-indigo-600">{stats.blogs}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center gap-4 border border-gray-100">
          <Users className="w-8 h-8 text-green-600" />
          <div>
            <p className="text-sm text-gray-500">Assigned Customers</p>
            <p className="text-2xl font-bold text-green-600">{stats.customers}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center gap-4 border border-gray-100">
          <CheckCircle className="w-8 h-8 text-blue-600" />
          <div>
            <p className="text-sm text-gray-500">Policies Cleared</p>
            <p className="text-2xl font-bold text-blue-600">{stats.policies}</p>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-2xl shadow-xl p-6 mb-10 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Monthly Activity</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={activityData} margin={{ top: 20, right: 30, bottom: 20, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="blogs" stroke="#6366f1" strokeWidth={2} />
            <Line type="monotone" dataKey="customers" stroke="#16a34a" strokeWidth={2} />
            <Line type="monotone" dataKey="policies" stroke="#2563eb" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Recent Activity</h2>
        <div className="divide-y divide-gray-200">
          {recentActivity.map((item, idx) => (
            <div key={idx} className="py-3 flex justify-between items-center">
              <div>
                <p className="text-gray-800 font-medium">{item.type}</p>
                <p className="text-gray-500 text-sm">{item.name}</p>
              </div>
              <p className="text-gray-400 text-sm">{item.date}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
