import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import clsx from "clsx";



const fetchReviews = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          name: "John Doe",
          rating: 5,
          message: "Amazing service! I feel secure with my policy.",
          image: "https://i.pravatar.cc/100?img=1",
          plan: "Life Protect Plan",
        },
        {
          id: 2,
          name: "Jane Smith",
          rating: 4,
          message: "Very responsive support and easy to understand policies.",
          image: "https://i.pravatar.cc/100?img=2",
          plan: "Health Secure",
        },
        {
          id: 3,
          name: "Mark Johnson",
          rating: 5,
          message: "Professional and trustworthy, highly recommended.",
          image: "https://i.pravatar.cc/100?img=3",
          plan: "Family Shield",
        },
        {
          id: 4,
          name: "Emma Watson",
          rating: 4,
          message: "Great coverage and smooth claims process.",
          image: "https://i.pravatar.cc/100?img=4",
          plan: "Retirement Plus",
        },
        {
          id: 5,
          name: "Luke Wilson",
          rating: 5,
          message: "Excellent policies, highly recommend to everyone.",
          image: "https://i.pravatar.cc/100?img=5",
          plan: "Travel Guard",
        },
      ]);
    }, 1500);
  });

// ===== Variants & Styles =====
const badgeStyles = {
  "Most Purchased": "bg-blue-100 text-blue-800",
  Popular: "bg-green-100 text-green-800",
  "Premium Choice": "bg-purple-100 text-purple-800",
  "Smart Pick": "bg-indigo-100 text-indigo-800",
  "Traveler’s Favorite": "bg-orange-100 text-orange-800",
  "Best for Families": "bg-pink-100 text-pink-800",
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 120, damping: 20 },
  },
};

// ===== Policy Card Component =====
const PolicyCard = ({ title, coverage, duration, popularity, loading }) => (
  <motion.div
    variants={cardVariants}
    whileHover={{ scale: 1.06, boxShadow: "0 25px 50px rgba(59,130,246,0.25)" }}
    whileTap={{ scale: 0.98 }}
    className="relative rounded-3xl border-2 border-gradient-to-r from-blue-400 to-indigo-600 p-1 bg-gradient-to-br from-white/70 to-white/50 shadow-lg backdrop-blur-md overflow-hidden"
  >
    <div className="bg-white/80 rounded-2xl p-6 h-full flex flex-col justify-between">
      {loading ? (
        <div className="space-y-3">
          <div className="h-7 w-3/4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-5 w-1/2 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-5 w-1/3 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-6 w-24 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
      ) : (
        <>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
          <p className="text-gray-700 mb-1 text-sm">
            Coverage:{" "}
            <span className="font-semibold text-gray-900">{coverage}</span>
          </p>
          <p className="text-gray-700 mb-4 text-sm">
            Duration:{" "}
            <span className="font-semibold text-gray-900">{duration}</span>
          </p>
          <span
            className={clsx(
              "inline-block px-4 py-1 text-sm font-medium rounded-full",
              badgeStyles[popularity] || "bg-gray-100 text-gray-600"
            )}
          >
            {popularity}
          </span>
        </>
      )}
    </div>
  </motion.div>
);

// ===== Review Card Component =====
const ReviewCard = ({ review }) => (
  <motion.div className="flex-shrink-0 w-80 bg-white/80 backdrop-blur-md border-2 border-gradient-to-r from-blue-400 to-indigo-600 p-6 rounded-3xl shadow-xl hover:shadow-2xl hover:scale-105 transition-transform">
    <div className="flex items-center mb-4">
      <img
        src={review.image}
        alt={review.name}
        className="w-14 h-14 rounded-full object-cover mr-4"
      />
      <div>
        <h4 className="font-semibold text-gray-900">{review.name}</h4>
        <p className="text-sm text-gray-500">{review.plan}</p>
      </div>
    </div>
    <div className="flex items-center mb-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={clsx(
            "text-yellow-400",
            i < review.rating ? "opacity-100" : "opacity-30"
          )}
        >
          ★
        </span>
      ))}
    </div>
    <p className="text-gray-700 text-sm">{review.message}</p>
  </motion.div>
);


export default function PremiumHomepage() {

  const [reviews, setReviews] = useState([]);
  const [reviewIndex, setReviewIndex] = useState(0);


  // Fetch data
  useEffect(() => {
    fetchReviews().then((data) => setReviews(data));
  }, []);

  // Auto-scroll reviews
  useEffect(() => {
    const interval = setInterval(() => {
      setReviewIndex((prev) => (prev + 1) % reviews.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [reviews]);

  const visibleReviews = [];
  for (let i = 0; i < 3; i++) {
    if (reviews.length)
      visibleReviews.push(reviews[(reviewIndex + i) % reviews.length]);
  }

  const handleDragEnd = (event, info) => {
    if (info.offset.x < -50)
      setReviewIndex((prev) => (prev + 1) % reviews.length);
    if (info.offset.x > 50)
      setReviewIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
      {/* Floating gradient background */}
      <motion.div
        className="absolute -top-40 left-1/2 w-[1400px] h-[700px] bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 rounded-full opacity-20 blur-3xl -translate-x-1/2"
        animate={{ x: ["0%", "5%", "0%"] }}
        transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
      />

      {/* ===== Customer Reviews Section ===== */}
      <section className="py-28 relative z-10">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-5xl font-extrabold text-center mb-16 text-gray-900">
            What Our Customers Say
          </h2>

          <div className="relative overflow-hidden">
            <motion.div
              className="flex gap-6 justify-center cursor-grab"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={handleDragEnd}
            >
              <AnimatePresence initial={false}>
                {visibleReviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Navigation buttons */}
            <button
              onClick={() =>
                setReviewIndex(
                  (prev) => (prev - 1 + reviews.length) % reviews.length
                )
              }
              className="absolute left-0 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white shadow-md hover:bg-blue-50 transition z-10"
            >
              ◀
            </button>
            <button
              onClick={() =>
                setReviewIndex((prev) => (prev + 1) % reviews.length)
              }
              className="absolute right-0 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white shadow-md hover:bg-blue-50 transition z-10"
            >
              ▶
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
