import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useApi } from "../../hooks/UseApi";
import { AgentCard, AgentCardSkeleton } from "./../AgentCard/AgentCard";

export default function OurAgents() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { get } = useApi();

  useEffect(() => {
    const fetchAgents = async () => {
      setLoading(true);
      const res = await get("/api/get-agent-users");
      if (res?.success) setAgents(res.data);
      setLoading(false);
    };
    fetchAgents();
  }, []);

  const containerVariants = {
    animate: { transition: { staggerChildren: 0.15 } },
  };

  return (
    <section className="pb-40 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <h2 className="text-5xl font-extrabold text-center mb-16 text-gray-900">
          Meet Our Agents
        </h2>

        <motion.div
          className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="initial"
          animate="animate"
        >
          {loading
            ? [...Array(6)].map((_, i) => <AgentCardSkeleton key={i} />)
            : agents.map((agent) => <AgentCard key={agent._id} agent={agent} />)}
        </motion.div>
      </div>
    </section>
  );
}
