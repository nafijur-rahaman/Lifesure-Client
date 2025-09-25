import { useState, useMemo } from "react";
import { X, Check, UserCheck, Eye } from "lucide-react";

const sampleApplications = [
  { id: 1, name: "John Doe", email: "john@example.com", policy: "Life Protect Plan", date: "2025-09-25", status: "Pending" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", policy: "Health Secure", date: "2025-09-23", status: "Approved" },
  { id: 3, name: "Mark Johnson", email: "mark@example.com", policy: "Family Shield", date: "2025-09-20", status: "Pending" },
  { id: 4, name: "Emma Watson", email: "emma@example.com", policy: "Retirement Plus", date: "2025-09-22", status: "Rejected" },
];

const agents = ["Agent Nafi", "Agent Lisa", "Agent Tom"];

export default function ManageApplications() {
  const [applications, setApplications] = useState(sampleApplications);
  const [filterStatus, setFilterStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedApp, setSelectedApp] = useState(null);

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      return (
        (!filterStatus || app.status === filterStatus) &&
        (app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.email.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    });
  }, [applications, filterStatus, searchQuery]);

  const assignAgent = (appId, agentName) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, status: "Approved", assignedAgent: agentName } : app))
    );
  };

  const rejectApplication = (appId) => {
    setApplications((prev) => prev.map((app) => (app.id === appId ? { ...app, status: "Rejected" } : app)));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">Manage Applications</h2>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Applications Table */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-2xl border border-gray-100">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
            <tr>
              <th className="px-6 py-3">Applicant Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Policy Name</th>
              <th className="px-6 py-3">Application Date</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredApplications.map((app) => (
              <tr key={app.id} className="border-b last:border-b-0 hover:bg-indigo-50 transition">
                <td className="px-6 py-4 font-medium text-gray-900">{app.name}</td>
                <td className="px-6 py-4">{app.email}</td>
                <td className="px-6 py-4">{app.policy}</td>
                <td className="px-6 py-4">{app.date}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      app.status === "Approved"
                        ? "bg-green-100 text-green-700"
                        : app.status === "Rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {app.status}
                  </span>
                </td>
                <td className="px-6 py-4 flex justify-center gap-2">
                  {/* Assign Agent */}
                  {app.status === "Pending" && (
                    <select
                      onChange={(e) => assignAgent(app.id, e.target.value)}
                      className="px-2 py-1 border rounded-lg text-sm"
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Assign Agent
                      </option>
                      {agents.map((a) => (
                        <option key={a} value={a}>
                          {a}
                        </option>
                      ))}
                    </select>
                  )}
                  {/* Reject */}
                  {app.status === "Pending" && (
                    <button
                      onClick={() => rejectApplication(app.id)}
                      className="bg-red-100 text-red-700 px-2 py-1 rounded-lg hover:bg-red-200 transition"
                    >
                      <X className="w-4 h-4 inline" />
                    </button>
                  )}
                  {/* View Details */}
                  <button
                    onClick={() => setSelectedApp(app)}
                    className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-lg hover:bg-indigo-200 transition"
                  >
                    <Eye className="w-4 h-4 inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredApplications.length === 0 && (
          <div className="text-center py-6 text-gray-500 font-medium">No applications found.</div>
        )}
      </div>

      {/* Modal */}
      {selectedApp && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-96 relative">
            <button
              onClick={() => setSelectedApp(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold mb-4">{selectedApp.name}'s Application</h3>
            <p>
              <span className="font-semibold">Email:</span> {selectedApp.email}
            </p>
            <p>
              <span className="font-semibold">Policy:</span> {selectedApp.policy}
            </p>
            <p>
              <span className="font-semibold">Date:</span> {selectedApp.date}
            </p>
            <p>
              <span className="font-semibold">Status:</span>{" "}
              {selectedApp.status}
            </p>
            {selectedApp.assignedAgent && (
              <p>
                <span className="font-semibold">Assigned Agent:</span>{" "}
                {selectedApp.assignedAgent}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
