import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheck, FaTimes } from "react-icons/fa";

// Sample Data
const sampleApplications = [
  { id: 1, name: "John Doe", email: "john@example.com", policy: "Term Life 20Y", date: "2025-09-19", status: "Pending" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", policy: "Senior Plan", date: "2025-09-18", status: "Approved" },
  { id: 3, name: "Ali Khan", email: "ali@example.com", policy: "Family Health", date: "2025-09-17", status: "Rejected" },
];

const agents = ["Agent A", "Agent B", "Agent C"];

// Status Badge Component
function StatusBadge({ status }) {
  const colors =
    status === "Pending"
      ? "bg-yellow-400"
      : status === "Approved"
      ? "bg-green-500"
      : "bg-red-500";

  const animation =
    status === "Pending"
      ? { scale: [1, 1.1, 1], transition: { repeat: Infinity, duration: 1.2 } }
      : status === "Approved"
      ? { rotate: [0, 10, -10, 0], transition: { duration: 0.5 } }
      : { x: [0, -5, 5, -5, 5, 0], transition: { duration: 0.6 } };

  const icon = status === "Approved" ? "✔️" : status === "Rejected" ? "❌" : "";

  return (
    <motion.span
      className={`px-3 py-1 rounded-full text-white text-sm font-semibold flex items-center gap-1`}
      animate={animation}
    >
      {status} {icon}
    </motion.span>
  );
}

export default function PremiumApplicationsTable() {
  const [applications, setApplications] = useState(sampleApplications);
  const [selectedApp, setSelectedApp] = useState(null);
  const [filter, setFilter] = useState("All");

  // Animated counters
  const total = applications.length;
  const pendingCount = applications.filter((a) => a.status === "Pending").length;
  const approvedCount = applications.filter((a) => a.status === "Approved").length;
  const rejectedCount = applications.filter((a) => a.status === "Rejected").length;

  const assignAgent = (appId, agent) => {
    alert(`Assigned ${agent} to application ${appId}`);
  };

  const rejectApplication = (appId) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, status: "Rejected" } : app))
    );
  };

  const filteredApps =
    filter === "All" ? applications : applications.filter((app) => app.status === filter);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Manage Applications</h1>

      {/* Animated Counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { title: "Total", value: total, color: "bg-indigo-500" },
          { title: "Pending", value: pendingCount, color: "bg-yellow-400" },
          { title: "Approved", value: approvedCount, color: "bg-green-500" },
          { title: "Rejected", value: rejectedCount, color: "bg-red-500" },
        ].map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`${card.color} text-white rounded-2xl p-4 shadow-lg flex flex-col items-center justify-center hover:scale-105 transition`}
          >
            <p className="text-sm">{card.title}</p>
            <p className="text-2xl font-bold">{card.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Filter Pills */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {["All", "Pending", "Approved", "Rejected"].map((f) => (
          <button
            key={f}
            className={`px-4 py-2 rounded-full font-medium transition ${
              filter === f
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-700 shadow hover:shadow-lg"
            }`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Applications Table */}
      <div className="overflow-x-auto bg-white rounded-2xl shadow-lg">
        <table className="min-w-full">
          <thead className="bg-indigo-50">
            <tr>
              {["Applicant", "Email", "Policy", "Date", "Status", "Actions"].map((col) => (
                <th key={col} className="px-6 py-3 text-left text-gray-600">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {filteredApps.map((app, i) => (
                <motion.tr
                  key={app.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-3">{app.name}</td>
                  <td className="px-6 py-3">{app.email}</td>
                  <td className="px-6 py-3">{app.policy}</td>
                  <td className="px-6 py-3">{app.date}</td>
                  <td className="px-6 py-3">
                    <StatusBadge status={app.status} />
                  </td>
                  <td className="px-6 py-3 flex gap-2 flex-wrap">
                    <select
                      className="px-2 py-1 border rounded-md text-sm flex-1"
                      onChange={(e) => assignAgent(app.id, e.target.value)}
                    >
                      <option>Assign Agent</option>
                      {agents.map((agent) => (
                        <option key={agent}>{agent}</option>
                      ))}
                    </select>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600 transition"
                      onClick={() => rejectApplication(app.id)}
                    >
                      Reject
                    </button>
                    <button
                      className="bg-indigo-500 text-white px-3 py-1 rounded-md text-sm hover:bg-indigo-600 transition"
                      onClick={() => setSelectedApp(app)}
                    >
                      View
                    </button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedApp && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 w-11/12 max-w-lg shadow-2xl"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <h2 className="text-xl font-bold mb-4">Application Details</h2>
              <p><strong>Name:</strong> {selectedApp.name}</p>
              <p><strong>Email:</strong> {selectedApp.email}</p>
              <p><strong>Policy:</strong> {selectedApp.policy}</p>
              <p><strong>Date:</strong> {selectedApp.date}</p>
              <p><strong>Status:</strong> {selectedApp.status}</p>
              <div className="mt-4 flex justify-end">
                <button
                  className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition"
                  onClick={() => setSelectedApp(null)}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
