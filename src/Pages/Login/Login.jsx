import { motion } from "framer-motion";
import { useContext, useState } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../../Context/AuthContext";
import { useToken } from "../../hooks/useToken";
import { useApi } from "../../hooks/UseApi";
import { useLocation, useNavigate } from "react-router";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [googleLoading, setGoogleLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [quickLoading, setQuickLoading] = useState(false);
  const path = useLocation();
  const navigate = useNavigate();

  const { setToken, setRefreshToken } = useToken();
  const { post } = useApi();
  const { LoginUser, loginWithGoogle } = useContext(AuthContext);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const validateForm = () => {
    const newErrors = {};
    if (!form.email) newErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Enter a valid email.";
    if (!form.password) newErrors.password = "Password is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Normal email/password login
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await LoginUser(form.email, form.password);
      const resToken = await post("/api/login", { email: form.email });

      if (resToken?.accessToken && resToken?.refreshToken) {
        setToken(resToken.accessToken);
        setRefreshToken(resToken.refreshToken);
      }

      Swal.fire({
        icon: "success",
        title: "Welcome Back!",
        text: `Logged in as ${form.email}`,
        timer: 2000,
        showConfirmButton: false,
      });

      navigate(path.state || "/");
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Login failed";
      Swal.fire({ icon: "error", title: "Login Failed", text: message });
    } finally {
      setLoading(false);
    }
  };

  // Google login
  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      const res = await loginWithGoogle();

      if (res.user) {
        const { email, displayName, photoURL } = res.user;

        await post("/api/users", {
          name: displayName,
          email,
          userPhoto: photoURL,
          role: "customer",
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
        });

        const resToken = await post("/api/login", { email });
        if (resToken?.accessToken && resToken?.refreshToken) {
          setToken(resToken.accessToken);
          setRefreshToken(resToken.refreshToken);
        }
        Swal.fire({
          icon: "success",
          title: "Welcome!",
          text: `Logged in as ${displayName || "User"} via Google`,
          timer: 2000,
          showConfirmButton: false,
        });

        navigate(path.state || "/");
      }
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Google login failed";
      Swal.fire({ icon: "error", title: "Google Login Failed", text: message });
    } finally {
      setGoogleLoading(false);
    }
  };

  const quickLogins = {
    admin: {
      email: import.meta.env.VITE_ADMIN_EMAIL,
      password: import.meta.env.VITE_PASSWORD,
    },
    agent: {
      email: import.meta.env.VITE_AGENT_EMAIL,
      password: import.meta.env.VITE_PASSWORD,
    },
    customer: {
      email: import.meta.env.VITE_CUSTOMER_EMAIL,
      password: import.meta.env.VITE_PASSWORD,
    },
  };

  const handleQuickLogin = async (role) => {
    const creds = quickLogins[role];
    if (!creds?.email || !creds?.password) {
      Swal.fire({
        icon: "error",
        title: "Missing .env credentials",
        text: `Please check your .env file for ${role.toUpperCase()} credentials.`,
      });
      return;
    }

    setQuickLoading(role);

    try {
      await LoginUser(creds.email, creds.password);
      const resToken = await post("/api/login", { email: creds.email });

      if (resToken?.accessToken && resToken?.refreshToken) {
        setToken(resToken.accessToken);
        setRefreshToken(resToken.refreshToken);
      }

      Swal.fire({
        icon: "success",
        title: `Logged in as ${role.toUpperCase()}`,
        text: `${creds.email}`,
        timer: 1800,
        showConfirmButton: false,
      });

      navigate(path.state || "/");
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        `Quick login for ${role} failed`;
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: message,
      });
    } finally {
      setQuickLoading(false);
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
            Welcome Back
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
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

            <div className="text-right">
              <a
                href="/forgot-password"
                className="text-sm text-indigo-600 hover:underline"
              >
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-3xl shadow-md hover:scale-105 hover:shadow-xl transition-transform duration-300 disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Instant Role Login Buttons */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 mb-3">Quick Login as:</p>
            <div className="flex justify-center items-center gap-3">
              <button
                onClick={() => handleQuickLogin("admin")}
                disabled={quickLoading === "admin"}
                className="w-1/4 py-2 border-indigo-600  hover:text-indigo-600 cursor-pointer border-2 rounded-3xl font-semibold hover:scale-105 transition-transform duration-300 disabled:opacity-50"
              >
                {quickLoading === "admin" ? "Logging..." : "Admin"}
              </button>
              <button
                onClick={() => handleQuickLogin("agent")}
                disabled={quickLoading === "agent"}
                className="w-1/4 py-2 border-indigo-600  hover:text-indigo-600 cursor-pointer border-2 rounded-4xl font-semibold hover:scale-105 transition-transform duration-300 disabled:opacity-50"
              >
                {quickLoading === "agent" ? "Logging..." : "Agent"}
              </button>
              <button
                onClick={() => handleQuickLogin("customer")}
                disabled={quickLoading === "customer"}
                className="w-1/4 py-2 border-indigo-600  hover:text-indigo-600 cursor-pointer border-2 rounded-3xl font-semibold hover:scale-105 transition-transform duration-300 disabled:opacity-50"
              >
                {quickLoading === "customer" ? "Logging..." : "Customer"}
              </button>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <motion.button
              onClick={handleGoogleLogin}
              disabled={googleLoading}
              className="w-full py-3 border border-gray-300 rounded-3xl flex items-center justify-center gap-3 hover:bg-gray-100 transition disabled:opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img src="/google.png" alt="Google" className="w-6 h-6" />
              {googleLoading ? "Signing in..." : "Continue with Google"}
            </motion.button>
          </div>

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
