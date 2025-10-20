import { motion } from "framer-motion";
import "react-loading-skeleton/dist/skeleton.css";
import { useEffect, useState } from "react";
import { useApi } from "../../hooks/UseApi";
import PolicyCards from "../PolicyCards/PolicyCards";



export default function PolicyCard() {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const { get } = useApi();

  console.log("Policies:", policies);

  const fetchPolicies = async () => {
    const res = await get("/api/get-top-policies");
    return res.data;
  };

  useEffect(() => {
    fetchPolicies().then((data) => {
      setPolicies(data.slice(0, 6)); 
      setLoading(false);
    });
  }, []);

  return (
    <section className="pb-40 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4  ">
        <h2 className="text-5xl font-extrabold text-center text-gray-900 mb-20">
          Popular Policies
        </h2>

        <motion.div
          initial="hidden"
          animate="show"
          transition={{ staggerChildren: 0.15 }}
          className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3"
        >
          {(loading ? Array(6).fill({}) : policies).map((policy, i) => (
            <PolicyCards key={i} {...policy} loading={loading} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
