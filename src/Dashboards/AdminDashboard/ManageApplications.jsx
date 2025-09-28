import { useEffect, useState } from "react";
import { X, Eye } from "lucide-react";
import { useApi } from "../../hooks/UseApi";
import Swal from "sweetalert2";
import Loading from "../../Components/Loader/Loader";

export default function ManageApplications() {
  const { get, patch } = useApi();
  const [applications, setApplications] = useState([]);
  const [agents, setAgents] = useState([]);
  const [assignedAgents, setAssignedAgents] = useState({});
  const [selectedApp, setSelectedApp] = useState(null);
  const [filterStatus, setFilterStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch all applications
  const fetchApplications = async () => {
    setLoading(true);
    const res = await get("/api/applications");
    if (res?.success) {
      setApplications(res.data);

      const initialAssigned = {};
      res.data.forEach((app) => {
        if (app.agent) initialAssigned[app._id] = app.agent;
      });
      setAssignedAgents(initialAssigned);
    }
    setLoading(false);
  };

  // Fetch agents
  const fetchAgents = async () => {
    const res = await get("/api/get-agent-users");
    if (res?.success) setAgents(res.data);
  };

  useEffect(() => {
    fetchApplications();
    fetchAgents();
  }, []);

  // Assign agent by ID
  const assignAgent = async (appId, agentEmail) => {
    await patch(`/api/application/${appId}/assign-agent`, { agent: agentEmail });
    setAssignedAgents((prev) => ({ ...prev, [appId]: agentEmail }));
    fetchApplications();
  };

  // Reject application
  const rejectApplication = async (appId) => {
    await patch(`/api/agent/application/${appId}/status`, { status: "Rejected" });
    fetchApplications();
  };

  // Filtered applications
  const filteredApplications = applications.filter((app) => {
    return (
      (!filterStatus || app.status === filterStatus) &&
      (app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.email.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header and filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          Manage Applications
        </h2>
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

      {/* Applications table */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-2xl border border-gray-100">
        {loading ? (
          <div className="p-6">
            <Loading /> {/* ✅ table loader */}
          </div>
        ) : (
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
              {filteredApplications.length > 0 ? (
                filteredApplications.map((app) => (
                  <tr
                    key={app._id}
                    className="border-b last:border-b-0 hover:bg-indigo-50 transition"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">{app.name}</td>
                    <td className="px-6 py-4">{app.email}</td>
                    <td className="px-6 py-4">{app.policyInfo?.title || "—"}</td>
                    <td className="px-6 py-4">{new Date(app.createdAt).toLocaleDateString()}</td>
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
                      {/* Assign agent */}
                      {app.status === "Pending" && (
                        <select
                          onChange={(e) => assignAgent(app._id, e.target.value)}
                          className="px-2 py-1 border rounded-lg text-sm"
                          value={assignedAgents[app._id] || ""}
                        >
                          <option value="" disabled>
                            Assign Agent
                          </option>
                          {agents.map((a) => (
                            <option key={a._id} value={a.email}>
                              {a.name}
                            </option>
                          ))}
                        </select>
                      )}
                      {/* Reject */}
                      {app.status === "Pending" && (
                        <button
                          onClick={() => rejectApplication(app._id)}
                          className="bg-red-100 text-red-700 px-2 py-1 rounded-lg hover:bg-red-200 transition"
                        >
                          <X className="w-4 h-4 inline" />
                        </button>
                      )}
                      {/* View details */}
                      <button
                        onClick={() => setSelectedApp(app)}
                        className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-lg hover:bg-indigo-200 transition"
                      >
                        <Eye className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-6 text-center text-gray-500">
                    No applications found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
            <h3 className="text-xl font-bold mb-4">
              {selectedApp.name}'s Application
            </h3>
            <p>
              <span className="font-semibold">Email:</span> {selectedApp.email}
            </p>
            <p>
              <span className="font-semibold">Policy:</span> {selectedApp.policyInfo?.title}
            </p>
            <p>
              <span className="font-semibold">Date:</span>{" "}
              {new Date(selectedApp.createdAt).toLocaleDateString()}
            </p>
            <p>
              <span className="font-semibold">Status:</span> {selectedApp.status}
            </p>
            {selectedApp.agent && (
              <p>
                <span className="font-semibold">Assigned Agent:</span> {selectedApp.agent}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
