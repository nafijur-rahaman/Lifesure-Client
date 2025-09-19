import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { motion } from "framer-motion";

// Fake API for single policy
const fetchPolicyById = (id) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id,
        title: "Term Life Premium",
        category: "Term Life",
        image: "https://picsum.photos/800/400?random=11",
        description: `
This Term Life Premium policy provides comprehensive coverage for you and your family. 

- Flexible premium options  
- Coverage up to $1,000,000  
- Additional benefits include critical illness coverage  

Ensure your family’s future is secured with a trusted plan tailored to your needs.
        `,
        agent: "John Doe",
        agentImage: "https://i.pravatar.cc/40?img=32",
      });
    }, 500);
  });

// Fake API for related policies
const fetchRelatedPolicies = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 2, title: "Term Life Basic", category: "Term Life", image: "https://picsum.photos/400/250?random=12" },
        { id: 3, title: "Term Life Advanced", category: "Term Life", image: "https://picsum.photos/400/250?random=13" },
        { id: 4, title: "Senior Secure Plan", category: "Senior Plan", image: "https://picsum.photos/400/250?random=14" },
      ]);
    }, 500);
  });

export default function PolicyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [policy, setPolicy] = useState(null);
  const [relatedPolicies, setRelatedPolicies] = useState([]);

  useEffect(() => {
    fetchPolicyById(id).then((data) => setPolicy(data));
    fetchRelatedPolicies().then((data) => setRelatedPolicies(data.filter(p => p.id != id)));
  }, [id]);

  if (!policy) return <p className="text-center mt-20">Loading...</p>;

  const categoryColors = {
    "Term Life": "bg-indigo-600",
    "Senior Plan": "bg-green-500",
    default: "bg-gray-500",
  };

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-pink-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4">

        {/* Back button */}
        <button onClick={() => navigate(-1)} className="mb-6 text-indigo-600 font-semibold hover:underline">
          ← Back to Policies
        </button>

        {/* Featured Image */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="relative rounded-3xl overflow-hidden shadow-lg mb-6">
          <img src={policy.image} alt={policy.title} className="w-full h-96 object-cover" />
          <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-semibold text-white shadow-md ${categoryColors[policy.category] || categoryColors.default}`}>
            {policy.category}
          </span>
        </motion.div>

        {/* Glassmorphism Details */}
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.7, delay:0.2 }} className="backdrop-blur-md bg-white/70 rounded-3xl p-8 shadow-xl mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-6">{policy.title}</h1>
          <div className="flex items-center gap-3 mb-6">
            <img src={policy.agentImage} alt={policy.agent} className="w-10 h-10 rounded-full" />
            <span className="font-semibold text-gray-800">Agent: {policy.agent}</span>
          </div>
          <div className="prose prose-lg text-gray-800">
            {policy.description.split("\n").map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>
        </motion.div>

        {/* Related Policies */}
        {relatedPolicies.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Related Policies</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPolicies.map((p) => (
                <motion.div
                  key={p.id}
                  whileHover={{ scale: 1.03, boxShadow: "0 20px 50px rgba(59,130,246,0.15)" }}
                  onClick={() => navigate(`/policies/${p.id}`)}
                  className="cursor-pointer rounded-2xl overflow-hidden shadow-md bg-white/80 backdrop-blur-md transition-transform"
                >
                  <img src={p.image} alt={p.title} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold text-white ${categoryColors[p.category] || categoryColors.default}`}>
                      {p.category}
                    </span>
                    <h3 className="text-lg font-bold text-gray-900 mt-2">{p.title}</h3>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* CTA Button */}
        <motion.div initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }} transition={{ duration:0.7, delay:0.5 }} className="mt-12 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-6 text-center shadow-lg hover:scale-105 transform transition cursor-pointer">
          Get a Quote
        </motion.div>
      </div>
    </section>
  );
}
