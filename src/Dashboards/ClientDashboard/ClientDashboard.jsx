import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { useApi } from "../../hooks/UseApi";
import useAuth from "../../hooks/UseAuth";
import Loading from "../../Components/Loader/Loader"; // your loader component
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function ClientDashboard() {
  const { get } = useApi();
  const { user } = useAuth();
  const clientEmail = user?.email;

  const [stats, setStats] = useState({
    totalPolicies: 0,
    pendingClaims: 0,
    approvedClaims: 0,
    totalPaid: 0,
  });
  const [monthlyPayments, setMonthlyPayments] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!clientEmail) return;
      setLoading(true);
      try {
        const [statsRes, paymentsRes, policiesRes] = await Promise.all([
          get(`/api/client/${clientEmail}/stats`),
          get(`/api/client/${clientEmail}/monthly-payments`),
          get(`/api/applied-policies?email=${clientEmail}`),
        ]);

        if (statsRes.success) setStats(statsRes.data);
        if (paymentsRes.success) setMonthlyPayments(paymentsRes.data);
        if (policiesRes.success) setPolicies(policiesRes.data);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [clientEmail]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loading size={50} />
      </div>
    );
  }

  const lineData = {
    labels: monthlyPayments.map((m) => m.month),
    datasets: [
      {
        label: "Premium Paid ($)",
        data: monthlyPayments.map((m) => m.paid),
        borderColor: "#4F46E5",
        backgroundColor: "rgba(79,70,229,0.2)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="rounded-2xl p-6 shadow-lg bg-indigo-100">
          <p className="text-sm font-semibold text-indigo-700">
            Total Policies
          </p>
          <p className="mt-2 text-2xl font-bold text-indigo-700">
            {stats.totalPolicies || 0}
          </p>
        </div>
        <div className="rounded-2xl p-6 shadow-lg bg-yellow-100">
          <p className="text-sm font-semibold text-yellow-700">Pending Claims</p>
          <p className="mt-2 text-2xl font-bold text-yellow-700">
            {stats.pendingClaims || 0}
          </p>
        </div>
        <div className="rounded-2xl p-6 shadow-lg bg-green-100">
          <p className="text-sm font-semibold text-green-700">Approved Claims</p>
          <p className="mt-2 text-2xl font-bold text-green-700">
            {stats.approvedClaims || 0}
          </p>
        </div>
        <div className="rounded-2xl p-6 shadow-lg bg-purple-100">
          <p className="text-sm font-semibold text-purple-700">Total Paid</p>
          <p className="mt-2 text-2xl font-bold text-purple-700">
            ${stats.totalPaid || 0}
          </p>
        </div>
      </div>

      {/* Premium Chart */}
      <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 h-72">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Premium Payment Trends
        </h2>
        <Line
          key={monthlyPayments.map((m) => m.month).join("-")}
          data={lineData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                callbacks: {
                  label: (tooltipItem) => `$${tooltipItem.raw}`,
                },
              },
            },
            scales: {
              x: { title: { display: false } },
              y: { beginAtZero: true },
            },
          }}
        />
      </div>

      {/* Policies Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Your Policies</h2>
        <div className="divide-y divide-gray-200">
          {policies.map((policy) => (
            <div
              key={policy._id}
              className="py-3 flex justify-between items-center cursor-pointer hover:bg-gray-50"
              onClick={() => setSelectedPolicy(policy)}
            >
              <div>
                <p className="text-gray-800 font-medium">{policy.name}</p>
                <p className="text-gray-500 text-sm">
                  Coverage: {policy.coverage} | Status: {policy.status}
                </p>
              </div>
              <p
                className={`px-2 py-1 rounded-full text-sm font-medium ${
                  policy.status === "Active"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {policy.status}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Policy Modal */}
      {selectedPolicy && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-96 relative">
            <button
              onClick={() => setSelectedPolicy(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 font-bold"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {selectedPolicy.name}
            </h2>
            <p className="text-gray-600 mb-2">
              Coverage: <span className="font-semibold">{selectedPolicy.coverage}</span>
            </p>
            <p className="text-gray-600">
              Status:{" "}
              <span
                className={`px-2 py-1 rounded-full text-sm font-medium ${
                  selectedPolicy.status === "Active"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {selectedPolicy.status}
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
