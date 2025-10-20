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
    <div className="bg-slate-50 py-5">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="relative h-[650px] rounded-3xl shadow-2xl overflow-hidden">
          {/* Background Image Layer */}
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

          {/* Content Layer with Glassmorphism Overlay */}
          <div className="absolute bottom-8 left-8 right-8 z-10">
            <motion.div
              key={activeSlide.id + '_content'}
              variants={contentContainerVariants}
              initial="hidden"
              animate="visible"
              className="p-8 sm:p-10 bg-black/30 backdrop-blur-xl border border-white/10 rounded-3xl text-white"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Main Text Content */}
                <div className="md:col-span-2">
                  <motion.span variants={contentItemVariants} className="text-base font-semibold text-cyan-400 uppercase tracking-wider">
                    {activeSlide.supertitle}
                  </motion.span>
                  <motion.h1 variants={contentItemVariants} className="mt-2 text-4xl font-extrabold tracking-tight text-white sm:text-5xl font-serif">
                    {activeSlide.title}
                  </motion.h1>
                  <motion.p variants={contentItemVariants} className="mt-6 text-base leading-7 text-slate-200 max-w-lg">
                    {activeSlide.description}
                  </motion.p>
                </div>
                {/* CTA and Navigation */}
                <div className="flex flex-col justify-between items-start md:items-end">
                  <motion.a
                    variants={contentItemVariants}
                    href="#"
                    className="inline-flex items-center justify-center gap-x-2 rounded-full bg-cyan-500 px-8 py-3.5 text-base font-semibold text-slate-900 shadow-xl hover:bg-cyan-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 transition-all duration-300 transform hover:scale-105"
                  >
                    {activeSlide.cta}
                    <ArrowRight className="h-5 w-5" />
                  </motion.a>
                  <div className="flex items-center gap-x-4 mt-8 md:mt-0">
                    <button
                      onClick={goToPrev}
                      className="h-12 w-12 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors"
                      aria-label="Previous slide"
                    >
                      <ChevronLeft className="h-6 w-6 text-white" />
                    </button>
                    <div className="font-mono text-sm">
                      <span className="font-bold text-white">0{activeIndex + 1}</span>
                      <span className="text-slate-400"> / 0{slides.length}</span>
                    </div>
                    <button
                      onClick={goToNext}
                      className="h-12 w-12 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors"
                      aria-label="Next slide"
                    >
                      <ChevronRight className="h-6 w-6 text-white" />
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
                className="h-full bg-cyan-400"
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