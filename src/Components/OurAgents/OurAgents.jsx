// components/MeetOurAgents.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award } from "lucide-react";
import { useApi } from "../../hooks/UseApi";

const filters = ["All", "Family Planning", "Small Business", "Estate Planning"];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 30 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -30,
    transition: { duration: 0.4, ease: "easeIn" },
  },
};

export default function MeetOurAgents() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { get } = useApi();

  useEffect(() => {
    const fetchAgents = async () => {
      setLoading(true);
      const res = await get("/api/get-agent-users");
      if (res?.success && Array.isArray(res.data)) {
        setAgents(res.data);
      }
      setLoading(false);
    };
    fetchAgents();
  }, []);

  const mappedAgents = agents.map((a, i) => ({
    name: a.name,
    role: "Licensed Insurance Advisor",
    image: a.userPhoto,
    philosophy:
      '"Providing honest guidance and personal support for every client’s unique goals."',
    credential: i % 2 === 0 ? "Certified Advisor" : "Top Rated 2025",
    specialties:
      i % 3 === 0
        ? ["Family Planning"]
        : i % 3 === 1
        ? ["Small Business"]
        : ["Estate Planning"],
    email: a.email, // use this for mailto
  }));

  const filteredAgents =
    activeFilter === "All"
      ? mappedAgents
      : mappedAgents.filter((agent) =>
          agent.specialties.includes(activeFilter)
        );

  // Determine number of skeleton cards based on screen size
  const [skeletonCount, setSkeletonCount] = useState(3);

  useEffect(() => {
    const updateSkeletonCount = () => {
      const width = window.innerWidth;
      if (width < 640) setSkeletonCount(1); // mobile
      else if (width < 1024) setSkeletonCount(2); // tablet
      else setSkeletonCount(3); // desktop
    };
    updateSkeletonCount();
    window.addEventListener("resize", updateSkeletonCount);
    return () => window.removeEventListener("resize", updateSkeletonCount);
  }, []);

  return (
    <div className="bg-slate-50 pb-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl font-serif">
            Connect with Your Personal Advocate
          </h2>
          <p className="mt-6 text-lg leading-8 text-slate-700">
            Our team of licensed advisors is dedicated to your financial
            well-being. Find the right expert to guide you on your journey.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="mt-16 flex justify-center flex-wrap gap-4">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-2.5 text-sm font-semibold rounded-full transition-all duration-300
                ${
                  activeFilter === filter
                    ? "bg-slate-900 text-white shadow-lg"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Agent Cards */}
        <motion.div
          layout
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12"
        >
          <AnimatePresence>
            {loading
              ? // Responsive Skeleton Cards
                Array.from({ length: skeletonCount }).map((_, i) => (
                  <motion.div
                    key={i}
                    layout
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="flex flex-col rounded-3xl bg-white shadow-2xl ring-1 ring-slate-200/50 overflow-hidden"
                  >
                    <div className="relative">
                      <div className="h-80 w-full bg-slate-200 animate-pulse" />
                      <div className="absolute top-4 right-4 flex items-center gap-x-2 bg-slate-300/80 backdrop-blur-sm text-xs font-bold px-3 py-1.5 rounded-full">
                        <Award className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-400">Loading...</span>
                      </div>
                    </div>
                    <div className="p-8 flex flex-col flex-1">
                      <div className="h-6 w-1/2 bg-slate-200 rounded animate-pulse mb-2" /> {/* Name */}
                      <div className="h-4 w-1/3 bg-slate-200 rounded animate-pulse mb-4" /> {/* Role */}
                      <div className="h-3 w-full bg-slate-200 rounded animate-pulse mb-2" />
                      <div className="h-3 w-5/6 bg-slate-200 rounded animate-pulse mb-2" />
                      <div className="mt-6 flex flex-wrap gap-2">
                        <span className="inline-block h-5 w-16 bg-slate-200 rounded-full animate-pulse" />
                        <span className="inline-block h-5 w-20 bg-slate-200 rounded-full animate-pulse" />
                      </div>
                      <div className="mt-8 flex-1 flex items-end">
                        <div className="w-full h-10 bg-slate-200 rounded-full animate-pulse" />
                      </div>
                    </div>
                  </motion.div>
                ))
              : filteredAgents.map((agent) => (
                  <motion.div
                    layout
                    key={agent.name}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="flex flex-col rounded-3xl bg-white shadow-2xl ring-1 ring-slate-200/50 overflow-hidden"
                  >
                    <div className="relative">
                      <img
                        className="h-80 w-full object-cover"
                        src={agent.image}
                        alt={agent.name}
                      />
                      {agent.credential && (
                        <div className="absolute top-4 right-4 flex items-center gap-x-2 bg-white/80 backdrop-blur-sm text-cyan-800 text-xs font-bold px-3 py-1.5 rounded-full">
                          <Award className="h-4 w-4" />
                          <span>{agent.credential}</span>
                        </div>
                      )}
                    </div>
                    <div className="p-8 flex flex-col flex-1">
                      <h3 className="text-2xl font-semibold text-slate-900">
                        {agent.name}
                      </h3>
                      <p className="text-cyan-700 font-medium">{agent.role}</p>
                      <p className="mt-4 text-slate-600 italic">{agent.philosophy}</p>
                      <div className="mt-6 flex flex-wrap gap-2">
                        {agent.specialties.map((spec) => (
                          <span
                            key={spec}
                            className="inline-block bg-slate-100 text-slate-600 text-xs font-semibold px-3 py-1 rounded-full"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                      <div className="mt-8 flex-1 flex items-end">
                        <a
                          href={`mailto:${agent.email}?subject=Consultation%20Request&body=Hi%20${agent.name},%0D%0AI%20would%20like%20to%20schedule%20a%20consultation.`}
                          className="w-full text-center rounded-full bg-slate-900 px-6 py-3 text-base font-semibold text-white shadow-lg hover:bg-slate-700 transition-colors"
                        >
                          Schedule a Consultation
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
