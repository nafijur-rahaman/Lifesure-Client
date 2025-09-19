import { motion } from "framer-motion";
import { useState } from "react";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let newErrors = {};
    if (!form.email) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Enter a valid email address.";
    }
    if (!form.password) newErrors.password = "Password is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    console.log("Login submitted:", form);
    // TODO: API call for login
  };

  return (
    <section className="py-28 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
      {/* Floating gradient backdrop */}
      <motion.div
        className="absolute -top-40 left-1/2 w-[1400px] h-[700px] bg-gradient-to-r from-purple-400 via-indigo-500 to-blue-400 rounded-full opacity-20 blur-3xl -translate-x-1/2"
        animate={{ x: ["0%", "5%", "0%"] }}
        transition={{ repeat: Infinity, duration: 25, ease: "easeInOut" }}
      />

      <div className="max-w-md mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-gray-200"
        >
          <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-6">
            Welcome Back
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                className="w-full px-5 py-3 rounded-2xl border-2 border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition bg-white/90 placeholder-gray-500"
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="w-full px-5 py-3 rounded-2xl border-2 border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition bg-white/90 placeholder-gray-500"
              />
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">{errors.password}</p>
              )}
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <a
                href="/forgot-password"
                className="text-sm text-indigo-600 hover:underline"
              >
                Forgot Password?
              </a>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-2xl shadow-md hover:scale-105 hover:shadow-xl transition-transform duration-300"
            >
              Login
            </button>
          </form>

          {/* Redirect */}
          <p className="text-sm text-gray-600 text-center mt-6">
            Don’t have an account?{" "}
            <a
              href="/register"
              className="text-indigo-600 font-semibold hover:underline"
            >
              Register
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
