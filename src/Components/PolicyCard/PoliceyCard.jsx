import { motion } from "framer-motion";
import "react-loading-skeleton/dist/skeleton.css";
import { useEffect, useState } from "react";
import { useApi } from "../../hooks/UseApi";
import PolicyCards from "../PolicyCards/PolicyCards";



export default function PolicyCard() {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const { get } = useApi();

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
    <section className="pb-40 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4  ">
<motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="mx-auto max-w-3xl text-center mb-20"
    >
      <h2 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl font-serif">
        Find Your Perfect Policy
      </h2>
      <p className="mt-6 text-lg leading-8 text-slate-700">
        Whether you're protecting your family, building a legacy, or securing your business,
        we have a solution crafted for your unique needs.
      </p>
    </motion.div>

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
