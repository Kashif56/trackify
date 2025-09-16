import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import dashboard from '../../assets/dashboard.png'

const HeroSection = () => {
  const [isLoaded, set_is_loaded] = useState(false);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    // Simulate loading delay for animation purposes
    const timer = setTimeout(() => {
      set_is_loaded(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);


  return (
    <div className="bg-white" id="hero">
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 0.2, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-orange-200 to-orange-400 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          />
        </div>
        
        <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 0.2, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-green-200 to-green-400 opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          />
        </div>
        
        <div className="mx-auto max-w-2xl py-24 sm:py-32 lg:py-40" ref={ref}>
            <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, ease: "easeOut" }}>
              <motion.h1 
                className="text-4xl font-bold tracking-tight text-[#1F2937] sm:text-6xl"
                initial={{ opacity: 0 }}
                animate={isLoaded ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#F97316] to-[#EA580C]">Simple</span> Invoice & Expense Tracking for Small Businesses
              </motion.h1>
              <motion.p 
                className="mt-6 text-lg leading-8 text-[#4B5563]"
                initial={{ opacity: 0 }}
                animate={isLoaded ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Trackifye helps freelancers and small businesses create professional invoices, 
                track expenses, and get paid faster without the complexity of traditional accounting software.
              </motion.p>
            </motion.div>
            <motion.div 
              className="mt-10 flex items-center justify-center gap-x-6"
              initial={{ opacity: 0, y: 10 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link to="/register" className="rounded-md bg-[#F97316] px-6 py-3 text-lg font-semibold text-white shadow-sm hover:bg-[#EA580C] hover:scale-105 transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F97316]">
                Create your First Invoice
              </Link>
              <Link to="/features" className="text-lg font-semibold leading-6 text-[#1F2937] flex items-center group transition-all duration-300">
                Learn more <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </motion.div>
            
            <motion.div 
              className="mt-16 flex justify-center"
              initial={{ opacity: 0, y: 30 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <div className="relative rounded-lg shadow-xl overflow-hidden max-w-3xl transform hover:scale-[1.02] transition-all duration-500 hover:shadow-2xl">
                <img
                  src={dashboard}
                  alt="Trackify dashboard preview"
                  className="w-full h-auto"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>
            </motion.div>
            
            <motion.div 
              className="mt-10 flex justify-center space-x-6 md:space-x-12"
              initial={{ opacity: 0 }}
              animate={isLoaded ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <motion.div 
                className="flex flex-col items-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <span className="text-3xl font-bold text-[#22C55E]">100+</span>
                <span className="text-sm text-[#4B5563]">Freelancers</span>
              </motion.div>
              <motion.div 
                className="flex flex-col items-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <span className="text-3xl font-bold text-[#22C55E]">700+</span>
                <span className="text-sm text-[#4B5563]">Invoices Created</span>
              </motion.div>
              <motion.div 
                className="flex flex-col items-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <span className="text-3xl font-bold text-[#22C55E]">99%</span>
                <span className="text-sm text-[#4B5563]">Customer Satisfaction</span>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="mt-16 flex justify-center"
              initial={{ opacity: 0 }}
              animate={isLoaded ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              <a 
                href="#features" 
                className="flex flex-col items-center text-[#4B5563] hover:text-[#F97316] transition-colors duration-300"
                aria-label="Scroll to features"
              >
                <span className="text-sm mb-2">Discover More</span>
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <ChevronDown size={24} />
                </motion.div>
              </a>
            </motion.div>
      
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
