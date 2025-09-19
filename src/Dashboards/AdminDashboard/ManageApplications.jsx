import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const sampleApplications = [
  { id: 1, name: "John Doe", email: "john@example.com", policy: "Term Life 20Y", date: "2025-09-19", status: "Pending" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", policy: "Senior Plan", date: "2025-09-17", status: "Approved" },
  { id: 3, name: "Bob Johnson", email: "bob@example.com", policy: "Term Life 10Y", date: "2025-09-16", status: "Rejected" },
];

const agents = ["Agent A", "Agent B", "Agent C"];

export default function ManageApplications() {
  const [applications, setApplications] = useState(sampleApplications);
  const [selectedApp, setSelectedApp] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const assignAgent = (appId, agentName) => {
    setApplications(prev => prev.map(app => app.id === appId ? { ...app, agent: agentName, status: "Approved" } : app));
  };

  const rejectApplication = (appId) => {
    setApplications(prev => prev.map(app => app.id === appId ? { ...app, status: "Rejected" } : app));
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-900">Manage Applications</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-lg rounded-xl overflow-hidden">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="py-3 px-4 text-left">Applicant Name</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Policy</th>
              <th className="py-3 px-4 text-left">Date</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map(app => (
              <motion.tr key={app.id} whileHover={{ scale:1.02 }} transition={{ duration:0.2 }} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">{app.name}</td>
                <td className="py-3 px-4">{app.email}</td>
                <td className="py-3 px-4">{app.policy}</td>
                <td className="py-3 px-4">{app.date}</td>
                <td className="py-3 px-4">
                  <span className={`px-3 py-1 rounded-full text-white font-semibold ${app.status==="Pending" ? "bg-yellow-500" : app.status==="Approved" ? "bg-green-500" : "bg-red-500"}`}>
                    {app.status}
                  </span>
                </td>
                <td className="py-3 px-4 space-x-2 flex items-center">
                  {app.status==="Pending" && (
                    <select onChange={(e)=>assignAgent(app.id, e.target.value)} className="px-2 py-1 border rounded-lg">
                      <option value="">Assign Agent</option>
                      {agents.map(agent => <option key={agent} value={agent}>{agent}</option>)}
                    </select>
                  )}
                  {app.status==="Pending" && (
                    <button onClick={()=>rejectApplication(app.id)} className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">Reject</button>
                  )}
                  <button onClick={()=>{ setSelectedApp(app); setModalOpen(true); }} className="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">View Details</button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && selectedApp && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div initial={{ scale:0.8 }} animate={{ scale:1 }} exit={{ scale:0.8 }} className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl">
              <h3 className="text-2xl font-bold mb-4">{selectedApp.name}'s Application</h3>
              <p><strong>Email:</strong> {selectedApp.email}</p>
              <p><strong>Policy:</strong> {selectedApp.policy}</p>
              <p><strong>Date:</strong> {selectedApp.date}</p>
              <p><strong>Status:</strong> {selectedApp.status}</p>
              <p><strong>Assigned Agent:</strong> {selectedApp.agent || "Not Assigned"}</p>
              <button onClick={()=>setModalOpen(false)} className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition">Close</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
