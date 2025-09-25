import { useState, useEffect, useContext } from "react";
import { Menu, X, Shield, ChevronDown, User } from "lucide-react";
import ThemeSwitcher from "../../Switcher/ThemeSwitcher";
import { ThemeContext } from "../../../Context/ThemeContext";
import { NavLink, useNavigate } from "react-router";
import { AuthContext } from "../../../Context/AuthContext";
import useUserRole from "../../../hooks/UserRole";

export default function Navbar() {
  const { theme } = useContext(ThemeContext);
  const { user, LogoutUser } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("Home");
  const navigate = useNavigate();

  const { role, roleLoading } = useUserRole();

  console.log(role);
  console.log(user)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Blogs", href: "/blogs" },
    {
      name: "Services",
      dropdown: [
        { name: "Life Insurance", href: "/services/life" },
        { name: "Health Insurance", href: "/services/health" },
        { name: "Retirement Planning", href: "/services/retirement" },
        { name: "Business Insurance", href: "/services/business" },
      ],
    },
    {
      name: "Plans",
      dropdown: [
        { name: "Basic Plan", href: "/plans/basic" },
        { name: "Family Plan", href: "/plans/family" },
        { name: "Premium Plan", href: "/plans/premium" },
      ],
    },
    { name: "Contact", href: "/contact" },
  ];

  const handleLinkClick = (name) => {
    setActive(name);
    setOpenDropdown(null);
    setIsOpen(false);
  };

  const toggleDropdown = (name) => setOpenDropdown(openDropdown === name ? null : name);

  const bgColor = scrolled
    ? theme === "dark"
      ? "bg-gray-900 shadow-md backdrop-blur-lg py-4"
      : "bg-white/90 shadow-md backdrop-blur-lg py-4"
    : theme === "dark"
    ? "bg-gray-900/80 backdrop-blur-lg py-4"
    : "bg-white/70 backdrop-blur-lg py-4";

  const textColor = theme === "dark" ? "text-gray-200" : "text-gray-700";
  const hoverTextColor = theme === "dark" ? "hover:text-indigo-400" : "hover:text-indigo-600";
  const dropdownBg = theme === "dark" ? "bg-gray-800" : "bg-white";
  const dropdownHoverBg = theme === "dark" ? "hover:bg-gray-700" : "hover:bg-indigo-50";

  const handleLogout = () => {
    LogoutUser();
    navigate("/");
  };

  // Return the correct dashboard route based on role
  const dashboardRoute = () => {
    if (roleLoading || !role) return "/";
    switch (role) {
      case "admin":
        return "/admin-dashboard";
      case "agent":
        return "/agent-dashboard";
      case "customer":
      default:
        return "/client-dashboard";
    }
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-colors duration-500 animate-fadeDown ${bgColor}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Shield className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
          <span className={`text-xl font-bold ${textColor}`}>LifeSecure</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 relative">
          {navLinks.map((link) =>
            link.dropdown ? (
              <div key={link.name} className="relative">
                <button
                  onClick={() => toggleDropdown(link.name)}
                  className={`flex items-center gap-1 font-medium transition ${
                    active === link.name ? "text-indigo-600" : textColor
                  } ${hoverTextColor}`}
                >
                  {link.name}
                  <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === link.name ? "rotate-180" : ""}`} />
                </button>
                {openDropdown === link.name && (
                  <div className={`absolute left-0 mt-2 w-56 ${dropdownBg} shadow-lg rounded-lg py-2 z-50 animate-fadeIn`}>
                    {link.dropdown.map((item) => (
                      <NavLink
                        key={item.name}
                        to={item.href}
                        onClick={() => handleLinkClick(link.name)}
                        className={`block px-4 py-2 ${textColor} ${hoverTextColor} ${dropdownHoverBg} transition`}
                      >
                        {item.name}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <NavLink
                key={link.name}
                to={link.href}
                onClick={() => handleLinkClick(link.name)}
                className={`relative font-medium transition group ${
                  active === link.name ? "text-indigo-600" : textColor
                } ${hoverTextColor}`}
              >
                {link.name}
                {active === link.name && <span className="absolute left-0 -bottom-1 h-[2px] w-full bg-indigo-600" />}
              </NavLink>
            )
          )}
        </div>

        {/* Right Side - Auth */}
        <div className="hidden md:flex items-center gap-4">
          <ThemeSwitcher />
          {user ? (
            <div className="flex items-center gap-3">
              <span className={`flex items-center gap-1 font-medium ${textColor}`}>
                <User className="w-4 h-4" /> {user.name || user.email}
              </span>
              <NavLink
                to={dashboardRoute()}
                className="rounded-full bg-indigo-600 text-white px-5 py-2 shadow-lg hover:bg-indigo-700 transition"
              >
                Dashboard
              </NavLink>
              <button
                onClick={handleLogout}
                className={`rounded-full border px-5 py-2 transition ${
                  theme === "dark" ? "border-gray-600 hover:bg-gray-800" : "border-gray-300 hover:bg-gray-100"
                }`}
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <NavLink
                to="/login"
                className={`rounded-full border px-5 py-2 transition ${
                  theme === "dark" ? "border-gray-600 hover:bg-gray-800" : "border-gray-300 hover:bg-gray-100"
                }`}
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className="rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2 shadow-lg hover:opacity-90 transition"
              >
                Register
              </NavLink>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className={`md:hidden p-2 rounded-lg transition ${theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-100"}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className={`md:hidden ${dropdownBg} shadow-lg px-6 py-4 flex flex-col gap-4 animate-slideDown`}>
          {navLinks.map((link) =>
            link.dropdown ? (
              <details
                key={link.name}
                className="group"
                open={openDropdown === link.name}
                onClick={() => toggleDropdown(link.name)}
              >
                <summary
                  className={`flex items-center justify-between cursor-pointer font-medium transition ${
                    active === link.name ? "text-indigo-600" : textColor
                  } ${hoverTextColor}`}
                >
                  {link.name}
                  <ChevronDown
                    className={`w-4 h-4 transition group-open:rotate-180 ${
                      openDropdown === link.name ? "rotate-180" : ""
                    }`}
                  />
                </summary>
                <div className="mt-2 pl-4 flex flex-col gap-2 animate-fadeIn">
                  {link.dropdown.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      onClick={() => handleLinkClick(link.name)}
                      className={`text-gray-700 dark:text-gray-200 ${hoverTextColor} ${dropdownHoverBg} px-4 py-2 transition`}
                    >
                      {item.name}
                    </NavLink>
                  ))}
                </div>
              </details>
            ) : (
              <NavLink
                key={link.name}
                to={link.href}
                onClick={() => handleLinkClick(link.name)}
                className={`font-medium transition ${active === link.name ? "text-indigo-600" : textColor} ${hoverTextColor}`}
              >
                {link.name}
              </NavLink>
            )
          )}

          {/* Auth Section - Mobile */}
          <div className="flex flex-col gap-3 mt-4">
            {user ? (
              <>
                <span className={`flex items-center gap-1 font-medium ${textColor}`}>
                  <User className="w-4 h-4" /> {user.name || user.email}
                </span>
                <NavLink
                  to={dashboardRoute()}
                  className="rounded-full bg-indigo-600 text-white px-5 py-2 shadow-lg hover:bg-indigo-700 transition text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </NavLink>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className={`rounded-full border px-5 py-2 text-center transition ${
                    theme === "dark" ? "border-gray-600 hover:bg-gray-800" : "border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={`rounded-full border px-5 py-2 text-center transition ${
                    theme === "dark" ? "border-gray-600 hover:bg-gray-800" : "border-gray-300 hover:bg-gray-100"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2 shadow-lg hover:opacity-90 transition text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Register
                </NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
