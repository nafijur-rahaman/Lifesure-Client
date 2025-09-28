import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import axios from "axios";
import { useApi } from "../../hooks/UseApi";
import useAuth from "../../hooks/UseAuth";
import Loading from "../../Components/Loader/Loader"; // your loader component

export default function ClaimRequestPage() {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [claimPolicy, setClaimPolicy] = useState(null);
  const [reason, setReason] = useState("");
  const [file, setFile] = useState(null);

  const { user } = useAuth();
  const { get, post } = useApi();

  // Fetch approved policies and claim status
  useEffect(() => {
    if (!user?.email) return;

    const fetchPolicies = async () => {
      setLoading(true);
      try {
        const res = await get(`/api/customer/payments?email=${user.email}`);
        if (res?.success) {
          const policiesWithClaims = await Promise.all(
            res.data.map(async (p) => {
              try {
                const claimRes = await get(`/api/claim-by-policy/${p.policy_id}`);
                return { ...p, claimStatus: claimRes.data.status };
              } catch (err) {
                return { ...p, claimStatus: null }; // No claim or error
              }
            })
          );
          setPolicies(policiesWithClaims);
        }
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to fetch policies.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchPolicies();
  }, [user?.email]);

  // Upload file to ImgBB
  const uploadFile = async (file) => {
    if (!file) return "";
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMAGE_BB_KEY}`,
        formData
      );
      return res?.data?.data?.url || "";
    } catch (err) {
      Swal.fire("Upload Failed", "Could not upload the document.", "error");
      return "";
    }
  };

  // Submit claim
  const handleClaimSubmit = async () => {
    if (!reason || !file) {
      Swal.fire("Incomplete", "Please provide reason and upload document.", "warning");
      return;
    }

    Swal.fire({
      title: "Uploading...",
      text: "Please wait while we upload your document.",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    const documentUrl = await uploadFile(file);
    Swal.close();
    if (!documentUrl) return;

    try {
      const payload = {
        policy_id: claimPolicy.policy_id,
        customerEmail: user.email,
        reason,
        documentUrl,
        status: "Pending",
      };
      const res = await post("/api/claim-request", payload);

      if (res?.success) {
        Swal.fire("Success", "Claim submitted successfully!", "success");

        // Update claim status locally
        setPolicies((prev) =>
          prev.map((p) =>
            p.policy_id === claimPolicy.policy_id
              ? { ...p, claimStatus: "Pending" }
              : p
          )
        );

        setClaimPolicy(null);
        setReason("");
        setFile(null);
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to submit claim.", "error");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">📄 Claim Requests</h2>

      <div className="bg-white shadow-xl rounded-xl overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-gray-50 text-gray-700 text-sm font-semibold">
            <tr>
              {["Policy Name", "Claim Status", "Action"].map((col) => (
                <th key={col} className="p-4 text-left">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="3" className="p-6 text-center">
                  <Loading size={40} />
                </td>
              </tr>
            ) : policies.length === 0 ? (
              <tr>
                <td colSpan="3" className="p-6 text-center text-gray-500 font-medium">
                  No approved policies found.
                </td>
              </tr>
            ) : (
              policies.map((policy) => (
                <motion.tr
                  key={policy._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-4 font-medium text-gray-800">
                    {policy.policyDetails.title}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        policy.claimStatus === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : policy.claimStatus === "Approved"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {policy.claimStatus || "None"}
                    </span>
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
                      <button className="bg-green-600 text-white px-4 py-1.5 rounded-lg hover:bg-green-700 transition text-sm">
                        Approved
                      </button>
                    )}
                  </td>
                </motion.tr>
              ))
            )}
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
                Claim: {claimPolicy.policyDetails.title}
              </h3>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2 font-medium">
                  Reason for Claim
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Enter reason for claim..."
                  className="w-full border rounded-lg p-3 text-gray-700 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2 font-medium">
                  Upload Document
                </label>
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
