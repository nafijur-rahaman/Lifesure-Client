import { useState } from "react";
import { Eye, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Sample policy claims
const samplePolicies = [
  {
    id: 1,
    policyName: "Term Life Plan",
    amount: "1,500,000",
    customer: "John Doe",
    status: "Pending",
    details: "Full coverage for 20 years. Claim reason: Life Insurance Payout.",
  },
  {
    id: 2,
    policyName: "Senior Plan",
    amount: "500,000",
    customer: "Jane Smith",
    status: "Pending",
    details: "Coverage for senior citizens. Claim reason: Medical Emergency.",
  },
];

export default function PolicyClearance() {
  const [policies, setPolicies] = useState(samplePolicies);
  const [modalPolicy, setModalPolicy] = useState(null);

  const handleApprove = (id) => {
    setPolicies((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: "Approved" } : p
      )
    );
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen ml-72">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Policy Clearance</h1>

      <div className="overflow-x-auto bg-white rounded-2xl shadow-xl border border-gray-100">
        <table className="min-w-full table-auto">
          <thead className="bg-indigo-50">
            <tr>
              {["Policy Name", "Amount", "Customer", "Status", "Actions"].map((col) => (
                <th
                  key={col}
                  className="px-6 py-4 text-left text-gray-600 font-semibold text-sm uppercase tracking-wide"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {policies.map((policy, i) => (
                <motion.tr
                  key={policy.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4 font-medium text-gray-800">{policy.policyName}</td>
                  <td className="px-6 py-4 text-gray-600">{policy.amount}</td>
                  <td className="px-6 py-4 text-gray-700">{policy.customer}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        policy.status === "Approved"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {policy.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button
                      onClick={() => setModalPolicy(policy)}
                      className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-lg hover:bg-indigo-200 transition flex items-center gap-1"
                    >
                      <Eye className="w-4 h-4" /> View Details
                    </button>
                    {policy.status === "Pending" && (
                      <button
                        onClick={() => handleApprove(policy.id)}
                        className="bg-green-100 text-green-700 px-3 py-1 rounded-lg hover:bg-green-200 transition flex items-center gap-1"
                      >
                        <CheckCircle className="w-4 h-4" /> Approve
                      </button>
                    )}
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Policy Modal */}
      {modalPolicy && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-96 relative">
            <button
              onClick={() => setModalPolicy(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 font-bold"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{modalPolicy.policyName}</h2>
            <p className="text-gray-600 mb-2">
              <span className="font-semibold">Customer:</span> {modalPolicy.customer}
            </p>
            <p className="text-gray-600 mb-2">
              <span className="font-semibold">Amount:</span> {modalPolicy.amount}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Details:</span> {modalPolicy.details}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
