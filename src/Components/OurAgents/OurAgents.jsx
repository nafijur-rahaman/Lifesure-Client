import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// Fake API
const fetchAgents = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, name: "Alice Morgan", experience: "8 Years", specialties: ["Life Insurance", "Retirement Plans"], photo: "https://i.pravatar.cc/150?img=12" },
        { id: 2, name: "James Carter", experience: "10 Years", specialties: ["Health Insurance", "Family Plans"], photo: "https://i.pravatar.cc/150?img=13" },
        { id: 3, name: "Sophia Lee", experience: "6 Years", specialties: ["Travel Insurance", "Investment Plans"], photo: "https://i.pravatar.cc/150?img=14" },
      ]);
    }, 1200);
  });

const AgentCard = ({ agent }) => (
  <motion.div
    whileHover={{ scale: 1.05, boxShadow: "0 25px 60px rgba(59,130,246,0.25)" }}
    className="bg-white/80 backdrop-blur-md border-2 border-gradient-to-r from-blue-400 to-indigo-600 p-6 rounded-3xl shadow-lg transition cursor-pointer flex flex-col items-center text-center"
  >
    <img
      src={agent.photo}
      alt={agent.name}
      className="w-28 h-28 rounded-full object-cover border-4 border-blue-500 mb-4 shadow-md"
    />
    <h3 className="text-xl font-bold text-gray-900 mb-2">{agent.name}</h3>
    <p className="text-gray-600 mb-2">{agent.experience} experience</p>
    <div className="flex flex-wrap justify-center gap-2 mt-2">
      {agent.specialties.map((spec, i) => (
        <span
          key={i}
          className="px-3 py-1 text-sm font-medium rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 text-white"
        >
          {spec}
        </span>
      ))}
    </div>
  </motion.div>
);

export default function OurAgents() {
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    fetchAgents().then((data) => setAgents(data));
  }, []);

  return (
    <section className="py-28 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
      {/* Optional floating gradient background */}
      <motion.div
        className="absolute -top-40 left-1/2 w-[1400px] h-[700px] bg-gradient-to-r from-purple-400 via-indigo-500 to-blue-400 rounded-full opacity-20 blur-3xl -translate-x-1/2"
        animate={{ x: ["0%", "5%", "0%"] }}
        transition={{ repeat: Infinity, duration: 25, ease: "easeInOut" }}
      />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <h2 className="text-5xl font-extrabold text-center mb-16 text-gray-900">Meet Our Agents</h2>

        <motion.div
          className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.2 }}
        >
          {agents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
