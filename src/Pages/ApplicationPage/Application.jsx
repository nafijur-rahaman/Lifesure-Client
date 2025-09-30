import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Confetti from "react-confetti";
import { useApi } from "../../hooks/UseApi";
import { useParams } from "react-router";
import Swal from "sweetalert2";
import useAuth from "../../hooks/UseAuth";
import { useNavigate } from "react-router";

export default function Application() {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.displayName || "",
    email: user?.email || "",
    address: "",
    nid: "",
    phone: "",
    nomineeName: "",
    nomineeRelation: "",
    health: [],
    frequency: "monthly", // default
  });

  const [submitted, setSubmitted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { post } = useApi();
  const { id } = useParams();

  const healthOptions = [
    "Heart Disease",
    "Diabetes",
    "High Blood Pressure",
    "Asthma",
    "Other",
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        health: checked
          ? [...prev.health, value]
          : prev.health.filter((h) => h !== value),
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
    // Attach the current policy ID
    const payload = { ...formData, policy_id: id };

    try {
      // Call backend API
      const res = await post("/api/submit-application", payload);

      if (res?.success) {
        setSubmitted(true);
        setShowConfetti(true);

        setTimeout(() => setShowConfetti(false), 4000);

        setTimeout(() => navigate("/policies"), 4000);
        //console.log("Application submitted successfully:", res.data);
      } else {
        console.error("Submission failed:", res?.message);
        Swal.fire({
          icon: "error",
          title: "Submission Failed",
          text: res?.message || "Something went wrong",
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Submission Error",
        text: err.message || "Server error",
      });
    }
  };

  const stepTitles = ["Personal", "Nominee", "Health"];

  return (
    <section className="relative py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-pink-50 min-h-screen overflow-hidden">
      {/* Confetti */}
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          numberOfPieces={200}
          recycle={false}
        />
      )}

      {/* Floating background shapes */}
      <motion.div
        animate={{ x: [-40, 40, -40], y: [-20, 20, -20] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 left-1/3 w-72 h-72 bg-indigo-200 rounded-full opacity-20 blur-3xl"
      />
      <motion.div
        animate={{ x: [30, -30, 30], y: [10, -10, 10] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-0 right-1/3 w-80 h-80 bg-pink-300 rounded-full opacity-20 blur-3xl"
      />

      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-extrabold text-gray-900 text-center mb-12"
        >
          Policy Application Form
        </motion.h1>

        {!submitted ? (
          <>
            {/* Sticky Premium Style Progress Bar with Icons */}
            <div className="sticky top-6 z-20 mb-6 flex flex-col gap-2">
              <div className="flex justify-between items-center mb-2">
                {stepTitles.map((t, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      scale: step === i + 1 ? 1.2 : 1,
                      rotate: step === i + 1 ? [0, 5, -5, 0] : 0,
                    }}
                    className={`flex flex-col items-center transition`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full ${
                        step === i + 1
                          ? "bg-indigo-600 shadow-lg"
                          : "bg-gray-300"
                      }`}
                    />
                    <span
                      className={`text-xs font-semibold mt-1 ${
                        step === i + 1 ? "text-indigo-600" : "text-gray-400"
                      }`}
                    >
                      {t}
                    </span>
                  </motion.div>
                ))}
              </div>
              <div className="h-2 w-full bg-gray-200 rounded-full">
                <motion.div
                  className="h-2 bg-indigo-600 rounded-full"
                  animate={{ width: `${(step / 3) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Form Steps */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="backdrop-blur-md bg-white/70 rounded-3xl p-8 shadow-xl space-y-6"
            >
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-4"
                  >
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Full Name"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />

                    <input
                      type="email"
                      name="email"
                      value={formData.email || user?.email || ""}
                      onChange={handleChange}
                      placeholder="Email"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      readOnly
                    />

                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Address"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                    <input
                      type="text"
                      name="nid"
                      value={formData.nid}
                      onChange={handleChange}
                      placeholder="NID No"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Phone Number"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />

                    <div className="space-y-2">
                      <label className="font-semibold text-gray-700">
                        Payment Frequency
                      </label>
                      <select
                        name="frequency"
                        value={formData.frequency || "monthly"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            frequency: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      >
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                      </select>
                    </div>
                  </motion.div>
                )}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-4"
                  >
                    <input
                      type="text"
                      name="nomineeName"
                      value={formData.nomineeName}
                      onChange={handleChange}
                      placeholder="Nominee Name"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                    <input
                      type="text"
                      name="nomineeRelation"
                      value={formData.nomineeRelation}
                      onChange={handleChange}
                      placeholder="Relationship"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                  </motion.div>
                )}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-4"
                  >
                    <h2 className="text-xl font-bold text-gray-800">
                      Health Disclosure
                    </h2>
                    <div className="flex flex-wrap gap-3">
                      {healthOptions.map((h) => (
                        <label
                          key={h}
                          className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-xl cursor-pointer hover:bg-gray-200 transition"
                        >
                          <input
                            type="checkbox"
                            name="health"
                            value={h}
                            checked={formData.health.includes(h)}
                            onChange={handleChange}
                            className="form-checkbox h-5 w-5 text-indigo-600"
                          />
                          {h}
                        </label>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-6">
                {step > 1 ? (
                  <button
                    onClick={prevStep}
                    className="px-6 py-2 bg-gray-300 rounded-xl font-semibold hover:bg-gray-400 transition"
                  >
                    Back
                  </button>
                ) : (
                  <div />
                )}
                {step < 3 ? (
                  <button
                    onClick={nextStep}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="px-6 py-2 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition"
                  >
                    Submit
                  </button>
                )}
              </div>
            </motion.div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center p-12 bg-white/70 backdrop-blur-md rounded-3xl shadow-xl"
          >
            <h2 className="text-3xl font-bold text-green-700 mb-4">
              Application Submitted!
            </h2>
            <p className="text-gray-700 text-lg">
              Your policy application has been submitted and is now pending
              approval.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
