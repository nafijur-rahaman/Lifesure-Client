import { motion } from "framer-motion";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../Context/AuthContext";
import Swal from "sweetalert2";
import { useLocation, useNavigate } from "react-router";
import { useApi } from "../../hooks/UseApi";
import { useToken } from "../../hooks/useToken";
import axios from "axios";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    photo: null, // file object
  });
  const [errors, setErrors] = useState({});
  const [googleLoading, setGoogleLoading] = useState(false);
  const { RegisterUser, updateUserProfile } = useContext(AuthContext);
  const { post } = useApi();
  const { setToken, setRefreshToken } = useToken();
  const navigate = useNavigate();
  const path = useLocation();

  // -------------------- Validation --------------------
  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "name":
        if (!value.trim()) error = "Name is required.";
        break;
      case "email":
        if (!value) error = "Email is required.";
        else if (!/\S+@\S+\.\S+/.test(value))
          error = "Enter a valid email address.";
        break;
      case "password":
        if (!value) error = "Password is required.";
        else if (!/[A-Z]/.test(value))
          error = "Must contain at least one uppercase letter.";
        else if (!/[a-z]/.test(value))
          error = "Must contain at least one lowercase letter.";
        else if (value.length < 6) error = "Must be at least 6 characters.";
        break;
      case "confirmPassword":
        if (value !== form.password) error = "Passwords do not match.";
        break;
      default:
        break;
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
    return error === "";
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    const val = files ? files[0] : value;
    setForm({ ...form, [name]: val });
    validateField(name, val);
  };

  const validateForm = () => {
    let valid = true;
    Object.keys(form).forEach((field) => {
      if (field !== "photo") {
        const fieldValid = validateField(field, form[field]);
        if (!fieldValid) valid = false;
      }
    });
    return valid;
  };

  // -------------------- Upload Image --------------------
  const uploadImage = async (file) => {
    if (!file) return "";
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMAGE_BB_KEY}`,
        formData
      );
      return res?.data?.data?.url || "";
    } catch {
      Swal.fire("Upload Failed", "Could not upload image", "error");
      return "";
    }
  };

  // -------------------- Handle Submit --------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    let photoUrl = "";
    if (form.photo) photoUrl = await uploadImage(form.photo);

    const { name, email, password } = form;

    try {
      const res = await RegisterUser(email, password);

      if (res.user) {
        await updateUserProfile(name, photoUrl);

        Swal.fire({
          icon: "success",
          title: "Registration Successful!",
          text: `Welcome, ${name}!`,
          timer: 2000,
          showConfirmButton: false,
        });

        const resToken = await post("/api/login", { email });
        if (resToken?.accessToken && resToken?.refreshToken) {
          setToken(resToken.accessToken);
          setRefreshToken(resToken.refreshToken);
        }

          await post("/api/users", {
          name,
          email,
          userPhoto: photoUrl,
          role: "customer",
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
        });

        setForm({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          photo: null,
        });

        navigate(path.state || "/");
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message,
      });
    }
  };

  
  return (
    <section className="py-28 relative overflow-hidden">
      <motion.div
        className="absolute -top-40 left-1/2 w-[1400px] h-[700px] rounded-full opacity-20 blur-3xl -translate-x-1/2"
        animate={{ x: ["0%", "5%", "0%"] }}
        transition={{ repeat: Infinity, duration: 25, ease: "easeInOut" }}
      />

      <div className="max-w-md mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/40 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-gray-200"
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

            {/* Photo */}
            <div>
              <input
                type="file"
                name="photo"
                accept="image/*"
                onChange={handleChange}
                className="w-full px-5 py-3 rounded-2xl border-2 border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition bg-white/90 placeholder-gray-500"
              />
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
              onClick={() => handleSubmit()}
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
