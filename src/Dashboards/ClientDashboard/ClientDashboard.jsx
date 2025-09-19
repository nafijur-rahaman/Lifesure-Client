import { useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Sample Data
const stats = [
  { title: "Total Policies", value: 4, color: "bg-indigo-100", textColor: "text-indigo-700" },
  { title: "Pending Claims", value: 1, color: "bg-yellow-100", textColor: "text-yellow-700" },
  { title: "Approved Claims", value: 3, color: "bg-green-100", textColor: "text-green-700" },
  { title: "Total Paid", value: "$25,000", color: "bg-purple-100", textColor: "text-purple-700" },
];

const policies = [
  { id: 1, name: "Term Life Plan", coverage: "1,500,000", status: "Active" },
  { id: 2, name: "Senior Plan", coverage: "500,000", status: "Active" },
];

export default function ClientDashboard() {
  const [selectedPolicy, setSelectedPolicy] = useState(null);

  const lineData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Premium Paid ($)",
        data: [200, 400, 300, 500, 450, 600],
        borderColor: "#4F46E5",
        backgroundColor: "rgba(79,70,229,0.2)",
        tension: 0.3,
      },
    ],
  };

  const lineOptions = { responsive: true, plugins: { legend: { display: false } } };

  return (
    <div className="p-8  bg-gray-50 min-h-screen">
      {/* Welcome Header */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Welcome, John Doe</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.title} className={`rounded-2xl p-6 shadow-lg ${stat.color}`}>
            <p className={`text-sm font-semibold ${stat.textColor}`}>{stat.title}</p>
            <p className={`mt-2 text-2xl font-bold ${stat.textColor}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Premium Payment Trends</h2>
        <Line data={lineData} options={lineOptions} />
      </div>

      {/* Policies Section */}
      <h2 className="text-xl font-bold text-gray-800 mb-4">Your Policies</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {policies.map((policy) => (
          <div
            key={policy.id}
            className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition cursor-pointer"
            onClick={() => setSelectedPolicy(policy)}
          >
            <h3 className="text-lg font-bold text-gray-800 mb-2">{policy.name}</h3>
            <p className="text-gray-600 mb-1">
              Coverage: <span className="font-semibold">{policy.coverage}</span>
            </p>
            <p
              className={`px-2 py-1 inline-block rounded-full text-sm font-medium ${
                policy.status === "Active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {policy.status}
            </p>
          </div>
        ))}
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
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{selectedPolicy.name}</h2>
            <p className="text-gray-600 mb-2">
              Coverage: <span className="font-semibold">{selectedPolicy.coverage}</span>
            </p>
            <p className="text-gray-600">
              Status:{" "}
              <span
                className={`px-2 py-1 rounded-full text-sm font-medium ${
                  selectedPolicy.status === "Active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
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
