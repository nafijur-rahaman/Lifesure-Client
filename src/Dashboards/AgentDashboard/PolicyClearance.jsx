import { useState, useEffect } from "react";
import { Eye, CheckCircle, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import { useApi } from "../../hooks/UseApi";

export default function PolicyClearance() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalClaim, setModalClaim] = useState(null);

  const { get, patch } = useApi();

  // Fetch all claims on load
  useEffect(() => {
    const fetchClaims = async () => {
      setLoading(true);
      const res = await get("/api/get-all-claims");
      if (res?.success) {
        setClaims(res.data);
      }
      setLoading(false);
    };

    fetchClaims();
  }, []);

  const handleClaimAction = async (claimId, action) => {
    const actionText = action === "Approved" ? "Approve" : "Reject";

    const confirm = await Swal.fire({
      title: `${actionText} this claim?`,
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Yes, ${actionText}`,
    });

    if (confirm.isConfirmed) {
      try {
        await patch(`/api/claim-approve/${claimId}`, { status: action });

        // Update local state
        setClaims((prev) =>
          prev.map((c) =>
            c._id === claimId ? { ...c, status: action } : c
          )
        );

        Swal.fire({
          icon: "success",
          title: `Claim ${action} ✅`,
          text: `Claim has been ${action.toLowerCase()}.`,
        });
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: "Something went wrong. Try again later.",
        });
      }
    }
  };

  if (loading) return <div className="p-6">Loading claims...</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen ml-72">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Policy Clearance</h1>

      <div className="overflow-x-auto bg-white rounded-2xl shadow-xl border border-gray-100">
        <table className="min-w-full table-auto">
          <thead className="bg-indigo-50">
            <tr>
              {["Policy ID", "Customer Email", "Status", "Applied On", "Actions"].map((col) => (
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
              {claims.map((claim, i) => (
                <motion.tr
                  key={claim._id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4 font-medium text-gray-800">{claim.policy_id}</td>
                  <td className="px-6 py-4 text-gray-700">{claim.customerEmail}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        claim.status === "Approved"
                          ? "bg-green-100 text-green-700"
                          : claim.status === "Rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {claim.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">{new Date(claim.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 flex gap-2">
                    <button
                      onClick={() => setModalClaim(claim)}
                      className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-lg hover:bg-indigo-200 transition flex items-center gap-1"
                    >
                      <Eye className="w-4 h-4" /> View Details
                    </button>
                    {claim.status === "Pending" && (
                      <>
                        <button
                          onClick={() => handleClaimAction(claim._id, "Approved")}
                          className="bg-green-100 text-green-700 px-3 py-1 rounded-lg hover:bg-green-200 transition flex items-center gap-1"
                        >
                          <CheckCircle className="w-4 h-4" /> Approve
                        </button>
                        <button
                          onClick={() => handleClaimAction(claim._id, "Rejected")}
                          className="bg-red-100 text-red-700 px-3 py-1 rounded-lg hover:bg-red-200 transition flex items-center gap-1"
                        >
                          <XCircle className="w-4 h-4" /> Reject
                        </button>
                      </>
                    )}
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
        {claims.length === 0 && (
          <div className="text-center py-6 text-gray-500 font-medium">
            No claims found.
          </div>
        )}
      </div>

      {/* Claim Details Modal */}
      <AnimatePresence>
        {modalClaim && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/30 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl p-6 w-96 relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <button
                onClick={() => setModalClaim(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 font-bold"
              >
                ×
              </button>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Claim Details</h2>
              <p className="text-gray-600 mb-2"><strong>Policy ID:</strong> {modalClaim.policy_id}</p>
              <p className="text-gray-600 mb-2"><strong>Customer Email:</strong> {modalClaim.customerEmail}</p>
              <p className="text-gray-600 mb-2"><strong>Reason:</strong> {modalClaim.reason}</p>
              <p className="text-gray-600"><strong>Status:</strong> {modalClaim.status}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
