import React from "react";
import { motion } from "framer-motion";

// Real Agent Card
export const AgentCard = ({ agent }) => {
  return (
    <motion.div
      whileHover={{
        scale: 1.05,
        boxShadow: "0 25px 60px rgba(59,130,246,0.25)",
      }}
      className="bg-white backdrop-blur-md p-6 rounded-3xl shadow-xl flex flex-col items-center text-center cursor-pointer transition hover:-translate-y-1"
    >
      <img
        src={agent.userPhoto}
        alt={agent.name}
        className="w-28 h-28 rounded-full object-cover border-4 border-blue-500 mb-4 shadow-md"
      />
      <h3 className="text-xl font-bold text-gray-900 mb-2">{agent.name}</h3>
      <p className="mt-2 max-w-40 mx-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold px-4 py-1 rounded-3xl transition">
        Agent
      </p>
    </motion.div>
  );
};

// Skeleton Card
export const AgentCardSkeleton = () => {
  const skeletonVariants = {
    animate: {
      opacity: [0.5, 1, 0.5],
      transition: { duration: 1, repeat: Infinity, ease: "easeInOut" },
    },
  };

  return (
    <motion.div
      variants={skeletonVariants}
      className="bg-white backdrop-blur-md p-6 rounded-3xl shadow-xl flex flex-col items-center text-center"
    >
      {/* Image */}
      <div className="w-28 h-28 rounded-full bg-gray-200 border-4 border-gray-300 mb-4 shadow-md" />

      {/* Name */}
      <div className="h-5 w-24 bg-gray-200 rounded mb-2" />

      {/* Role */}
      <div className="h-6 w-20 bg-gray-300 rounded-3xl mt-2" />
    </motion.div>
  );
};
