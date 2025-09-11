import React, { useState } from 'react';
import { FileText, CreditCard, BarChart2, Users, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const features = [
  {
    name: 'Simple Invoicing',
    description: 'Create professional invoices in seconds. Add your logo, client details, and line items with automatic tax calculation.',
    icon: FileText,
  },
  {
    name: 'Expense Tracking',
    description: 'Easily log and categorize your business expenses. Attach receipts and generate expense reports for tax time.',
    icon: CreditCard,
  },
  {
    name: 'Insightful Reports',
    description: 'Get a clear picture of your business finances with simple, visual reports showing income, expenses, and outstanding payments.',
    icon: BarChart2,
  },
  {
    name: 'Client Management',
    description: 'Store client information securely and access their invoice history, outstanding balances, and contact details in one place.',
    icon: Users,
  },
];

const FeaturesSection = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

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
            Trackify provides all the essential tools you need to manage your business finances without the complexity and high cost of traditional accounting software.
          </p>
        </motion.div>
        
        <div className="mx-auto mt-16 max-w-7xl sm:mt-20 lg:mt-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Feature Navigation */}
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
                  className={`p-6 rounded-xl cursor-pointer transition-all duration-300 ${activeFeature === index ? 'bg-white shadow-lg border-l-4 border-[#F97316]' : 'hover:bg-white/50'}`}
                  onClick={() => setActiveFeature(index)}
                >
                  <div className="flex items-center">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${activeFeature === index ? 'bg-[#F97316]' : 'bg-[#F97316]/10'}`}>
                      <feature.icon className={`h-6 w-6 ${activeFeature === index ? 'text-white' : 'text-[#F97316]'}`} aria-hidden="true" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-[#1F2937]">{feature.name}</h3>
                      <p className={`mt-1 text-sm text-[#4B5563] ${activeFeature === index ? 'block' : 'hidden md:block'}`}>
                        {feature.description.substring(0, 60)}...
                      </p>
                    </div>
                    {activeFeature === index && (
                      <ArrowRight className="ml-auto h-5 w-5 text-[#F97316]" />
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Feature Details */}
            <motion.div 
              className="lg:col-span-7 bg-white p-8 rounded-2xl shadow-lg relative overflow-hidden"
              initial={{ opacity: 0, x: 20 }}
              animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-[#F97316]/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-[#22C55E]/10 rounded-full blur-3xl"></div>
              
              <div className="relative z-10">
                <div className="flex items-center mb-6">
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[#F97316]">
                    {features[activeFeature].icon && (
                      <div>
                        {React.createElement(features[activeFeature].icon, {
                          className: "h-8 w-8 text-white",
                          "aria-hidden": "true"
                        })}
                      </div>
                    )}
                  </div>
                  <h3 className="ml-4 text-2xl font-bold text-[#1F2937]">{features[activeFeature].name}</h3>
                </div>
                
                <p className="text-lg text-[#4B5563] mb-8">{features[activeFeature].description}</p>
                
                <div className="bg-[#F9FAFB] p-6 rounded-xl">
                  <h4 className="text-sm font-semibold text-[#1F2937] uppercase tracking-wider mb-4">Key Benefits</h4>
                  <ul className="space-y-3">
                    {activeFeature === 0 && (
                      <>
                        <li className="flex items-center text-[#4B5563]"><div className="h-2 w-2 rounded-full bg-[#F97316] mr-2"></div> Professional invoice templates</li>
                        <li className="flex items-center text-[#4B5563]"><div className="h-2 w-2 rounded-full bg-[#F97316] mr-2"></div> Automatic tax calculations</li>
                        <li className="flex items-center text-[#4B5563]"><div className="h-2 w-2 rounded-full bg-[#F97316] mr-2"></div> Recurring invoice scheduling</li>
                      </>
                    )}
                    {activeFeature === 1 && (
                      <>
                        <li className="flex items-center text-[#4B5563]"><div className="h-2 w-2 rounded-full bg-[#F97316] mr-2"></div> Receipt scanning and storage</li>
                        <li className="flex items-center text-[#4B5563]"><div className="h-2 w-2 rounded-full bg-[#F97316] mr-2"></div> Expense categorization</li>
                        <li className="flex items-center text-[#4B5563]"><div className="h-2 w-2 rounded-full bg-[#F97316] mr-2"></div> Tax-deductible tracking</li>
                      </>
                    )}
                    {activeFeature === 2 && (
                      <>
                        <li className="flex items-center text-[#4B5563]"><div className="h-2 w-2 rounded-full bg-[#F97316] mr-2"></div> Income and expense breakdown</li>
                        <li className="flex items-center text-[#4B5563]"><div className="h-2 w-2 rounded-full bg-[#F97316] mr-2"></div> Profit and loss statements</li>
                        <li className="flex items-center text-[#4B5563]"><div className="h-2 w-2 rounded-full bg-[#F97316] mr-2"></div> Tax preparation reports</li>
                      </>
                    )}
                    {activeFeature === 3 && (
                      <>
                        <li className="flex items-center text-[#4B5563]"><div className="h-2 w-2 rounded-full bg-[#F97316] mr-2"></div> Centralized client database</li>
                        <li className="flex items-center text-[#4B5563]"><div className="h-2 w-2 rounded-full bg-[#F97316] mr-2"></div> Payment history tracking</li>
                        <li className="flex items-center text-[#4B5563]"><div className="h-2 w-2 rounded-full bg-[#F97316] mr-2"></div> Client portal access</li>
                      </>
                    )}
                  </ul>
                </div>
                
                <div className="mt-8">
                  <a href="/register" className="inline-flex items-center text-[#F97316] font-medium hover:text-[#EA580C] transition-colors">
                    Try this feature <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
