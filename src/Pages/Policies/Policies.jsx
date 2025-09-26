import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { useApi } from "../../hooks/UseApi";


export default function Policies() {
  const navigate = useNavigate();
  const { get } = useApi();
  const [policies, setPolicies] = useState([]);
  const [category, setCategory] = useState("All");

  // Fetch policies from API
  const fetchPolicies = async () => {

    const res = await get("/api/get-policies");

    if (res?.success) {
      setPolicies(res.data);
    } else {
      console.error("Failed to fetch policies");
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  // Filtered policies by category
  const filteredPolicies = category === "All"
    ? policies
    : policies.filter((p) => p.category === category);

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-pink-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">Our Policies</h2>

        {/* Category Filters */}
        <div className="flex justify-center gap-4 mb-12">
          {["All", "Term Life", "Senior Plan"].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full font-semibold transition ${
                category === cat ? "bg-indigo-600 text-white shadow-lg" : "bg-white hover:bg-indigo-50 text-gray-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Policy Cards */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPolicies.map((policy) => (
            <motion.div
              key={policy._id}
              whileHover={{ scale: 1.03, boxShadow: "0 20px 50px rgba(59,130,246,0.15)" }}
              onClick={() => navigate(`/policy-details/${policy._id}`)}
              className="cursor-pointer rounded-3xl overflow-hidden shadow-md bg-white/80 backdrop-blur-md transition-transform"
            >
              <img
                src={policy.image || "https://via.placeholder.com/400x250"}
                alt={policy.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold text-white mb-2 inline-block ${policy.category === "Term Life" ? "bg-indigo-600" : "bg-green-500"}`}>
                  {policy.category}
                </span>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{policy.title}</h3>
                <p className="text-gray-700">{policy.description || "No details available."}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
