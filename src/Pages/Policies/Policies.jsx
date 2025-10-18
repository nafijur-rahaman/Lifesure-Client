import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { useApi } from "../../hooks/UseApi";
import Loading from "../../Components/Loader/Loader";

export default function Policies() {
  const navigate = useNavigate();
  const { get } = useApi();
  const [policies, setPolicies] = useState([]);
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const categories = ["All", "Term Life", "Senior", "Family", "Travel"];

  const categoryColors = {
    "Term Life": "bg-indigo-600",
    Senior: "bg-pink-600",
    Family: "bg-yellow-500",
    Travel: "bg-green-500",
    All: "bg-gray-400",
  };

  const fetchPolicies = async (query = "", currentPage = 1) => {
    setLoading(true);
    try {
      const res = await get(
        `/api/get-policies?page=${currentPage}&limit=9${
          query ? `&search=${query}` : ""
        }`
      );
      if (res?.success) {
        setPolicies(res.data);
        setTotalPages(res.totalPages);
      } else {
        console.error("Failed to fetch policies");
      }
    } catch (err) {
      console.error("Error fetching policies:", err);
    } finally {
      setLoading(false);
    }
  };

  // debounce for search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setPage(1); // reset to first page on new search
      fetchPolicies(searchQuery, 1);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // re-fetch when page changes
  useEffect(() => {
    fetchPolicies(searchQuery, page);
  }, [page]);

  const filteredPolicies =
    category === "All"
      ? policies
      : policies.filter((p) => p.category === category);

  return (
    <section className="py-30">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-5xl font-extrabold text-center mb-12 text-gray-900">
          Our Policies
        </h2>

        {/* Search Input */}
        <div className="flex justify-center mb-6">
          <input
            type="text"
            placeholder="Search policies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 border rounded-full focus:ring-2 focus:ring-indigo-400 outline-none w-full max-w-sm"
          />
        </div>

        {/* Category Filters */}
        <div className="flex justify-center gap-4 mb-12 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-3xl font-semibold transition ${
                category === cat
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "bg-white border-2 border-indigo-600 hover:text-indigo-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loading />
          </div>
        ) : filteredPolicies.length === 0 ? (
          <div className="flex justify-center items-center h-64 text-gray-500 text-xl">
            No policies found.
          </div>
        ) : (
          <>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filteredPolicies.map((policy) => (
                <motion.div
                  key={policy._id}
                  whileHover={{
                    scale: 1.03,
                    boxShadow: "0 20px 50px rgba(59,130,246,0.15)",
                  }}
                  onClick={() => navigate(`/policy-details/${policy._id}`)}
                  className="cursor-pointer rounded-3xl overflow-hidden shadow-md bg-white/80 backdrop-blur-md transition-transform"
                >
                  <img
                    src={policy.image || "https://via.placeholder.com/400x250"}
                    alt={policy.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <span
                      className={`px-3 py-1 rounded-3xl text-sm font-semibold text-white mb-3 inline-block ${
                        categoryColors[policy.category] || "bg-gray-500"
                      }`}
                    >
                      {policy.category}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {policy.title}
                    </h3>
                    <p className="text-gray-700 mb-4">
                      {policy.description.slice(0, 30) || "No details available."}....
                    </p>

                    {/* Purchase Count */}
                    <div className="flex items-center text-gray-600 text-sm font-medium">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1 text-indigo-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17 20h5V4H2v16h5m10-6a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                      <span>
                        {policy.purchaseCount.toLocaleString()} purchased
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center mt-10 gap-2">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-lg bg-gray-200 disabled:opacity-50"
              >
                Prev
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`px-4 py-2 rounded-lg ${
                    page === i + 1
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="px-4 py-2 rounded-lg bg-gray-200 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
