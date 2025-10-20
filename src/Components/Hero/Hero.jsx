// components/GalleryHeroCarousel.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    id: 'simplicity',
    supertitle: 'Unparalleled Simplicity',
    title: 'Your Future, Secured in Minutes.',
    description: 'Our intelligent platform streamlines the entire process, allowing you to get a personalized quote and apply online with absolute ease.',
    image: 'https://images.unsplash.com/photo-1554224155-1696413565d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format=fit=crop&w=1470&q=80',
    cta: 'Begin Your Application',
  },
  {
    id: 'guidance',
    supertitle: 'Human-Centered Expertise',
    title: 'Guidance that Inspires Confidence.',
    description: 'Connect with our dedicated, non-commissioned advisors. We provide clarity and personalized advice, not pressure.',
    image: 'hero2.jpg',
    cta: 'Meet Our Advisors',
  },
  {
    id: 'legacy',
    supertitle: 'A Lasting Legacy',
    title: 'Protection You Can Build On.',
    description: 'Secure your family\'s tomorrow with A+ rated policies that offer a lasting legacy of financial security and profound peace of mind.',
    image: 'hero1.jpg',
    cta: 'Explore Policy Options',
  },
];

const imageVariants = {
  hidden: { opacity: 0, scale: 1.05 },
  visible: {
    opacity: 1,
    scale: 1, // Ken Burns effect: subtle zoom out
    transition: { duration: 1.5, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.7, ease: 'easeIn' },
  },
};

const contentContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.5 } },
};

const contentItemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function GalleryHeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  const goToNext = () => setActiveIndex((prev) => (prev + 1) % slides.length);
  const goToPrev = () => setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);

  useEffect(() => {
    const timer = setInterval(goToNext, 8000);
    return () => clearInterval(timer);
  }, []);

  const activeSlide = slides[activeIndex];

  return (
<div className="bg-slate-50 pt-5 pb-32">
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div className="relative h-[400px] sm:h-[500px] md:h-[650px] rounded-3xl shadow-2xl overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.img
          key={activeSlide.id}
          src={activeSlide.image}
          alt={activeSlide.title}
          variants={imageVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </AnimatePresence>

      {/* Content Layer */}
      <div className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 right-4 sm:right-8 z-10">
        <motion.div
          key={activeSlide.id + '_content'}
          variants={contentContainerVariants}
          initial="hidden"
          animate="visible"
          className="p-4 sm:p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-3xl text-white"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
            {/* Main Text */}
            <div className="md:col-span-2">
              <motion.span
                variants={contentItemVariants}
                className="text-xs sm:text-sm md:text-base font-semibold uppercase tracking-wider text-white/70"
              >
                {activeSlide.supertitle}
              </motion.span>
              <motion.h1
                variants={contentItemVariants}
                className="mt-2 text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white font-serif"
              >
                {activeSlide.title}
              </motion.h1>
              <motion.p
                variants={contentItemVariants}
                className="mt-3 sm:mt-6 text-sm sm:text-base md:text-base text-slate-200 max-w-full md:max-w-lg"
              >
                {activeSlide.description}
              </motion.p>
            </div>

            {/* CTA & Navigation */}
            <div className="flex flex-col justify-start sm:justify-between items-start md:items-end mt-4 md:mt-0">
              <motion.a
                variants={contentItemVariants}
                href="#"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-x-2 rounded-full bg-indigo-500 px-4 sm:px-8 py-2.5 text-sm sm:text-base font-semibold text-white shadow-xl hover:bg-indigo-400 focus:outline-none transition-all duration-300 transform hover:scale-105"
              >
                {activeSlide.cta}
                <ArrowRight className="h-4 sm:h-5 w-4 sm:w-5" />
              </motion.a>

              <div className="flex items-center gap-x-3 mt-4 md:mt-8">
                <button
                  onClick={goToPrev}
                  className="h-10 w-10 sm:h-12 sm:w-12 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="h-4 sm:h-6 w-4 sm:w-6 text-white" />
                </button>
                <div className="font-mono text-sm sm:text-base">
                  <span className="font-bold text-white">0{activeIndex + 1}</span>
                  <span className="text-slate-400"> / 0{slides.length}</span>
                </div>
                <button
                  onClick={goToNext}
                  className="h-10 w-10 sm:h-12 sm:w-12 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors"
                  aria-label="Next slide"
                >
                  <ChevronRight className="h-4 sm:h-6 w-4 sm:w-6 text-white" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1.5 z-20">
        <motion.div
          key={activeSlide.id + '_progress'}
          className="h-full bg-indigo-400"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 8, ease: 'linear' }}
        />
      </div>
    </div>
  </div>
</div>

  );
}