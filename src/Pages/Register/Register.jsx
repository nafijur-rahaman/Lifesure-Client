import { motion } from "framer-motion";
import { useState } from "react";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    photo: null,
  });

  const [errors, setErrors] = useState({});
  const [photoPreview, setPhotoPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo") {
      const file = files[0];
      setForm({ ...form, photo: file });
      setPhotoPreview(URL.createObjectURL(file));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const validateForm = () => {
    let newErrors = {};

    // Name
    if (!form.name.trim()) newErrors.name = "Name is required.";

    // Email
    if (!form.email) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Enter a valid email address.";
    }

    // Password
    if (!form.password) {
      newErrors.password = "Password is required.";
    } else {
      if (!/[A-Z]/.test(form.password))
        newErrors.password = "Must contain at least one uppercase letter.";
      else if (!/[a-z]/.test(form.password))
        newErrors.password = "Must contain at least one lowercase letter.";
      else if (form.password.length < 6)
        newErrors.password = "Must be at least 6 characters long.";
    }

    // Confirm Password
    if (form.confirmPassword !== form.password) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    console.log("Form submitted:", form);
    // TODO: API integration
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
            Create Your Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-5 py-3 rounded-2xl border-2 border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition bg-white/90 placeholder-gray-500"
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">{errors.name}</p>
              )}
            </div>

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

            {/* Photo Upload */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Upload Photo
              </label>
              <input
                type="file"
                name="photo"
                accept="image/*"
                onChange={handleChange}
                className="mt-2 block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
              />
              {photoPreview && (
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="mt-4 w-20 h-20 rounded-full object-cover border-4 border-indigo-500 shadow-md"
                />
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

            {/* Confirm Password */}
            <div>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full px-5 py-3 rounded-2xl border-2 border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition bg-white/90 placeholder-gray-500"
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-2xl shadow-md hover:scale-105 hover:shadow-xl transition-transform duration-300"
            >
              Register
            </button>
          </form>

          {/* Redirect */}
          <p className="text-sm text-gray-600 text-center mt-6">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-indigo-600 font-semibold hover:underline"
            >
              Login
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
