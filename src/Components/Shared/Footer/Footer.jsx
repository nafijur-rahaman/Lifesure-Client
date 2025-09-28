import { useContext } from "react";
import { ThemeContext } from "../../../Context/ThemeContext";
import { Shield, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

export default function Footer() {
  const { theme } = useContext(ThemeContext);

  // Dynamic theme-based classes
  const bgColor = theme === "dark" ? "bg-gray-900" : "bg-white";
  const textColor = theme === "dark" ? "text-gray-300" : "text-gray-700";
  const borderColor = theme === "dark" ? "border-gray-700" : "border-gray-300";
  const hoverText = theme === "dark" ? "hover:text-indigo-400" : "hover:text-indigo-600";
  const socialBg = theme === "dark" ? "bg-gray-800" : "bg-gray-200";
  const socialHover = theme === "dark" ? "hover:bg-indigo-500" : "hover:bg-indigo-600";

  return (
    <footer className={`${bgColor} ${textColor}`}>
      <div className={`max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10 border-t ${borderColor}`}>
        
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Shield className={`w-7 h-7 text-indigo-600`} />
            <span className={`text-xl font-bold ${textColor}`}>
              LifeSecure
            </span>
          </div>
          <p className={`text-sm leading-relaxed ${textColor}`}>
            Protecting your future with trusted insurance plans tailored to your needs.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className={`text-lg font-semibold mb-4 ${textColor}`}>
            Quick Links
          </h3>
          <ul className="space-y-2">
            {["Home", "About Us", "Services", "Plans", "Contact"].map((item) => (
              <li key={item}>
                <a href="#" className={`transition ${hoverText}`}>
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className={`text-lg font-semibold mb-4 ${textColor}`}>
            Contact Us
          </h3>
          <ul className={`space-y-2 text-sm ${textColor}`}>
            <li>📍 123 Main Street, Dhaka, Bangladesh</li>
            <li>📞 +880 123 456 789</li>
            <li>✉️ support@lifesecure.com</li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 className={`text-lg font-semibold mb-4 ${textColor}`}>
            Legal
          </h3>
          <ul className="space-y-2">
            {["Privacy Policy", "Terms of Service", "Disclaimer"].map((item) => (
              <li key={item}>
                <a href="#" className={`transition ${hoverText}`}>
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={`border-t ${borderColor} mt-6`}>
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Social Icons */}
          <div className="flex gap-4">
            {[Facebook, Twitter, Linkedin, Instagram].map((Icon, idx) => (
              <a
                key={idx}
                href="#"
                className={`p-2 rounded-full ${socialBg} ${socialHover} hover:text-white transition`}
              >
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>

          {/* Copyright */}
          <p className={`text-sm ${textColor}`}>
            © {new Date().getFullYear()} LifeSecure Insurance. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
