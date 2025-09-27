import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { motion } from "framer-motion";
import { useApi } from "../../hooks/UseApi";
import { User, ShieldCheck, Calendar, DollarSign, Clock } from "lucide-react";
import Loading from "../../Components/Loader/Loader";

export default function PolicyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { get } = useApi();
  const [policy, setPolicy] = useState(null);
  const [relatedPolicies, setRelatedPolicies] = useState([]);

  useEffect(() => {
    const fetchPolicy = async () => {
      const res = await get(`/api/get-policy/${id}`);
      if (res?.success) setPolicy(res.data);
    };

    const fetchRelated = async () => {
      const res = await get("/api/get-policies");
      if (res?.success) {
        setRelatedPolicies(res.data.filter((p) => p._id !== id));
      }
    };

    fetchPolicy();
    fetchRelated();
  }, [id]);

  if (!policy)
    return <Loading></Loading>;

  const categoryColors = {
    "Term Life": "bg-indigo-600",
    "Senior Plan": "bg-green-500",
    default: "bg-gray-500",
  };

  return (
    <section className="py-20 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8 text-indigo-600 font-semibold hover:underline"
        >
          ← Back to Policies
        </button>

        {/* Policy Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="flex flex-col lg:flex-row items-center gap-8 bg-white rounded-3xl shadow-lg overflow-hidden"
        >
          <img
            src={policy.image}
            alt={policy.title}
            className="w-full lg:w-1/2 h-80 object-cover"
          />
          <div className="p-8 lg:w-1/2 space-y-4">
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold text-white shadow ${
                categoryColors[policy.category] || categoryColors.default
              }`}
            >
              {policy.category}
            </span>
            <h1 className="text-4xl font-extrabold text-gray-900">
              {policy.title}
            </h1>
            <p className="text-gray-700 text-lg">{policy.description}</p>

            {/* Policy Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-indigo-500" />
                <span>
                  <strong>Min Age:</strong> {policy.minAge}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-indigo-500" />
                <span>
                  <strong>Max Age:</strong> {policy.maxAge}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-green-500" />
                <span>
                  <strong>Coverage:</strong> {policy.coverage}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-yellow-500" />
                <span>
                  <strong>Duration:</strong> {policy.duration}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-red-500" />
                <span>
                  <strong>Base Premium:</strong> {policy.basePremium}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.button
          onClick={() => navigate(`/quote-page/${id}`)}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          whileHover={{
            scale: 1.05,
            boxShadow: "0 8px 30px rgba(99,102,241,0.4)",
          }}
          className="mt-12 flex items-center gap-2 mx-auto px-6 py-3 bg-indigo-600/90 text-white font-semibold rounded-full shadow-md hover:bg-indigo-500/90 transition backdrop-blur-sm"
        >
          <ShieldCheck className="w-5 h-5" />
          Get a Quote
        </motion.button>

        {/* Related Policies */}
        {relatedPolicies.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">
              Related Policies
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPolicies.map((p) => (
                <motion.div
                  key={p._id}
                  whileHover={{
                    scale: 1.03,
                    boxShadow: "0 20px 50px rgba(0,0,0,0.1)",
                  }}
                  onClick={() => navigate(`/policy-details/${p._id}`)}
                  className="cursor-pointer rounded-2xl overflow-hidden shadow-lg bg-white transition-transform"
                >
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold text-white ${
                        categoryColors[p.category] || categoryColors.default
                      }`}
                    >
                      {p.category}
                    </span>
                    <h3 className="text-lg font-bold text-gray-900 mt-2">
                      {p.title}
                    </h3>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
