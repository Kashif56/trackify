import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CTABanner = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section className="relative overflow-hidden" ref={ref}>
      <div className="absolute inset-0 bg-gradient-to-r from-primary to-orange-500"></div>
      <div className="absolute inset-0 opacity-10">
        <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="url(#grid)" />
        </svg>
        <defs>
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
          </pattern>
        </defs>
      </div>
      
      <div className="relative max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="px-6 py-12 md:py-16 md:px-12 lg:flex lg:items-center lg:justify-between">
            <div>
              <motion.h2 
                className="text-3xl font-extrabold tracking-tight text-text-primary sm:text-4xl"
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                <span className="block">Ready to streamline your finances?</span>
                <span className="block text-primary">Start using Trackify today.</span>
              </motion.h2>
              <motion.p 
                className="mt-4 text-lg leading-6 text-text-secondary"
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ duration: 0.7, delay: 0.3 }}
              >
                Join thousands of freelancers and small businesses who trust Trackify for their invoicing and expense tracking needs.
              </motion.p>
            </div>
            <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
              <motion.div 
                className="inline-flex rounded-md shadow"
                initial={{ opacity: 0, x: 20 }}
                animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                whileHover={{ scale: 1.05 }}
              >
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-hover transition-colors duration-200"
                >
                  Get started for free
                </Link>
              </motion.div>
              <motion.div 
                className="ml-3 inline-flex rounded-md shadow"
                initial={{ opacity: 0, x: 20 }}
                animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                transition={{ duration: 0.7, delay: 0.5 }}
                whileHover={{ scale: 1.05 }}
              >
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-white hover:bg-neutral-light transition-colors duration-200"
                >
                  Contact sales <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTABanner;
