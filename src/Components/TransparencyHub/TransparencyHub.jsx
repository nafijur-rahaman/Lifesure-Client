import React, { useEffect } from 'react';
import { motion, useInView, useAnimate, useSpring } from 'framer-motion';
import { ShieldCheck, Star, TrendingUp, Users } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

// Animated Counter Sub-Component
function AnimatedCounter({ to, icon, label, unit = '', prefix = '' }) {
  const [scope, animate] = useAnimate();
  const isInView = useInView(scope, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      animate(scope.current, { innerHTML: to }, {
        duration: 2,
        // Using a custom spring animation for the number
        onUpdate: (latest) => {
          scope.current.innerHTML = prefix + Math.round(latest).toLocaleString() + unit;
        }
      });
    }
  }, [isInView, to, animate, scope, unit, prefix]);

  return (
    <div className="text-center">
      {icon}
      <p className="mt-2 text-5xl font-extrabold text-slate-900">
        <span ref={scope}>0</span>
      </p>
      <p className="mt-2 text-base text-slate-600">{label}</p>
    </div>
  );
}

export default function TransparencyHub() {
  return (
<div className="bg-slate-50 pb-20 sm:pb-32">
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-3xl text-center">
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 font-serif">
        Our Commitment to Transparency
      </h2>
      <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-6 sm:leading-8 text-slate-700">
        We believe trust is earned. That's why we operate with complete clarity, from our
        financial strength to our customer reviews and performance metrics.
      </p>
    </div>

    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="mt-12 sm:mt-20 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8"
    >
      {/* Main Card: Financial Strength */}
      <motion.div
        variants={itemVariants}
        className="rounded-3xl bg-slate-900 p-6 sm:p-8 lg:p-12 text-white relative overflow-hidden"
      >
        <ShieldCheck className="h-10 sm:h-12 w-10 sm:w-12 text-cyan-400" />
        <h3 className="mt-4 sm:mt-6 text-2xl sm:text-3xl lg:text-3xl font-bold">A+ (Superior) Financial Strength</h3>
        <p className="mt-2 sm:mt-4 text-sm sm:text-base text-slate-300">
          We are proud to be rated A+ by A.M. Best, the leading independent rating agency.
          This signifies a superior ability to meet our ongoing insurance policy and contract obligations.
        </p>
        <p className="mt-4 sm:mt-6 text-xs sm:text-sm text-slate-400">Rating affirmed as of July 2025.</p>
        <div className="absolute -bottom-12 -right-12 text-[6rem] sm:text-[12rem] font-black text-white/5">
          A+
        </div>
      </motion.div>

      {/* Side Card: Customer Reviews */}
      <motion.div
        variants={itemVariants}
        className="rounded-3xl bg-white p-6 sm:p-8 lg:p-12 shadow-2xl ring-1 ring-slate-200/50"
      >
        <img src="/trustpilotlogo.png" alt="Trustpilot Logo" className="h-6 sm:h-8" />
        <div className="mt-4 sm:mt-6 flex items-center gap-x-2">
          <p className="text-2xl sm:text-3xl font-bold text-slate-900">4.9</p>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 sm:h-6 w-4 sm:w-6 ${i < 5 ? 'text-green-500' : 'text-green-500'}`}
                fill="currentColor"
              />
            ))}
          </div>
        </div>
        <p className="mt-1 sm:mt-2 text-sm sm:text-base text-slate-600">Based on 12 reviews</p>
        <blockquote className="mt-4 sm:mt-6 border-l-4 border-slate-200 pl-4 sm:pl-6 text-slate-700 italic text-sm sm:text-base">
          "The most seamless and transparent financial process I've ever experienced. I felt supported and informed every step of the way."
        </blockquote>
      </motion.div>

      {/* Bottom Row: Key Metrics */}
      <motion.div
        variants={itemVariants}
        className="lg:col-span-2 rounded-3xl bg-slate-50 p-6 sm:p-8 lg:p-12 ring-1 ring-slate-200/50"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <AnimatedCounter
            to={99.8}
            unit="%"
            label="of claims paid in 2024"
            icon={<ShieldCheck className="h-8 sm:h-10 w-8 sm:w-10 text-green-500 mx-auto" />}
          />
          <AnimatedCounter
            to={250}
            prefix="+"
            label="families currently protected"
            icon={<Users className="h-8 sm:h-10 w-8 sm:w-10 text-indigo-500 mx-auto" />}
          />
          <AnimatedCounter
            to={10}
            prefix="<"
            unit=" mins"
            label="average application time"
            icon={<TrendingUp className="h-8 sm:h-10 w-8 sm:w-10 text-cyan-500 mx-auto" />}
          />
        </div>
      </motion.div>
    </motion.div>
  </div>
</div>

  );
}