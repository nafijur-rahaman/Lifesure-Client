import {
  Users,
  FileText,
  DollarSign,
  ClipboardList,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

export default function AdminDashboard() {
  // Mock Data
  const stats = [
    { title: "Total Users", value: 1240, icon: Users, color: "bg-indigo-100 text-indigo-700" },
    { title: "Policies", value: 342, icon: FileText, color: "bg-green-100 text-green-700" },
    { title: "Payments", value: "$56,320", icon: DollarSign, color: "bg-yellow-100 text-yellow-700" },
    { title: "Applications", value: 87, icon: ClipboardList, color: "bg-pink-100 text-pink-700" },
  ];

  const policyData = [
    { name: "Life", value: 120 },
    { name: "Health", value: 90 },
    { name: "Travel", value: 60 },
    { name: "Retirement", value: 72 },
  ];
  const COLORS = ["#4F46E5", "#22C55E", "#F97316", "#EC4899"];

  const paymentData = [
    { month: "Jan", amount: 4000 },
    { month: "Feb", amount: 3200 },
    { month: "Mar", amount: 5000 },
    { month: "Apr", amount: 4700 },
    { month: "May", amount: 6000 },
    { month: "Jun", amount: 5400 },
  ];

  return (
    <div className="space-y-8">
      {/* Heading */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-500">Overview of users, policies, and payments</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="p-6 rounded-xl shadow-md bg-white flex items-center gap-4 hover:shadow-lg transition"
            >
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <h2 className="text-xl font-bold text-gray-800">{stat.value}</h2>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pie Chart */}
        <div className="p-6 bg-white rounded-xl shadow-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Policy Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={policyData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={110}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name} (${value})`}
              >
                {policyData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart */}
        <div className="p-6 bg-white rounded-xl shadow-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Payments Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={paymentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="amount" stroke="#4F46E5" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
