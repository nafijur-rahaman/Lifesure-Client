import React from "react";
import { motion } from "framer-motion";

const AgentCard = ({ agent }) => {
  return (
    <motion.div
      whileHover={{
        scale: 1.05,
        boxShadow: "0 25px 60px rgba(59,130,246,0.25)",
      }}
      className="bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-xl transition cursor-pointer flex flex-col items-center text-center"
    >
      <img
        src={agent.userPhoto}
        alt={agent.name}
        className="w-28 h-28 rounded-full object-cover border-4 border-blue-500 mb-4 shadow-md"
      />
      <h3 className="text-xl font-bold text-gray-900 mb-2">{agent.name}</h3>
      <p className="text-gray-600 mb-2">Agent</p>
      <div className="flex flex-wrap justify-center gap-2 mt-2">
        <span className="px-3 py-1 text-sm font-medium rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          {agent.email}
        </span>
      </div>
    </motion.div>
  );
};

export default AgentCard;
