import React from "react";
import { motion } from "framer-motion";

const AgentCard = ({ agent }) => {
  return (
    <motion.div
      whileHover={{
        scale: 1.05,
        boxShadow: "0 25px 60px rgba(59,130,246,0.25)",
      }}
      className="bg-gradient-to-br from-indigo-50 to-gray-100 backdrop-blur-md p-6 rounded-3xl shadow-xl transition cursor-pointer flex flex-col items-center text-center"
    >
      <img
        src={agent.userPhoto}
        alt={agent.name}
        className="w-28 h-28 rounded-full object-cover border-4 border-blue-500 mb-4 shadow-md"
      />
      <h3 className="text-xl font-bold text-gray-900 mb-2">{agent.name}</h3>
      <p className="mt-2 max-w-40 mx-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-xl text-white font-semibold px-4 py-1 rounded-3xl transition">Agent</p>
    </motion.div>
  );
};

export default AgentCard;
