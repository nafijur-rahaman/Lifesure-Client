import { motion } from "framer-motion";
import clsx from "clsx";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useEffect, useState } from "react";

const fetchPolicies = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, title: "Life Protect Plan", coverage: "$100,000", duration: "20 Years", popularity: "Most Purchased" },
        { id: 2, title: "Health Secure", coverage: "$50,000", duration: "10 Years", popularity: "Popular" },
        { id: 3, title: "Family Shield", coverage: "$200,000", duration: "25 Years", popularity: "Premium Choice" },
        { id: 4, title: "Retirement Plus", coverage: "$150,000", duration: "15 Years", popularity: "Smart Pick" },
        { id: 5, title: "Travel Guard", coverage: "$75,000", duration: "5 Years", popularity: "Traveler’s Favorite" },
        { id: 6, title: "Child Future Plan", coverage: "$120,000", duration: "18 Years", popularity: "Best for Families" },
      ]);
    }, 2000);
  });

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
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 20 } },
};

const floatingAnimation = {
  animate: { y: [0, -4, 0], transition: { duration: 3, repeat: Infinity, ease: "easeInOut" } },
};

const PolicyCard = ({ title, coverage, duration, popularity, loading }) => (
  <motion.div
    variants={cardVariants}
    whileHover={{ scale: 1.06, boxShadow: "0 25px 50px rgba(59,130,246,0.25), 0 0 15px rgba(59,130,246,0.2)" }}
    whileTap={{ scale: 0.98 }}
    {...floatingAnimation}
    className="relative rounded-3xl border-2 border-gradient-to-r from-blue-400 to-indigo-600 p-1 bg-gradient-to-br from-white/70 to-white/50 shadow-lg backdrop-blur-md transition overflow-hidden"
  >
    <div className="bg-white/80 rounded-2xl p-6 h-full flex flex-col justify-between">
      {loading ? (
        <SkeletonTheme baseColor="#e0f2fe" highlightColor="#f0f9ff">
          <div className="space-y-3">
            <Skeleton height={28} width="70%" />
            <Skeleton height={20} width="60%" />
            <Skeleton height={20} width="50%" />
            <Skeleton height={24} width={100} borderRadius={12} />
          </div>
        </SkeletonTheme>
      ) : (
        <>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
          <p className="text-gray-700 mb-1 text-sm">
            Coverage: <span className="font-semibold text-gray-900">{coverage}</span>
          </p>
          <p className="text-gray-700 mb-4 text-sm">
            Duration: <span className="font-semibold text-gray-900">{duration}</span>
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

export default function PolicyCards() {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPolicies().then((data) => {
      setPolicies(data);
      setLoading(false);
    });
  }, []);

  return (
    <section className="py-28 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-5xl font-extrabold text-center text-gray-900 mb-20">
          Premium Policies
        </h2>

        <motion.div
          initial="hidden"
          animate="show"
          transition={{ staggerChildren: 0.15 }}
          className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3"
        >
          {(loading ? Array(6).fill({}) : policies).map((policy, i) => (
            <PolicyCard key={i} {...policy} loading={loading} />
          ))}
        </motion.div>

        <motion.div
          className="mt-24 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <motion.button
            whileHover={{ scale: 1.06, boxShadow: "0 15px 25px rgba(59,130,246,0.3)" }}
            whileTap={{ scale: 0.97 }}
            className={clsx(
              "px-10 py-3 font-semibold rounded-2xl shadow-lg text-white transition",
              loading
                ? "bg-blue-200 text-blue-700 cursor-wait"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-xl"
            )}
          >
            {loading ? "Loading Policies..." : "Show All Policies"}
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
