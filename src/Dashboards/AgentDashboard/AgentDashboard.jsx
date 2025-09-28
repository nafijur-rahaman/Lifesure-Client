import { useState, useEffect } from "react";
import { Users, FileText, CheckCircle } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useApi } from "../../hooks/useApi";
import useAuth from "../../hooks/UseAuth";
import Loading from "../../Components/Loader/Loader";

export default function AgentDashboard() {
  const { get } = useApi();
  const [stats, setStats] = useState({ blogs: 0, customers: 0, policies: 0 });
  const [activityData, setActivityData] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user} = useAuth();

  const agentEmail = user?.email;

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Stats
        const statsRes = await get(`/api/agent/${agentEmail}/stats`);
        if (statsRes.success) {
          setStats({
            blogs: statsRes.data.blogs,
            customers: statsRes.data.customers,
            policies: statsRes.data.policyCleared,
          });
        }

        // Monthly Activity
        const activityRes = await get(`/api/agent/${agentEmail}/monthly-activity`);
        if (activityRes.success) setActivityData(activityRes.data);

        // Recent Activity
        const recentRes = await get(`/api/agent/${agentEmail}/recent-activity`);
        if (recentRes.success) setRecentActivity(recentRes.data);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [agentEmail]);

  if (loading) return <Loading></Loading>;
  // Map activity type to icons/colors
  const activityIcon = (type) => {
    switch (type) {
      case "Blog Posted":
        return <FileText className="w-5 h-5 text-indigo-600" />;
      case "Customer Assigned":
        return <Users className="w-5 h-5 text-green-600" />;
      case "Policy Cleared":
        return <CheckCircle className="w-5 h-5 text-blue-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
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

      {/* Monthly Activity Chart */}
      <div className="bg-white rounded-2xl shadow-xl p-6 mb-10 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Monthly Activity</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={activityData}
            margin={{ top: 20, right: 30, bottom: 20, left: 0 }}
          >
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
              <div className="flex items-center gap-2">
                {activityIcon(item.type)}
                <div>
                  <p className="text-gray-800 font-medium">{item.type}</p>
                  <p className="text-gray-500 text-sm">{item.name}</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                {new Date(item.date).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
