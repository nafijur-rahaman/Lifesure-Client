import { motion } from "framer-motion";
import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import { AuthContext } from "../../Context/AuthContext";
import { useToken } from "../../hooks/useToken";
import { useApi } from "../../hooks/UseApi";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [googleLoading, setGoogleLoading] = useState(false);
  const { setToken,setRefreshToken } = useToken();
  const { post } = useApi();

  const navigate = useNavigate();
  // const location = useLocation();

  const { LoginUser, loginWithGoogle } = useContext(AuthContext);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const validateForm = () => {
    const newErrors = {};
    if (!form.email) newErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Enter a valid email.";
    if (!form.password) newErrors.password = "Password is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Function to redirect based on role
  const redirectByRole = (role) => {
    switch (role) {
      case "admin":
        navigate("/admin-dashboard");
        break;
      case "agent":
        navigate("/agent-dashboard");
        break;
      case "customer":
      default:
        navigate("/");
        break;
    }
  };

  // Handle email/password login
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const result = await LoginUser(form.email, form.password);

      console.log("aci");
      // Call backend to get user data
      const { data } = await post("/api/user-info", { email: form.email });
      console.log("data", data);
      const user = data; // backend returns full user object including role
      console.log(user);

      Swal.fire({
        icon: "success",
        title: "Welcome Back!",
        text: `Logged in as ${user?.name || user?.email}`,
        timer: 2000,
        showConfirmButton: false,
      });
      const resToken = await post("/api/login", { email: form.email });
      if (resToken?.accessToken && resToken?.refreshToken) {
        setToken(resToken.accessToken);
        setRefreshToken(resToken.refreshToken);
      }

      redirectByRole(user?.role); // redirect based on role
    } catch (err) {
      Swal.fire({ icon: "error", title: "Login Failed", text: err.message });
    }
  };

  // Handle Google login
  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      const res = await loginWithGoogle();

      if (res.user) {
        const { email, displayName } = res.user;

        await post("/api/users", {
          name: displayName,
          email,
          role: "customer", // default role
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
        });

        Swal.fire({
          icon: "success",
          title: "Welcome!",
          text: `Logged in as ${displayName || "User"} via Google`,
          timer: 2000,
          showConfirmButton: false,
        });
        const resToken = await post("/api/login", { email });
        if (resToken?.token) {
          const token = resToken.token;
          setToken(token);
        }

        navigate("/");
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Google Login Failed",
        text: err.message,
      });
    } finally {
      setGoogleLoading(false);
    }
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
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-2xl shadow-md hover:scale-105 hover:shadow-xl transition-transform duration-300"
            >
              Login
            </button>
          </form>

          <div className="mt-6 space-y-3">
            <motion.button
              onClick={handleGoogleLogin}
              disabled={googleLoading}
              className="w-full py-3 border border-gray-300 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-100 transition disabled:opacity-50"
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
