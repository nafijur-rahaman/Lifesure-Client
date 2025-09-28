import { useState, useEffect } from "react";
import { useApi } from "../../hooks/UseApi";
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
import Loading from "../../Components/Loader/Loader";

export default function AdminDashboard() {
  const { get } = useApi();
  const [loading, setLoading] = useState(true); // ✅ full-page loader
  const [stats, setStats] = useState({});
  const [policyData, setPolicyData] = useState([]);
  const [paymentData, setPaymentData] = useState([]);
  const COLORS = ["#4F46E5", "#22C55E", "#F97316", "#EC4899"];

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        // 1️⃣ Stats
        const statsRes = await get("/api/admin/stats");
        if (statsRes.success) setStats(statsRes.data);

        // 2️⃣ Policy distribution
        const policiesRes = await get("/api/admin/policy-distribution");
        if (policiesRes.success) setPolicyData(policiesRes.data);

        // 3️⃣ Monthly payments
        const paymentsRes = await get("/api/admin/monthly-payments");
        if (paymentsRes.success) setPaymentData(paymentsRes.data);
      } catch (err) {
        console.error("Admin dashboard fetch error:", err);
      } finally {
        setLoading(false); // ✅ done loading
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loading></Loading>
      </div>
    );
  }

  // Map stats to display cards
  const statsCards = [
    { title: "Total Users", value: stats.totalUsers || 0, icon: Users, color: "bg-indigo-100 text-indigo-700" },
    { title: "Policies", value: stats.totalPolicies || 0, icon: FileText, color: "bg-green-100 text-green-700" },
    { title: "Payments", value: `$${stats.totalPayments || 0}`, icon: DollarSign, color: "bg-yellow-100 text-yellow-700" },
    { title: "Applications", value: stats.totalApplications || 0, icon: ClipboardList, color: "bg-pink-100 text-pink-700" },
  ];

  return (
    <div className="space-y-8 p-8 bg-gray-50 min-h-screen">
      {/* Heading */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-500">Overview of users, policies, and payments</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, i) => {
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
              <Tooltip formatter={(value) => `$${value}`} />
              <Legend />
              <Line type="monotone" dataKey="amount" stroke="#4F46E5" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
