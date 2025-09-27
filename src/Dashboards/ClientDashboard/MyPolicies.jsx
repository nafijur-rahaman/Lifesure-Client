import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Star } from "lucide-react";
import { useApi } from "../../hooks/UseApi";
import useAuth from "../../hooks/UseAuth";
import Swal from "sweetalert2";

export default function MyPolicies() {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewPolicy, setReviewPolicy] = useState(null);
  const [detailsPolicy, setDetailsPolicy] = useState(null);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const { user } = useAuth();
  const userEmail = user?.email;

  const { get, post } = useApi();

  // ✅ Fetch policies
  useEffect(() => {
    if (!userEmail) return;
    const fetchPolicies = async () => {
      const data = await get(`/api/applied-policies?email=${userEmail}`);
      if (data?.success) {
        setPolicies(data.data);
      }
      setLoading(false);
    };
    fetchPolicies();
  }, [userEmail]);

  // ✅ Submit Review
  const handleSubmitReview = async () => {
    if (!rating || !feedback) {
      Swal.fire("Oops!", "Please provide both rating and feedback.", "warning");
      return;
    }

    const payload = {
      policy_id: reviewPolicy.policy_id,
      policyTitle: reviewPolicy.policyInfo?.title || "Unknown Policy",
      email: userEmail,
      rating,
      feedback,
    };

    try {
      const res = await post("/api/create-reviews", payload);
      if (res?.success) {
        Swal.fire("✅ Success!", "Your review has been submitted.", "success");
        setReviewPolicy(null);
        setRating(0);
        setFeedback("");
      } else {
        Swal.fire("❌ Error", "Failed to submit review.", "error");
      }
    } catch (err) {
      Swal.fire("❌ Error", "Something went wrong. Try again.", "error");
    }
  };

  const statusColors = {
    Approved: "bg-green-100 text-green-700",
    Pending: "bg-yellow-100 text-yellow-700",
    Rejected: "bg-red-100 text-red-700",
  };

  if (loading) return <div className="p-6">Loading policies...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">📑 My Policies</h2>
      {policies.length === 0 ? (
        <p className="text-gray-600">No applied policies found.</p>
      ) : (
        <div className="bg-white shadow-xl rounded-xl overflow-hidden">
          <table className="w-full border-collapse">
            <thead className="bg-gray-50 text-gray-700 text-sm font-semibold">
              <tr>
                {["Policy ID", "Name", "Status", "Applied On", "Actions"].map(
                  (col) => (
                    <th key={col} className="p-4 text-left">
                      {col}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {policies.map((policy) => (
                <motion.tr
                  key={policy._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-4 text-gray-700">{policy.policy_id}</td>
                  <td className="p-4 font-medium text-gray-800">
                    {policy.name}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        statusColors[policy.status] ||
                        "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {policy.status}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600">
                    {new Date(policy.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 flex gap-2 justify-center">
                    <button
                      onClick={() => setDetailsPolicy(policy)}
                      className="flex items-center gap-1 bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-lg text-sm hover:bg-indigo-200 transition"
                    >
                      <Eye className="w-4 h-4" /> View
                    </button>
                    {policy.status === "Approved" && (
                      <button
                        onClick={() => setReviewPolicy(policy)}
                        className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-3 py-1.5 rounded-lg text-sm hover:bg-yellow-200 transition"
                      >
                        <Star className="w-4 h-4" /> Review
                      </button>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Details Modal */}
      <AnimatePresence>
        {detailsPolicy && (
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
                onClick={() => setDetailsPolicy(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 font-bold"
              >
                ×
              </button>
              <h3 className="text-xl font-bold mb-4 text-gray-800">
                Policy Details
              </h3>
              <p className="text-gray-600 mb-2">
                <span className="font-semibold">Name:</span>{" "}
                {detailsPolicy.name}
              </p>
              <p className="text-gray-600 mb-2">
                <span className="font-semibold">Email:</span>{" "}
                {detailsPolicy.email}
              </p>
              <p className="text-gray-600 mb-2">
                <span className="font-semibold">Address:</span>{" "}
                {detailsPolicy.address}
              </p>
              <p className="text-gray-600 mb-2">
                <span className="font-semibold">Phone:</span>{" "}
                {detailsPolicy.phone}
              </p>
              <p className="text-gray-600 mb-2">
                <span className="font-semibold">Nominee:</span>{" "}
                {detailsPolicy.nomineeName} ({detailsPolicy.nomineeRelation})
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Health Issues:</span>{" "}
                {detailsPolicy.health?.join(", ")}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Review Modal */}
      <AnimatePresence>
        {reviewPolicy && (
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
                onClick={() => setReviewPolicy(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 font-bold"
              >
                ×
              </button>
              <h3 className="text-xl font-bold mb-4 text-gray-800">
                Review: {reviewPolicy.policyInfo?.title || "Policy"}
              </h3>
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-6 h-6 cursor-pointer ${
                      star <= rating
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-gray-300"
                    }`}
                    onClick={() => setRating(star)}
                  />
                ))}
              </div>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Write your feedback..."
                className="w-full border rounded-lg p-3 mb-4 text-gray-700 focus:ring-2 focus:ring-indigo-500"
              />
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setReviewPolicy(null)}
                  className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitReview}
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Submit
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
