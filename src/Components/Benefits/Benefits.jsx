// components/LivingBenefits.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, HeartPulse, Stethoscope, Sun } from 'lucide-react';

const livingBenefitTabs = [
  {
    id: 'critical',
    name: 'Critical Illness',
    icon: <HeartPulse className="h-6 w-6 text-rose-600" />,
    title: 'Financial Support During a Major Health Crisis',
    description: 'If you are diagnosed with a qualifying critical illness, such as a heart attack, stroke, or cancer, you can access a portion of your death benefit. This tax-free fund can be used to cover medical bills, lost income, or any other expenses, allowing you to focus on recovery without financial stress.',
  },
  {
    id: 'chronic',
    name: 'Chronic Illness',
    icon: <Stethoscope className="h-6 w-6 text-indigo-600" />,
    title: 'Assistance for Long-Term Care Needs',
    description: 'Should you become unable to perform two of the six Activities of Daily Living (like eating or dressing), this benefit provides access to funds. It helps cover the costs of long-term care, preserving your savings and providing dignity.',
  },
  {
    id: 'terminal',
    name: 'Terminal Illness',
    icon: <Sun className="h-6 w-6 text-amber-600" />,
    title: 'Access to Your Legacy in Your Final Months',
    description: 'A diagnosis of a terminal illness is devastating. This benefit allows you to access a significant portion of your death benefit while you are still living, helping you pay for care, get your affairs in order, or create final memories with loved ones.',
  },
];

const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: 'easeIn' } },
};

export default function Benefits() {
  const [activeTab, setActiveTab] = useState(livingBenefitTabs[0].id);

  return (
<div className="bg-slate-50 pb-20 sm:pb-32">
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-3xl text-center">
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 font-serif">
        More Than a Policy. It's a Lifeline.
      </h2>
      <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-6 sm:leading-8 text-slate-700">
        Modern life insurance protects you during life's most challenging moments, not just after. Discover the powerful benefits you can access when you need them most.
      </p>
    </div>

    <div className="mt-12 sm:mt-20 grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
      {/* Column 1: The Foundation */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-3xl bg-white p-6 sm:p-8 shadow-xl border border-slate-200 h-full"
      >
        <div className="flex items-center gap-x-3 sm:gap-x-4">
          <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-slate-100">
            <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-slate-600" />
          </div>
          <h3 className="text-xl sm:text-2xl font-semibold text-slate-900">The Foundation</h3>
        </div>
        <p className="mt-4 sm:mt-6 text-2xl sm:text-3xl font-bold text-slate-800 font-serif">Death Benefit</p>
        <p className="mt-2 sm:mt-4 text-sm sm:text-base text-slate-700">
          The core of every policy. Provides a tax-free, lump-sum payment to your beneficiaries, ensuring their financial security when they need it most.
        </p>
      </motion.div>

      {/* Column 2: The Modern Advantage */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="lg:col-span-2 rounded-3xl bg-white p-6 sm:p-10 shadow-2xl ring-2 ring-indigo-500"
      >
        <h3 className="text-2xl sm:text-3xl lg:text-3xl font-bold text-slate-900">The Modern Advantage: Living Benefits</h3>
        <p className="mt-2 text-sm sm:text-base text-slate-600">Access your policy's value while you are still alive. Included in most of our term policies at no extra cost.</p>
        
        {/* Tabs */}
        <div className="mt-6 sm:mt-8 border-b border-slate-200 overflow-x-auto">
          <div className="flex space-x-4 sm:space-x-6">
            {livingBenefitTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative whitespace-nowrap py-2 sm:py-4 px-2 sm:px-1 text-sm sm:text-base font-semibold transition-colors
                  ${activeTab === tab.id ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}
              >
                {tab.name}
                {activeTab === tab.id && (
                  <motion.div
                    className="absolute inset-x-0 bottom-0 h-0.5 bg-indigo-600"
                    layoutId="underline"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-6 sm:mt-8 min-h-[200px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {livingBenefitTabs.map((tab) => (
                tab.id === activeTab && (
                  <div key={tab.id} className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                    <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 sm:h-16 sm:w-16 rounded-2xl bg-slate-100">
                      {tab.icon}
                    </div>
                    <div>
                      <h4 className="text-lg sm:text-xl font-semibold text-slate-900">{tab.title}</h4>
                      <p className="mt-2 text-sm sm:text-base text-slate-700">{tab.description}</p>
                    </div>
                  </div>
                )
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  </div>
</div>

  );
}