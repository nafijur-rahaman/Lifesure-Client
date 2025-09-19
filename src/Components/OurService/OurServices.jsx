import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// Fake API
const fetchServices = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, title: "Life Insurance", description: "Protect your loved ones with comprehensive life coverage.", icon: "🛡️" },
        { id: 2, title: "Health Insurance", description: "Ensure you and your family are covered for medical expenses.", icon: "💊" },
        { id: 3, title: "Retirement Plans", description: "Plan your retirement with secure and flexible policies.", icon: "🏖️" },
        { id: 4, title: "Travel Insurance", description: "Travel with confidence knowing you’re covered worldwide.", icon: "✈️" },
        { id: 5, title: "Family Insurance", description: "Keep your family protected with tailored coverage.", icon: "👨‍👩‍👧‍👦" },
        { id: 6, title: "Investment Plans", description: "Grow your wealth safely with our insurance-linked investments.", icon: "📈" },
      ]);
    }, 1000);
  });

const ServiceCard = ({ service }) => (
  <motion.div
    whileHover={{ scale: 1.05, boxShadow: "0 25px 60px rgba(59,130,246,0.25)" }}
    className="bg-white/80 backdrop-blur-md border-2 border-gradient-to-r from-blue-400 to-indigo-600 p-6 rounded-3xl shadow-lg flex flex-col items-center text-center transition cursor-pointer hover:-translate-y-1"
  >
    <div className="text-5xl mb-4">{service.icon}</div>
    <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
    <p className="text-gray-700">{service.description}</p>
  </motion.div>
);

export default function OurServices() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetchServices().then((data) => setServices(data));
  }, []);

  return (
    <section className="py-28 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
      {/* Floating gradient circle */}
      <motion.div
        className="absolute -top-40 left-1/2 w-[1400px] h-[700px] bg-gradient-to-r from-purple-400 via-indigo-500 to-blue-400 rounded-full opacity-20 blur-3xl -translate-x-1/2"
        animate={{ x: ["0%", "5%", "0%"] }}
        transition={{ repeat: Infinity, duration: 25, ease: "easeInOut" }}
      />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <h2 className="text-5xl font-extrabold text-center mb-16 text-gray-900">Our Services</h2>

        <motion.div
          className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.2 }}
        >
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
