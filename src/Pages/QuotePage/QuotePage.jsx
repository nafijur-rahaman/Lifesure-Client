import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti"; // npm i react-confetti
import { Tooltip } from "react-tooltip";

export default function QuotePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    age: 25,
    gender: "Male",
    coverage: 2000000,
    duration: 20,
    smoker: "No",
  });
  const [premium, setPremium] = useState({ monthly: 0, annual: 0 });
  const [confetti, setConfetti] = useState(false);

  // Premium calculation
  useEffect(() => {
    const { age, coverage, duration, smoker } = formData;
    const base = 500;
    const ageFactor = age * 5;
    const coverageFactor = coverage / 10000;
    const durationFactor = duration * 2;
    const smokerFactor = smoker === "Yes" ? 1.5 : 1;
    const monthly = Math.round((base + ageFactor + coverageFactor + durationFactor) * smokerFactor);
    setPremium({ monthly, annual: monthly * 12 });

    // Trigger confetti for high coverage or long duration
    if (coverage >= 4000000 || duration >= 25) {
      setConfetti(true);
      setTimeout(() => setConfetti(false), 3000);
    }
  }, [formData]);

  const handleChange = (field, value) => setFormData({ ...formData, [field]: value });

  return (
    <section className="relative py-20 min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-pink-50">

      {/* Floating background gradients */}
      <motion.div animate={{ x: [-50,50,-50], y:[-30,30,-30] }} transition={{ duration:20, repeat:Infinity, ease:"easeInOut" }} className="absolute top-0 left-1/4 w-72 h-72 bg-indigo-200 rounded-full opacity-20 blur-3xl"></motion.div>
      <motion.div animate={{ x: [30,-30,30], y:[20,-20,20] }} transition={{ duration:25, repeat:Infinity, ease:"easeInOut" }} className="absolute bottom-0 right-1/3 w-80 h-80 bg-pink-300 rounded-full opacity-20 blur-3xl"></motion.div>

      {/* Confetti */}
      {confetti && <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} numberOfPieces={150}/>}

      <div className="max-w-3xl mx-auto px-4 relative z-10">
        <motion.h1 initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.8 }} className="text-4xl font-extrabold text-gray-900 text-center mb-12">
          Get Your Life Insurance Quote
        </motion.h1>

        {/* Form */}
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.8, delay:0.2 }} className="backdrop-blur-md bg-white/70 rounded-3xl p-8 shadow-xl space-y-6">
          
          {/* Age Slider */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Age <span className="text-sm text-gray-400" data-tooltip-id="ageTip">ℹ️</span>
            </label>
            <input type="range" min="18" max="65" value={formData.age} onChange={(e)=>handleChange("age", Number(e.target.value))} className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gradient-to-r from-indigo-400 to-indigo-600"/>
            <p className="text-right text-gray-600 mt-1">{formData.age} years</p>
            <Tooltip id="ageTip" place="top" effect="solid">Your current age (18-65)</Tooltip>
          </div>

          {/* Gender Toggle */}
          <div className="flex items-center gap-4">
            <span className="text-gray-700 font-semibold">Gender <span className="text-sm text-gray-400" data-tooltip-id="genderTip">ℹ️</span>:</span>
            {["Male","Female","Other"].map(g => (
              <button key={g} onClick={()=>handleChange("gender", g)} className={`px-4 py-2 rounded-xl font-semibold transition ${formData.gender===g?'bg-indigo-600 text-white shadow-lg':'bg-white shadow hover:bg-indigo-50 text-gray-700'}`}>
                {g}
              </button>
            ))}
            <Tooltip id="genderTip" place="top" effect="solid">Select your gender</Tooltip>
          </div>

          {/* Coverage Slider */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Coverage Amount (₹) <span className="text-sm text-gray-400" data-tooltip-id="coverageTip">ℹ️</span></label>
            <input type="range" min="500000" max="5000000" step="50000" value={formData.coverage} onChange={(e)=>handleChange("coverage", Number(e.target.value))} className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gradient-to-r from-green-400 to-green-600"/>
            <p className="text-right text-gray-600 mt-1">₹{formData.coverage.toLocaleString()}</p>
            <Tooltip id="coverageTip" place="top" effect="solid">Desired coverage amount</Tooltip>
          </div>

          {/* Duration Slider */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Duration (Years) <span className="text-sm text-gray-400" data-tooltip-id="durationTip">ℹ️</span></label>
            <input type="range" min="5" max="30" step="1" value={formData.duration} onChange={(e)=>handleChange("duration", Number(e.target.value))} className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gradient-to-r from-pink-400 to-pink-600"/>
            <p className="text-right text-gray-600 mt-1">{formData.duration} years</p>
            <Tooltip id="durationTip" place="top" effect="solid">Policy duration in years</Tooltip>
          </div>

          {/* Smoker Toggle */}
          <div className="flex items-center gap-4">
            <span className="text-gray-700 font-semibold">Smoker <span className="text-sm text-gray-400" data-tooltip-id="smokerTip">ℹ️</span>:</span>
            {["No","Yes"].map(s => (
              <button key={s} onClick={()=>handleChange("smoker", s)} className={`px-4 py-2 rounded-xl font-semibold transition ${formData.smoker===s?'bg-indigo-600 text-white shadow-lg':'bg-white shadow hover:bg-indigo-50 text-gray-700'}`}>
                {s}
              </button>
            ))}
            <Tooltip id="smokerTip" place="top" effect="solid">Select if you are a smoker</Tooltip>
          </div>
        </motion.div>

        {/* Floating Premium Box */}
        <AnimatePresence mode="wait">
          <motion.div key={premium.monthly} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:10 }} transition={{ duration:0.5 }} className={`fixed right-6 top-32 md:w-72 bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-2xl space-y-3 z-50 transition-transform hover:scale-105 ${premium.monthly > 2000 ? "ring-2 ring-indigo-400" : ""}`}>
            <h2 className="text-xl font-bold text-gray-900 text-center">Estimated Premium</h2>
            <p className="text-gray-700 text-lg text-center">Monthly: <span className="font-semibold">₹{premium.monthly}</span></p>
            <p className="text-gray-700 text-lg text-center">Annual: <span className="font-semibold">₹{premium.annual}</span></p>
            <motion.button whileHover={{ scale:1.05, boxShadow: "0 0 20px rgba(59,130,246,0.5)" }} whileTap={{ scale:0.95 }} onClick={() => navigate("/application")} className="w-full mt-2 py-2 bg-indigo-600 text-white rounded-xl font-semibold shadow-lg transition">
              Apply for Policy
            </motion.button>
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
}
