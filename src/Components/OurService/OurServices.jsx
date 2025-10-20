// components/OurServices.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Home, TrendingUp, CheckCircle, ChevronDown } from 'lucide-react';

const serviceData = [
  {
    id: 'term',
    icon: <Shield className="h-10 w-10 text-cyan-600" />,
    title: 'Term Life Protection',
    subtitle: 'For Maximum Coverage at Minimum Cost',
    description: 'Term Life is the most affordable and straightforward way to protect your family during their most critical years. It\'s designed to cover large financial responsibilities like a mortgage or your children\'s education.',
    bestFor: ['New Families & Homeowners', 'Income Replacement', 'Covering Specific Debts'],
    cta: 'Explore Term Life',
  },
  {
    id: 'whole',
    icon: <Home className="h-10 w-10 text-indigo-600" />,
    title: 'Whole Life Legacy',
    subtitle: 'For Lifelong Security & Guaranteed Growth',
    description: 'Whole Life provides permanent, lifelong coverage with a guaranteed cash value component that grows over time, tax-deferred. It\'s a foundational asset for estate planning and leaving a lasting legacy.',
    bestFor: ['Estate Planning', 'Leaving a Financial Legacy', 'Building Tax-Deferred Savings'],
    cta: 'Discover Whole Life',
  },
  {
    id: 'universal',
    icon: <TrendingUp className="h-10 w-10 text-emerald-600" />,
    title: 'Universal Life Flexibility',
    subtitle: 'For Coverage That Adapts With You',
    description: 'Universal Life offers the security of a permanent policy with the added flexibility to adjust your premium payments and death benefit as your life circumstances change, giving you more control.',
    bestFor: ['Flexible Financial Goals', 'Adjusting Coverage Over Time', 'Business Succession Planning'],
    cta: 'Learn About Universal Life',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

export default function OurServices() {
  const [expandedId, setExpandedId] = useState(null);

  return (
    <div className="bg-slate-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl font-serif">
            Coverage Crafted for Your Life
          </h2>
          <p className="mt-6 text-lg leading-8 text-slate-700">
            We offer a focused suite of best-in-class policies designed to provide
            clarity, confidence, and comprehensive protection for you and your loved ones.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-20 space-y-8"
        >
          {serviceData.map((service) => (
            <motion.div key={service.id} variants={itemVariants}>
              <div
                className={`bg-white rounded-3xl shadow-xl transition-all duration-300 overflow-hidden cursor-pointer
                  ${expandedId === service.id ? 'ring-2 ring-cyan-500' : 'hover:shadow-2xl hover:-translate-y-1'}`}
              >
                {/* Collapsed View */}
                <div
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-8"
                  onClick={() => setExpandedId(expandedId === service.id ? null : service.id)}
                >
                  <div className="flex items-center gap-6">
                    <div className="flex-shrink-0 flex items-center justify-center h-20 w-20 rounded-2xl bg-slate-100">
                      {service.icon}
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold text-slate-900">{service.title}</h3>
                      <p className="text-base text-slate-600">{service.subtitle}</p>
                    </div>
                  </div>
                  <motion.div
                    className="mt-6 sm:mt-0 ml-auto sm:ml-6 flex-shrink-0"
                    animate={{ rotate: expandedId === service.id ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="h-8 w-8 text-slate-400" />
                  </motion.div>
                </div>

                {/* Expanded View */}
                <AnimatePresence>
                  {expandedId === service.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-slate-200 px-8 pb-8 pt-6">
                        <p className="text-base leading-7 text-slate-700">{service.description}</p>
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                          <div>
                            <h4 className="font-semibold text-slate-900">Best For:</h4>
                            <ul className="mt-2 space-y-2">
                              {service.bestFor.map((item) => (
                                <li key={item} className="flex items-center gap-x-3">
                                  <CheckCircle className="h-5 w-5 text-green-500" />
                                  <span className="text-slate-600">{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="flex items-end justify-start md:justify-end">
                            <a
                              href="#"
                              className="rounded-full bg-slate-900 px-8 py-3 text-base font-semibold text-white shadow-lg hover:bg-slate-700 transition-colors"
                            >
                              {service.cta}
                            </a>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}