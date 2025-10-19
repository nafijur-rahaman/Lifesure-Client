import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useApi } from "../../hooks/UseApi";
import AgentCard from "../AgentCard/AgentCard";

export default function OurAgents() {
  const [agents, setAgents] = useState([]);
  const { get } = useApi();

  useEffect(() => {
    const fetchAgents = async () => {
      const res = await get("/api/get-agent-users");
      if (res?.success) setAgents(res.data);
    };
    fetchAgents();
  }, []);

  return (
    <section className="pb-40 bg-gradient-to-br from-gray-50 to-gray-100  relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <h2 className="text-5xl font-extrabold text-center mb-16 text-gray-900">
          Meet Our Agents
        </h2>

        <motion.div
          className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.2 }}
        >
          {agents.map((agent) => (
            <AgentCard key={agent._id} agent={agent} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
