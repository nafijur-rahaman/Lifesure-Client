import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const fetchServices = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          title: "Life Insurance",
          description:
            "Protect your loved ones with comprehensive life coverage.",
          icon: "🛡️",
        },
        {
          id: 2,
          title: "Health Insurance",
          description:
            "Ensure you and your family are covered for medical expenses.",
          icon: "💊",
        },
        {
          id: 3,
          title: "Retirement Plans",
          description:
            "Plan your retirement with secure and flexible policies.",
          icon: "🏖️",
        },
        {
          id: 4,
          title: "Travel Insurance",
          description:
            "Travel with confidence knowing you’re covered worldwide.",
          icon: "✈️",
        },
        {
          id: 5,
          title: "Family Insurance",
          description: "Keep your family protected with tailored coverage.",
          icon: "👨‍👩‍👧‍👦",
        },
        {
          id: 6,
          title: "Investment Plans",
          description:
            "Grow your wealth safely with our insurance-linked investments.",
          icon: "📈",
        },
      ]);
    }, 1000);
  });

const ServiceCard = ({ service }) => (
  <motion.div
    whileHover={{ scale: 1.05, boxShadow: "0 25px 60px rgba(59,130,246,0.25)" }}
    className="bg-gradient-to-br from-indigo-50 to-gray-100 backdrop-blur-md  p-6 rounded-3xl shadow-xl flex flex-col items-center text-center transition cursor-pointer hover:-translate-y-1"
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
    <section className="pt-30 pb-40  relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <h2 className="text-5xl font-extrabold text-center mb-16 text-gray-900">
          Our Services
        </h2>

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
