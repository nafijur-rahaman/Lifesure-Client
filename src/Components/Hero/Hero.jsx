import { useContext, useState, useEffect } from "react";

import "./style.css"
import { ThemeContext } from "../../Context/ThemeContext";
const slides = [
  {
    heading: "Your Safety, Our Priority",
    tagline: "Reliable coverage that grows with you.",
    bg: "/hero3.jpg",
  },
  {
    heading: "Plan Ahead, Live Worry-Free",
    tagline: "Customized insurance solutions for every stage of life.",
    bg: "/hero2.jpg",
  },
  {
    heading: "Secure Your Tomorrow Today",
    tagline: "Protect your family with our trusted insurance plans.",
    bg: "/hero1.jpg",
  },
];

export default function Hero() {
  const { theme } = useContext(ThemeContext);
  const [current, setCurrent] = useState(0);
  const textColor = theme === "dark" ? "text-gray-900" : "text-gray-100";

  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full h-[80vh] md:h-[90vh] overflow-hidden">
      {slides.map((slide, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            idx === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
          style={{
            backgroundImage: `url(${slide.bg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="w-full h-full bg-black/30 flex items-center justify-center">
            <div className="text-center px-6 md:px-12 max-w-2xl animate-fadeIn">
              <h1
                className={`text-3xl md:text-5xl font-bold mb-4 ${textColor} transition-transform duration-500 transform hover:scale-105`}
              >
                {slide.heading}
              </h1>
              <p className={`mb-6 text-lg md:text-2xl ${textColor}`}>
                {slide.tagline}
              </p>
              <a
                href="#"
                className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-xl text-white px-8 py-3 rounded-3xl shadow-lg hover:opacity-90 transition transform hover:scale-105"
              >
                Get a Free Quote
              </a>
            </div>
          </div>
        </div>
      ))}

      {/* Optional indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-3 h-3 rounded-full transition-all ${
              idx === current
                ? "bg-indigo-600 dark:bg-indigo-400"
                : "bg-gray-300 dark:bg-gray-600"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

