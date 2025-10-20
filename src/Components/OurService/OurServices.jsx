
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Heart, Plane, Users, CheckCircle, ArrowRight } from 'lucide-react';

const serviceTabs = [
  {
    id: 'term-life',
    label: 'Term Life',
    icon: <Shield className="h-6 w-6" />,
    title: 'Simple, Affordable Coverage for Life’s Uncertainties',
    description:
      'Protect your loved ones from financial hardship with reliable term life coverage. Designed to cover income replacement, debts, and essential family goals during your most important years.',
    featuredPolicy: 'Term Life Insurance',
    benefits: [
      'High coverage at affordable premiums',
      'Flexible terms: 10, 20, or 30 years',
      'Ideal for families and income protection',
    ],
    image:
      '/service2.jpg',
  },
  {
    id: 'senior-citizens',
    label: 'Senior Citizens',
    icon: <Heart className="h-6 w-6" />,
    title: 'Secure the Golden Years with Peace of Mind',
    description:
      'Tailored protection for seniors and retirees, ensuring that medical needs, legacy plans, and final expenses are handled with care and dignity. Because peace of mind shouldn’t have an age limit.',
    featuredPolicy: 'Senior Life Insurance',
    benefits: [
      'Lifetime coverage that never expires',
      'Guaranteed acceptance options',
      'Covers medical, funeral, or estate costs',
    ],
    image:
      '/service1.jpg',
  },
  {
    id: 'travel',
    label: 'Travel',
    icon: <Plane className="h-6 w-6" />,
    title: 'Explore the World, Worry-Free',
    description:
      'Whether it’s a short vacation or a global adventure, travel with confidence knowing you’re protected against the unexpected — from flight delays to medical emergencies abroad.',
    featuredPolicy: 'Comprehensive Travel Insurance',
    benefits: [
      'Covers trip cancellations and delays',
      'Medical and emergency evacuation protection',
      '24/7 global assistance, anywhere you go',
    ],
    image:
      '/service3.jpg',
  },
  {
    id: 'family',
    label: 'Family',
    icon: <Users className="h-6 w-6" />,
    title: 'Protecting What Matters Most — Your Family',
    description:
      'Comprehensive family insurance designed to secure your loved ones’ future — from your home and children’s education to long-term financial stability and well-being.',
    featuredPolicy: 'Family Protection Plan',
    benefits: [
      'Covers every family member under one plan',
      'Supports education, health, and long-term goals',
      'Affordable premiums with flexible options',
    ],
    image:
      '/service4.jpg',
  },
];

const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: 'easeIn' } },
};

export default function OurServices() {
  const [activeTab, setActiveTab] = useState(serviceTabs[0].id);
  const activeTabData = serviceTabs.find((tab) => tab.id === activeTab);

  if (!activeTabData) return null;

  return (
<div className="bg-slate-50 pb-20 sm:pb-32">
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-3xl text-center">
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 font-serif">
        Protection Tailored to Every Stage of Life
      </h2>
      <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-6 sm:leading-8 text-slate-700">
        Life evolves — and so should your coverage. Discover plans designed
        to give you confidence, security, and peace of mind for every
        chapter of your journey.
      </p>
    </div>

    {/* Tabs */}
    <div className="mt-8 sm:mt-16 border-b border-slate-200 overflow-x-auto">
      <div className="flex space-x-4 sm:space-x-8 px-2 sm:px-0">
        {serviceTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative whitespace-nowrap py-2 sm:py-4 px-2 sm:px-1 text-sm sm:text-base font-semibold flex items-center gap-x-2 transition-colors
              ${activeTab === tab.id ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}
          >
            {tab.icon}
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                className="absolute inset-x-0 bottom-0 h-0.5 bg-indigo-600"
                layoutId="service-underline"
              />
            )}
          </button>
        ))}
      </div>
    </div>

    {/* Tab Content */}
    <div className="mt-8 sm:mt-12">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          variants={contentVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12 items-center"
        >
          {/* Left: Text */}
          <div className="lg:pr-8">
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">
              {activeTabData.title}
            </h3>
            <p className="mt-2 sm:mt-4 text-sm sm:text-lg leading-6 sm:leading-7 text-slate-700">
              {activeTabData.description}
            </p>
            <div className="mt-4 sm:mt-8 rounded-2xl bg-slate-50 p-4 sm:p-6">
              <h4 className="font-semibold text-slate-800">
                Featured Solution:{' '}
                <span className="text-indigo-700">{activeTabData.featuredPolicy}</span>
              </h4>
              <ul className="mt-2 sm:mt-4 space-y-2 sm:space-y-3">
                {activeTabData.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-x-2 sm:gap-x-3 text-sm sm:text-base">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                    <span className="text-slate-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-4 sm:mt-10">
              <a
                href="#"
                className="inline-flex items-center justify-center gap-x-2 rounded-full bg-slate-900 px-6 sm:px-8 py-2.5 sm:py-3.5 text-sm sm:text-base font-semibold text-white shadow-lg hover:bg-slate-700 transition-colors"
              >
                Explore This Solution
                <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
              </a>
            </div>
          </div>

          {/* Right: Image */}
          <div className="h-64 sm:h-80 lg:h-[500px]">
            <img
              src={activeTabData.image}
              alt={activeTabData.title}
              className="h-full w-full object-cover rounded-3xl shadow-2xl"
            />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  </div>
</div>

  );
}
