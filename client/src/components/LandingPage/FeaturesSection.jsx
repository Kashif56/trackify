import React, { useState } from 'react';
import { FileText, CreditCard, BarChart2, Users, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// Import feature images
import invoiceImage from '../../assets/invoice.png';
import expenseImage from '../../assets/expense.png';
import dashboardImage from '../../assets/dashboard.png';
import clientImage from '../../assets/client.png';

const features = [
  {
    name: 'Simple Invoicing',
    description: 'Create professional invoices in seconds. Add your logo, client details, and line items with automatic tax calculation.',
    icon: FileText,
    image: invoiceImage,
    benefits: [
      'Professional invoice template',
      'Automatic tax calculations',
      'Multiple currency support',
      'PDF export and email sending'
    ]
  },
  {
    name: 'Expense Tracking',
    description: 'Easily log and categorize your business expenses. Attach receipts and generate expense reports for tax time.',
    icon: CreditCard,
    image: expenseImage,
    benefits: [
      'Receipt scanning and storage',
      'Expense categorization',
      'Tax-deductible tracking',
    ]
  },
  {
    name: 'Insightful Reports',
    description: 'Get a clear picture of your business finances with simple, visual reports showing income, expenses, and outstanding payments.',
    icon: BarChart2,
    image: dashboardImage,
    benefits: [
      'Income and expense breakdown',
      'Profit and loss statements',
      'Cash flow visualization',
      'Tax preparation reports'
    ]
  },
  {
    name: 'Client Management',
    description: 'Store client information securely and access their invoice history, outstanding balances, and contact details in one place.',
    icon: Users,
    image: clientImage,
    benefits: [
      'Centralized client database',
      'Payment history tracking',
      'Automated payment reminders'
    ]
  },
];

const FeaturesSection = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [expandedFeatures, setExpandedFeatures] = useState([0]); // Only first feature is expanded by default
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  const toggleFeature = (index) => {
    setActiveFeature(index);
    setExpandedFeatures(prev => {
      if (prev.includes(index)) {
        // If clicking on already expanded feature, collapse it
        return prev.filter(item => item !== index);
      } else {
        // Collapse others, only expand the clicked one
        return [index];
      }
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="bg-[#F9FAFB] py-24 sm:py-32" id="features" ref={ref}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div 
          className="mx-auto max-w-2xl lg:text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-base font-semibold leading-7 text-[#F97316]">Everything You Need</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-[#1F2937] sm:text-4xl">
            Simple Tools for Freelancers & Small Businesses
          </p>
          <p className="mt-6 text-lg leading-8 text-[#4B5563]">
            Trackifye provides all the essential tools you need to manage your business finances without the complexity and high cost of traditional accounting software.
          </p>
        </motion.div>
        
        <div className="mx-auto mt-16 max-w-7xl sm:mt-20 lg:mt-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Feature Navigation - Left Side */}
            <motion.div 
              className="lg:col-span-5 space-y-4"
              variants={containerVariants}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
            >
              {features.map((feature, index) => (
                <motion.div 
                  key={feature.name}
                  variants={itemVariants}
                  className={`rounded-xl cursor-pointer transition-all duration-300 ${activeFeature === index ? 'bg-white shadow-lg border-l-4 border-[#F97316]' : 'hover:bg-white/50'}`}
                  onClick={() => toggleFeature(index)}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${activeFeature === index ? 'bg-[#F97316]' : 'bg-[#F97316]/10'}`}>
                          <feature.icon className={`h-6 w-6 ${activeFeature === index ? 'text-white' : 'text-[#F97316]'}`} aria-hidden="true" />
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-semibold text-[#1F2937]">{feature.name}</h3>
                        </div>
                      </div>
                      {expandedFeatures.includes(index) ? (
                        <ChevronUp className="h-5 w-5 text-[#4B5563]" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-[#4B5563]" />
                      )}
                    </div>
                  </div>
                  
                  <AnimatePresence>
                    {expandedFeatures.includes(index) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="px-6 pb-6"
                      >
                        <p className="text-sm text-[#4B5563] mb-4">{feature.description}</p>
                        
                        <div className="bg-[#F9FAFB] p-4 rounded-xl">
                          <h4 className="text-xs font-semibold text-[#1F2937] uppercase tracking-wider mb-3">Key Benefits</h4>
                          <ul className="space-y-2">
                            {feature.benefits.map((benefit, i) => (
                              <li key={i} className="flex items-center text-[#4B5563] text-sm">
                                <div className="h-2 w-2 rounded-full bg-[#F97316] mr-2"></div>
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="mt-4">
                          <a href="/register" className="inline-flex items-center text-[#F97316] text-sm font-medium hover:text-[#EA580C] transition-colors">
                            Try this feature <ArrowRight className="ml-2 h-4 w-4" />
                          </a>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>

            {/* Feature Image or Invoice Template - Right Side */}
            <motion.div 
              className="lg:col-span-7 bg-white p-6 rounded-2xl shadow-lg relative overflow-hidden flex items-center justify-center"
              initial={{ opacity: 0, x: 20 }}
              animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-[#F97316]/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-[#22C55E]/10 rounded-full blur-3xl"></div>
              
              <div className="relative z-10 w-full h-full">
                <AnimatePresence mode="wait">
                  {expandedFeatures.length > 0 ? (
                    // Show feature image when a feature is expanded
                    <motion.div
                      key={`feature-${activeFeature}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="w-full flex justify-center"
                    >
                      <img 
                        src={features[activeFeature].image} 
                        alt={features[activeFeature].name} 
                        className="rounded-lg shadow-md object-contain"
                      />
                    </motion.div>
                  ) : (
                    // Show invoice image when all features are collapsed
                    <motion.div
                      key="invoice-template"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      className="w-full flex justify-center"
                    >
                      <img 
                        src={invoiceImage} 
                        alt="Invoice Example" 
                        className="rounded-lg shadow-md object-contain max-w-[90%]"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
