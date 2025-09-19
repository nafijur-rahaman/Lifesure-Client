import { motion } from "framer-motion";

// Simple floating particle component
const Particle = ({ size = 4, delay = 0, x = 0, y = 0 }) => (
  <motion.div
    className="absolute rounded-full bg-white/70"
    style={{ width: size, height: size, top: y, left: x }}
    animate={{ y: ["0px", "-10px", "0px"], x: ["0px", "5px", "0px"], opacity: [0.5, 1, 0.5] }}
    transition={{ repeat: Infinity, duration: 4, delay }}
  />
);

export default function PremiumNewsletter() {
  return (
    <section className="py-28 relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Floating gradient circle */}
      <motion.div
        className="absolute -top-32 left-1/2 w-[1200px] h-[600px] bg-gradient-to-r from-purple-400 via-indigo-500 to-blue-400 rounded-full opacity-20 blur-3xl -translate-x-1/2"
        animate={{ x: ["0%", "5%", "0%"] }}
        transition={{ repeat: Infinity, duration: 25, ease: "easeInOut" }}
      />

      {/* Particles */}
      <Particle size={6} x="10%" y="20%" delay={0} />
      <Particle size={5} x="80%" y="30%" delay={1} />
      <Particle size={4} x="50%" y="60%" delay={0.5} />
      <Particle size={7} x="30%" y="80%" delay={1.2} />
      <Particle size={5} x="70%" y="70%" delay={0.8} />

      <div className="max-w-3xl mx-auto px-4 relative z-10 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-gray-900">
          Subscribe to Our Newsletter
        </h2>
        <p className="text-gray-700 mb-12">
          Get the latest updates, tips, and exclusive offers delivered directly to your inbox.
        </p>

        <form className="flex flex-col sm:flex-row items-center gap-4 relative">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full sm:flex-1 px-6 py-3 rounded-2xl border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition duration-300 bg-white/80 backdrop-blur-md text-gray-900 placeholder-gray-400 relative z-10"
          />
          <button
            type="submit"
            className="px-8 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:scale-105 hover:shadow-xl transition-transform duration-300 relative z-10"
          >
            Subscribe
          </button>
        </form>

        <p className="text-gray-500 mt-6 text-sm relative z-10">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </section>
  );
}
