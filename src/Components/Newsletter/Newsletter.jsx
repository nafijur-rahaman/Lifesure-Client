import { useState } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { useApi } from "../../hooks/UseApi";

// Particle component with optional randomization
const Particle = ({ size = 4, delay = 0, x = 0, y = 0 }) => (
  <motion.div
    className="absolute rounded-full bg-white/70"
    style={{ width: size, height: size, top: y, left: x }}
    animate={{
      y: ["0px", "-10px", "0px"],
      x: ["0px", `${Math.random() * 10 - 5}px`, "0px"], // subtle random horizontal motion
      opacity: [0.5, 1, 0.5],
    }}
    transition={{ repeat: Infinity, duration: 4, delay, ease: "easeInOut" }}
  />
);

export default function PremiumNewsletter() {
  const [form, setForm] = useState({ name: "", email: "" });
  const [submitting, setSubmitting] = useState(false);
  const { post } = useApi();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!form.name || !form.email) {
      return Swal.fire({
        icon: "warning",
        title: "Oops!",
        text: "Please fill out all fields",
      });
    }

    if (!/\S+@\S+\.\S+/.test(form.email)) {
      return Swal.fire({
        icon: "warning",
        title: "Invalid Email",
        text: "Please enter a valid email address",
      });
    }

    setSubmitting(true);

    try {
      const res = await post("/api/newsletter", form);
    
      if (res.success) {
        Swal.fire({
          icon: "success",
          title: "Subscribed!",
          text: "You have successfully subscribed to our newsletter 🎉",
        });
        setForm({ name: "", email: "" });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text: data.message || "Something went wrong. Please try again.",
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Unable to submit at the moment. Please try again later.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Randomize particle positions
  const random = (min, max) => `${Math.random() * (max - min) + min}%`;

  return (
    <section className="pb-40 relative overflow-hidden">
      <Particle size={6} x={random(5, 15)} y={random(10, 25)} delay={0} />
      <Particle size={5} x={random(75, 85)} y={random(25, 35)} delay={1} />
      <Particle size={4} x={random(45, 55)} y={random(55, 65)} delay={0.5} />
      <Particle size={7} x={random(25, 35)} y={random(75, 85)} delay={1.2} />
      <Particle size={5} x={random(65, 75)} y={random(65, 75)} delay={0.8} />

      <div className="max-w-3xl mx-auto px-4 relative z-10 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-gray-900">
          Subscribe to Our Newsletter
        </h2>
        <p className="text-gray-700 mb-12">
          Get the latest updates, tips, and exclusive offers delivered directly
          to your inbox.
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row items-center gap-4 relative"
        >
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your Name"
            aria-label="Your Name"
            className="w-full sm:flex-1 px-6 py-3 rounded-2xl border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition duration-300 bg-white/80 backdrop-blur-md text-gray-900 placeholder-gray-400 relative z-10"
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email"
            aria-label="Email"
            className="w-full sm:flex-1 px-6 py-3 rounded-2xl border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition duration-300 bg-white/80 backdrop-blur-md text-gray-900 placeholder-gray-400 relative z-10"
          />
          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-3 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:scale-105 font-semibold hover:shadow-xl transition-transform duration-300 relative z-10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Submitting..." : "Subscribe"}
          </button>
        </form>
      </div>
    </section>
  );
}
