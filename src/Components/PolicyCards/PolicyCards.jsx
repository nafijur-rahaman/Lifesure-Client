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
  image,
  loading,
}) => {
  const navigate = useNavigate();

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{
        scale: 1.05,
        boxShadow:
          "0 20px 40px rgba(59,130,246,0.25), 0 0 15px rgba(59,130,246,0.2)",
      }}
      whileTap={{ scale: 0.98 }}
      {...floatingAnimation}
      className="relative rounded-3xl bg-white shadow-lg overflow-hidden transition flex flex-col"
    >
      {/* Top image */}
      {!loading ? (
        <div className="relative h-40 w-full overflow-hidden">
          <img
            src={image || "/default-policy.jpg"}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          {category && (
            <motion.span
              className={clsx(
                "absolute top-3 right-3 text-xs font-semibold px-3 py-1 rounded-full",
                categoryColors[category] || "bg-gray-500 text-white"
              )}
              {...pulseAnimation}
            >
              {category}
            </motion.span>
          )}
        </div>
      ) : (
        <SkeletonTheme baseColor="#e0f2fe" highlightColor="#f0f9ff">
          <Skeleton height={160} />
        </SkeletonTheme>
      )}

      {/* Card body */}
      <div className="p-6 flex flex-col flex-1 justify-between">
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
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {title}
              </h3>
              <p className="text-gray-700 mb-1 text-sm">
                Coverage:{" "}
                <span className="font-semibold text-gray-900">
                  {coverage} USD
                </span>
              </p>
              <p className="text-gray-700 mb-4 text-sm">
                Duration:{" "}
                <span className="font-semibold text-gray-900">
                  {duration} days
                </span>
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
            </div>

            {/* Button always visible at bottom */}
            <button
              onClick={() => navigate(`/policy-details/${_id}`)}
              className="w-2/3 mx-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-xl text-white font-semibold px-4 py-2 rounded-3xl mt-4 transition"
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
