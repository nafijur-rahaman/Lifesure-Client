// components/OurCommitment.jsx
import { motion } from 'framer-motion';
import { Phone, Mail, MessageSquare, CheckCircle, ArrowRight } from 'lucide-react';

const commitments = [
  'Direct access to licensed, non-commissioned advocates.',
  'Proactive support throughout your policy\'s lifetime.',
  'A dedicated claims team that provides compassionate guidance.',
];

const contactMethods = [
  {
    icon: <Phone className="h-8 w-8 text-cyan-700" />,
    title: 'Schedule a Call',
    description: 'Speak directly with a licensed advisor at a time that works for you. No pressure, just clarity.',
    href: '#',
  },
  {
    icon: <Mail className="h-8 w-8 text-emerald-700" />,
    title: 'Send an Email',
    description: 'Have a detailed question? Send us a message, and our team will get back to you within 24 hours.',
    href: '#',
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

export default function Contact() {
  return (
    <div className="bg-slate-50 pb-32">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>
      
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
        >
          {/* Left Side: The Promise */}
          <motion.div variants={itemVariants}>
            <h2 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl font-serif">
              A Partnership for Life.
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-700">
              Your journey with us doesn't end when you purchase a policy—it begins.
              We are committed to being your trusted partner, providing human help
              when you need it most.
            </p>
            <ul className="mt-8 space-y-4">
              {commitments.map((commitment) => (
                <li key={commitment} className="flex items-start gap-x-3">
                  <CheckCircle className="h-6 w-6 text-indigo-500 mt-1 flex-shrink-0" />
                  <span className="text-slate-800">{commitment}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Right Side: Actionable Contact Cards */}
          <motion.div variants={itemVariants} className="space-y-8">
            {contactMethods.map((method) => (
              <a
                key={method.title}
                href={method.href}
                className="group block rounded-3xl bg-white p-8 shadow-2xl ring-1 ring-slate-200 hover:ring-cyan-500 transition-all duration-300"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-x-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                        {method.icon}
                      </div>
                      <h3 className="text-xl font-semibold text-slate-900">
                        {method.title}
                      </h3>
                    </div>
                    <p className="mt-4 text-slate-600 max-w-sm">
                      {method.description}
                    </p>
                  </div>
                  <ArrowRight className="h-6 w-6 text-slate-300 transition-transform duration-300 group-hover:text-cyan-600 group-hover:translate-x-1" />
                </div>
              </a>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}