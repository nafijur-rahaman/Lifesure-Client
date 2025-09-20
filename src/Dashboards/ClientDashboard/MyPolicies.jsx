import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Star } from "lucide-react";

const policies = [
  {
    id: 1,
    name: "Term Life Insurance",
    coverage: "20 Lakh",
    duration: "20 Years",
    premium: "₹1,200/month",
    status: "Approved",
    details: "This policy provides coverage for 20 years with life insurance benefits up to 20 Lakh.",
  },
  {
    id: 2,
    name: "Senior Plan",
    coverage: "10 Lakh",
    duration: "10 Years",
    premium: "₹900/month",
    status: "Pending",
    details: "A special plan for seniors covering health and life benefits up to 10 Lakh.",
  },
  {
    id: 3,
    name: "Health + Life Combo",
    coverage: "15 Lakh",
    duration: "15 Years",
    premium: "₹1,100/month",
    status: "Rejected",
    details: "Combined health and life insurance with coverage of 15 Lakh for 15 years.",
  },
];

export default function MyPolicies() {
  const [reviewPolicy, setReviewPolicy] = useState(null);
  const [detailsPolicy, setDetailsPolicy] = useState(null);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  const handleSubmitReview = () => {
    console.log("Review submitted:", { policy: reviewPolicy, rating, feedback });
    setReviewPolicy(null);
    setRating(0);
    setFeedback("");
  };

  const statusColors = {
    Approved: "bg-green-100 text-green-700",
    Pending: "bg-yellow-100 text-yellow-700",
    Rejected: "bg-red-100 text-red-700",
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">📑 My Policies</h2>
      <div className="bg-white shadow-xl rounded-xl overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-gray-50 text-gray-700 text-sm font-semibold">
            <tr>
              {["Policy Name", "Coverage", "Duration", "Premium", "Status", "Actions"].map((col) => (
                <th key={col} className="p-4 text-left">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {policies.map((policy) => (
              <motion.tr
                key={policy.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="p-4 font-medium text-gray-800">{policy.name}</td>
                <td className="p-4 text-gray-600">{policy.coverage}</td>
                <td className="p-4 text-gray-600">{policy.duration}</td>
                <td className="p-4 text-gray-600">{policy.premium}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[policy.status]}`}>
                    {policy.status}
                  </span>
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

      {/* View Details Modal */}
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
              <h3 className="text-xl font-bold mb-4 text-gray-800">{detailsPolicy.name}</h3>
              <p className="text-gray-600 mb-2"><span className="font-semibold">Coverage:</span> {detailsPolicy.coverage}</p>
              <p className="text-gray-600 mb-2"><span className="font-semibold">Duration:</span> {detailsPolicy.duration}</p>
              <p className="text-gray-600 mb-2"><span className="font-semibold">Premium:</span> {detailsPolicy.premium}</p>
              <p className="text-gray-600"><span className="font-semibold">Details:</span> {detailsPolicy.details}</p>
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
                Review: {reviewPolicy.name}
              </h3>
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-6 h-6 cursor-pointer ${
                      star <= rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
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
