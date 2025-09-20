import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";

const policies = [
  { id: 1, name: "Term Life Insurance", status: "Approved", claimStatus: null },
  { id: 2, name: "Senior Plan", status: "Approved", claimStatus: "Pending" },
  { id: 3, name: "Health + Life Combo", status: "Rejected", claimStatus: null },
];

export default function ClaimRequestPage() {
  const [claimPolicy, setClaimPolicy] = useState(null);
  const [reason, setReason] = useState("");
  const [file, setFile] = useState(null);

  const handleClaimSubmit = () => {
    console.log("Claim submitted:", { policy: claimPolicy, reason, file, status: "Pending" });
    setClaimPolicy(null);
    setReason("");
    setFile(null);
    Swal.fire({
      icon: "success",
      title: "Claim Submitted!",
      text: "Your claim has been submitted successfully and is pending approval.",
    });
  };

  const handleApprovedClick = (policy) => {
    Swal.fire({
      icon: "success",
      title: "Claim Approved ✅",
      text: `${policy.name} claim has been approved!`,
    });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">📄 Claim Requests</h2>
      <div className="bg-white shadow-xl rounded-xl overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-gray-50 text-gray-700 text-sm font-semibold">
            <tr>
              {["Policy Name", "Claim Status", "Action"].map((col) => (
                <th key={col} className="p-4 text-left">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {policies
              .filter((p) => p.status === "Approved")
              .map((policy) => (
                <motion.tr
                  key={policy.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-4 font-medium text-gray-800">{policy.name}</td>
                  <td className="p-4">
                    {policy.claimStatus ? (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                        {policy.claimStatus}
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        None
                      </span>
                    )}
                  </td>
                  <td className="p-4 flex gap-2">
                    {!policy.claimStatus && (
                      <button
                        onClick={() => setClaimPolicy(policy)}
                        className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg hover:bg-indigo-700 transition text-sm"
                      >
                        Claim
                      </button>
                    )}
                    {policy.claimStatus === "Approved" && (
                      <button
                        onClick={() => handleApprovedClick(policy)}
                        className="bg-green-600 text-white px-4 py-1.5 rounded-lg hover:bg-green-700 transition text-sm"
                      >
                        Approved
                      </button>
                    )}
                  </td>
                </motion.tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Claim Modal */}
      <AnimatePresence>
        {claimPolicy && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <button
                onClick={() => setClaimPolicy(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 font-bold"
              >
                ×
              </button>
              <h3 className="text-xl font-bold mb-4 text-gray-800">
                Claim: {claimPolicy.name}
              </h3>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2 font-medium">Reason for Claim</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Enter reason for claim..."
                  className="w-full border rounded-lg p-3 text-gray-700 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2 font-medium">Upload Document</label>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="w-full text-gray-700"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setClaimPolicy(null)}
                  className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClaimSubmit}
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Submit Claim
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
