import React from "react";
import clsx from "clsx";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

const badgeStyles = {
  "Most Purchased": "bg-blue-100 text-blue-800",
  Popular: "bg-green-100 text-green-800",
  "Premium Choice": "bg-purple-100 text-purple-800",
  "Smart Pick": "bg-indigo-100 text-indigo-800",
  "Traveler’s Favorite": "bg-orange-100 text-orange-800",
  "Best for Families": "bg-pink-100 text-pink-800",
};

// Professional category colors for badges
const categoryColors = {
  "Term Life": "bg-blue-600 text-white",
  Family: "bg-purple-600 text-white",
  Travel: "bg-orange-600 text-white",
  Senior: "bg-green-600 text-white",
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 120, damping: 20 },
  },
};

const floatingAnimation = {
  animate: {
    y: [0, -4, 0],
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
  },
};

const pulseAnimation = {
  animate: {
    boxShadow: [
      "0 0 8px rgba(0,0,0,0)",
      "0 0 12px rgba(0,0,0,0.3)",
      "0 0 8px rgba(0,0,0,0)",
    ],
  },
  transition: { repeat: Infinity, duration: 2, ease: "easeInOut" },
};

const PolicyCard = ({
  _id,
  title,
  coverage,
  duration,
  popularity,
  category,
  loading,
}) => {
  const navigate = useNavigate();



  return (
    <motion.div
      variants={cardVariants}
      whileHover={{
        scale: 1.06,
        boxShadow:
          "0 25px 50px rgba(59,130,246,0.25), 0 0 15px rgba(59,130,246,0.2)",
      }}
      whileTap={{ scale: 0.98 }}
      {...floatingAnimation}
      className="relative rounded-3xl border-2 border-gradient-to-r from-blue-400 to-indigo-600 p-1 bg-gradient-to-br from-white/70 to-white/50 shadow-lg backdrop-blur-md transition overflow-hidden"
    >
      <div className="bg-white/80 rounded-2xl p-6 h-full flex flex-col justify-between relative">
        {/* Pulsing Category Badge Top Right */}
        {!loading && category && (
          <motion.span
            className={clsx(
              "absolute top-4 right-4 text-xs font-semibold px-3 py-1 rounded-full",
              categoryColors[category] || categoryColors.default
            )}
            {...pulseAnimation}
          >
            {category}
          </motion.span>
        )}

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
              Coverage:{" "}
              <span className="font-semibold text-gray-900">{coverage} USD</span>
            </p>
            <p className="text-gray-700 mb-4 text-sm">
              Duration:{" "}
              <span className="font-semibold text-gray-900">{duration} years</span>
            </p>
            {popularity && (
              <span
                className={clsx(
                  "inline-block px-4 py-1 text-sm font-medium rounded-full mb-4",
                  badgeStyles[popularity] || "bg-gray-100 text-gray-600"
                )}
              >
                {popularity}
              </span>
            )}
            <button
              onClick={() => navigate(`/policy-details/${_id}`)}
              className="mt-auto max-w-40 mx-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-xl text-white font-semibold px-4 py-2 rounded-xl cursor-pointer transition"
            >
              View Details
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default PolicyCard;
