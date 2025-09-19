import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";

// Fake API
const fetchPolicies = (page = 1, category = "All") =>
  new Promise((resolve) => {
    setTimeout(() => {
      const allPolicies = [
        { id: 1, title: "Term Life Basic", category: "Term Life", image: "https://picsum.photos/400/250?random=1", details: "Affordable coverage for young adults." },
        { id: 2, title: "Senior Secure Plan", category: "Senior Plan", image: "https://picsum.photos/400/250?random=2", details: "Protection tailored for seniors." },
        { id: 3, title: "Family Term Life", category: "Term Life", image: "https://picsum.photos/400/250?random=3", details: "Comprehensive family protection." },
        { id: 4, title: "Gold Senior Plan", category: "Senior Plan", image: "https://picsum.photos/400/250?random=4", details: "Premium benefits for seniors." },
        { id: 5, title: "Term Life Advanced", category: "Term Life", image: "https://picsum.photos/400/250?random=5", details: "Extra coverage for your family." },
        { id: 6, title: "Senior Plan Plus", category: "Senior Plan", image: "https://picsum.photos/400/250?random=6", details: "Enhanced benefits and services." },
        { id: 7, title: "Young Life Plan", category: "Term Life", image: "https://picsum.photos/400/250?random=7", details: "Affordable plan for young adults." },
        { id: 8, title: "Silver Senior Plan", category: "Senior Plan", image: "https://picsum.photos/400/250?random=8", details: "Balanced coverage for seniors." },
        { id: 9, title: "Term Life Premium", category: "Term Life", image: "https://picsum.photos/400/250?random=9", details: "Premium term life coverage." },
        { id: 10, title: "Senior Elite Plan", category: "Senior Plan", image: "https://picsum.photos/400/250?random=10", details: "Elite services for seniors." },
      ];

      // Filter category
      const filtered = category === "All" ? allPolicies : allPolicies.filter(p => p.category === category);
      const perPage = 9;
      const start = (page - 1) * perPage;
      const paginated = filtered.slice(start, start + perPage);

      resolve({ policies: paginated, total: filtered.length });
    }, 500);
  });

export default function Policies() {
  const navigate = useNavigate();
  const [policies, setPolicies] = useState([]);
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [totalPolicies, setTotalPolicies] = useState(0);

  useEffect(() => {
    fetchPolicies(page, category).then(({ policies, total }) => {
      setPolicies(policies);
      setTotalPolicies(total);
    });
  }, [page, category]);

  const totalPages = Math.ceil(totalPolicies / 9);

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-pink-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">Our Policies</h2>

        {/* Category Filters */}
        <div className="flex justify-center gap-4 mb-12">
          {["All", "Term Life", "Senior Plan"].map((cat) => (
            <button
              key={cat}
              onClick={() => { setCategory(cat); setPage(1); }}
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
          {policies.map((policy) => (
            <motion.div
              key={policy.id}
              whileHover={{ scale: 1.03, boxShadow: "0 20px 50px rgba(59,130,246,0.15)" }}
              onClick={() => navigate(`/policies/${policy.id}`)}
              className="cursor-pointer rounded-3xl overflow-hidden shadow-md bg-white/80 backdrop-blur-md transition-transform"
            >
              <img src={policy.image} alt={policy.title} className="w-full h-48 object-cover" />
              <div className="p-6">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold text-white mb-2 inline-block ${policy.category === "Term Life" ? "bg-indigo-600" : "bg-green-500"}`}>
                  {policy.category}
                </span>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{policy.title}</h3>
                <p className="text-gray-700">{policy.details}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-12 gap-3">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setPage(i + 1)}
                className={`px-4 py-2 rounded-full font-semibold transition ${
                  page === i + 1 ? "bg-indigo-600 text-white shadow-lg" : "bg-white hover:bg-indigo-50 text-gray-800"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
