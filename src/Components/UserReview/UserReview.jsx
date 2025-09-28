import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { useApi } from "../../hooks/UseApi";


// Review Card
const ReviewCard = ({ review }) => (
  <motion.div
    key={review._id}
    className="flex-shrink-0 w-80 bg-white/80 backdrop-blur-md border-2 border-gradient-to-r from-blue-400 to-indigo-600 p-6 rounded-3xl shadow-xl"
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -30 }}
    transition={{ duration: 0.8 }}
  >
    <div className="flex items-center mb-4">
      <img src={review.userImage} alt={review.userName} className="w-14 h-14 rounded-full object-cover mr-4" />
      <div>
        <h4 className="font-semibold text-gray-900">{review.userName}</h4>
        <p className="text-sm text-gray-500">{review.policyTitle}</p>
      </div>
    </div>
    <div className="flex items-center mb-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={clsx("text-yellow-400", i < review.rating ? "opacity-100" : "opacity-30")}>★</span>
      ))}
    </div>
    <p className="text-gray-700 text-sm">{review.feedback}</p>
  </motion.div>
);

export default function UserReview() {
  const [reviews, setReviews] = useState([]);
  const [reviewIndex, setReviewIndex] = useState(0);
  const { get, loading, error } = useApi();

  // Fetch reviews dynamically
  useEffect(() => {
    get("/api/reviews").then((data) => {
      if (data?.success) setReviews(data.data);
    });
  }, []);

  // Auto-scroll only if more than 1 review
  useEffect(() => {
    if (reviews.length <= 1) return;
    const interval = setInterval(() => {
      setReviewIndex((prev) => (prev + 1) % reviews.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [reviews]);

  if (!reviews.length) return <p className="text-center py-20">No reviews yet.</p>;

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
      <section className="py-28 relative z-10">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-5xl font-extrabold text-center mb-16 text-gray-900">What Our Customers Say</h2>

          <div className="flex justify-center gap-6 flex-wrap">
            {reviews.map((review) => (
              <ReviewCard key={review._id} review={review} />
            ))}
          </div>

          {error && <p className="text-red-500 text-center mt-6">Failed to load reviews.</p>}
        </div>
      </section>
    </div>
  );
}
