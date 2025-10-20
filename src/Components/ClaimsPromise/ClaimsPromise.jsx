// components/ClaimsPromise.jsx
import { motion } from 'framer-motion';
import { HeartHandshake, Paperclip, Check } from 'lucide-react';

const claimSteps = [
  {
    icon: <HeartHandshake className="h-6 w-6" />,
    name: 'A Single, Compassionate Contact',
    description: 'Your beneficiary will be connected with a dedicated claims advocate who will guide them with empathy and clarity every step of the way.',
  },

  {
    icon: <Paperclip className="h-6 w-6" />,
    name: 'Simple, Clear Documentation',
    description: 'We\'ve streamlined the paperwork. Your advocate will help gather the necessary documents (typically just the claim form and a death certificate).',
  },
  {
    icon: <Check className="h-6 w-6" />,
    name: 'Swift & Secure Payout',
    description: 'Once documentation is complete, we process claims swiftly. Most are approved and the tax-free benefit is paid out within 7-10 business days.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

export default function ClaimsPromise() {
  return (
    <div className="bg-slate-50 pb-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl font-serif">
            Support When It Matters Most
          </h2>
          <p className="mt-6 text-lg leading-8 text-slate-700">
            A life insurance policy is a promise. We've designed our claims process to be as
            simple, compassionate, and efficient as possible, ensuring your loved ones are
            cared for without delay.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start"
        >
          {/* Left Column: The Human Element & Stats */}
          <motion.div variants={itemVariants} className="space-y-12">
            <div className="rounded-3xl bg-white p-8 shadow-2xl ring-1 ring-slate-200">
              <div className="flex flex-col sm:flex-row items-start gap-6">
                <img
                  className="h-24 w-24 rounded-full object-cover shadow-lg flex-shrink-0"
                  // Replace with a real, professional headshot
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format=fit=crop&w=300&q=80"
                  alt="Head of Client Advocacy"
                />
                <div className="relative">
                  <p className="text-lg font-medium text-slate-800 italic">
                    "Our team's sole purpose is to lift the burden from grieving families.
                    We handle every claim with the dignity and urgency it deserves."
                  </p>
                  <footer className="mt-4">
                    <div className="text-base font-semibold text-slate-900">
                      Amanda Chen
                    </div>
                    <div className="text-sm text-black">Head of Client Advocacy</div>
                  </footer>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-8 text-center">
              <div>
                <p className="text-5xl font-extrabold text-black">99.8%</p>
                <p className="mt-2 text-base text-slate-600">of all life insurance claims paid in 2024</p>
              </div>
              <div>
                <p className="text-5xl font-extrabold text-black">7 Days</p>
                <p className="mt-2 text-base text-slate-600">Average claim payout time from approval</p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: The Simple Process */}
          <motion.div variants={itemVariants} className="rounded-3xl bg-white p-8 sm:p-12 shadow-2xl ring-1 ring-slate-200">
            <h3 className="text-2xl font-bold text-slate-900">Our 3-Step Claims Process</h3>
            <div className="relative mt-8">
              {/* Vertical line */}
              <div className="absolute left-6 top-1 h-full w-0.5 bg-slate-200" aria-hidden="true"></div>
              
              <ul role="list" className="space-y-10">
                {claimSteps.map((step) => (
                  <li key={step.name} className="relative flex items-start">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg ring-8 ring-white">
                      {step.icon}
                    </div>
                    <div className="ml-6">
                      <h4 className="text-lg font-semibold leading-7 text-slate-900">
                        {step.name}
                      </h4>
                      <p className="mt-2 text-base leading-7 text-slate-600">
                        {step.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}