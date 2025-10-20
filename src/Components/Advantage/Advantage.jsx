
import { motion } from 'framer-motion';
import { XCircle, CheckCircle } from 'lucide-react';

const comparisonPoints = [
  {
    feature: 'Application Process',
    traditional: 'Lengthy paperwork & mail',
    ourWay: '10-minute online application',
  },
  {
    feature: 'Medical Exam',
    traditional: 'In-person exam required',
    ourWay: 'No exam for eligible applicants',
  },
  {
    feature: 'Approval Time',
    traditional: '4-6 weeks of waiting',
    ourWay: 'Instant decision in minutes',
  },
  {
    feature: 'Guidance',
    traditional: 'Commission-based agents',
    ourWay: 'Salaried, unbiased advisors',
  },
  {
    feature: 'Transparency',
    traditional: 'Complex terms & hidden fees',
    ourWay: 'Clear, straightforward policies',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.2 } },
};

const columnVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

export default function Advantage() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl font-serif">
            The Difference is Clear
          </h2>
          <p className="mt-6 text-lg leading-8 text-slate-700">
            We didn't just improve the old way of getting life insurance—we built a better one from the ground up, centered around you.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-12"
        >
          {/* Column 1: Traditional Insurance */}
          <motion.div
            variants={columnVariants}
            className="rounded-3xl bg-slate-100 p-8 sm:p-10"
          >
            <h3 className="text-2xl font-semibold text-slate-700">The Old Way</h3>
            <p className="mt-2 text-slate-500">Complex, slow, and outdated.</p>
            <ul className="mt-8 space-y-6">
              {comparisonPoints.map((point, index) => (
                <motion.li
                  key={point.feature}
                  custom={index}
                  variants={itemVariants}
                  className="flex items-start gap-x-4"
                >
                  <XCircle className="h-6 w-6 text-rose-500 mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-800">{point.feature}</span>
                    <p className="text-slate-600">{point.traditional}</p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Column 2: Our Way */}
          <motion.div
            variants={columnVariants}
            className="rounded-3xl bg-white p-8 sm:p-10 shadow-2xl ring-2 ring-cyan-500"
          >
            <h3 className="text-2xl font-bold text-slate-900">The LifeSure Way</h3>
            <p className="mt-2 text-cyan-700 font-semibold">Simple, fast, and transparent.</p>
            <ul className="mt-8 space-y-6">
              {comparisonPoints.map((point, index) => (
                <motion.li
                  key={point.feature}
                  custom={index}
                  variants={itemVariants}
                  className="flex items-start gap-x-4"
                >
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-900">{point.feature}</span>
                    <p className="text-slate-700">{point.ourWay}</p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        <div className="mt-20 text-center">
            <a href="#" className="rounded-full bg-slate-900 px-10 py-4 text-lg font-semibold text-white shadow-lg hover:bg-slate-700 transition-colors">
                Experience the Difference
            </a>
        </div>
      </div>
    </div>
  );
}