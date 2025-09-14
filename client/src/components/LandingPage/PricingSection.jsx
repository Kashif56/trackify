import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, X, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const plans = [
  {
    name: 'Free',
    price: '0',
    description: 'Perfect for freelancers just getting started',
    features: [
      'Up to 3 invoices per month',
      'Unlimited expenses',
      'Email support',
    ],
    cta: 'Get Started',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '10',
    description: 'For growing freelancers and small businesses',
    features: [
      'Upto 30 invoices per month',
      'Unlimited expenses',
      'Analytics and reporting',
      'Email Notifications',
      'Priority support',
    ],
    cta: 'Start Free Trial',
    highlighted: true,
  },
  {
    name: 'Business',
    price: '20',
    description: 'For established businesses with multiple users',
    features: [
      'Unlimited invoices',
      'Unlimited expenses',
      'Analytics and reporting',
      'Custom branding',
      'Dedicated support',
      'Email Notifications',
    ],
    cta: 'Contact Sales',
    highlighted: false,
  },
];

const PricingSection = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Calculate annual prices (20% discount)
  const getPrice = (basePrice, cycle) => {
    if (cycle === 'annual') {
      return (basePrice * 0.8).toFixed(0); // 20% discount for annual billing
    }
    return basePrice;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section id="pricing" className="py-16 bg-white" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-text-primary sm:text-4xl">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-4 text-lg text-text-secondary max-w-2xl mx-auto">
            Choose the plan that works best for your business needs
          </p>
        </motion.div>

        <motion.div
          className="text-center py-16 px-6 bg-gray-50 rounded-2xl border border-gray-200 shadow-sm max-w-3xl mx-auto"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Pricing Coming Soon!</h3>
          <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto">
            We're currently finalizing our pricing plans to provide you with the best value. 
            Sign up today to create your first invoice and you will be notified when our pricing plans are available.
          </p>
          
          <Link 
            to="/register" 
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[#F97316] hover:bg-[#EA580C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F97316] transition-colors"
          >
            Create Your First Invoice
          </Link>
        </motion.div>
        
        {/* Hidden pricing plans section - will be shown later */}
        <motion.div className="hidden">
          {plans.map((plan, planIdx) => (
            <motion.div
              key={plan.name}
              variants={itemVariants}
              className={`
                relative flex flex-col rounded-2xl p-8 ${plan.highlighted ? 'lg:mt-[-1rem]' : ''}
                ${plan.highlighted 
                  ? 'bg-white border-2 border-[#F97316] shadow-xl' 
                  : 'bg-white border border-gray-200'}
              `}
            >
              {plan.highlighted && (
                <div className="absolute -top-5 left-0 right-0 mx-auto w-32 rounded-full bg-gradient-to-r from-[#F97316] to-[#EA580C] px-3 py-1 text-center text-sm font-semibold text-white shadow-md">
                  Most Popular
                </div>
              )}
              
              <div className="mb-5">
                <h3 className="text-xl font-bold text-[#1F2937]">
                  {plan.name}
                </h3>
                <p className="mt-2 text-sm text-[#4B5563]">
                  {plan.description}
                </p>
              </div>
              
              <div className="flex items-baseline text-[#1F2937]">
                <span className="text-4xl font-bold tracking-tight">
                  ${getPrice(plan.price, billingCycle)}
                </span>
                <span className="ml-1 text-sm font-medium text-[#4B5563]">
                  /month
                </span>
              </div>
              
              {billingCycle === 'annual' && (
                <p className="mt-1 text-xs text-[#22C55E]">
                  Billed annually (${getPrice(plan.price, billingCycle) * 12}/year)
                </p>
              )}
              
              <div className="mt-6 mb-8">
                <Link
                  to="/register"
                  className={`
                    w-full block rounded-lg px-4 py-3 text-center text-sm font-semibold shadow-sm transition-all duration-200
                    ${plan.highlighted 
                      ? 'bg-[#F97316] text-white hover:bg-[#EA580C]' 
                      : 'bg-[#F9FAFB] text-[#1F2937] border border-gray-200 hover:bg-gray-100'}
                  `}
                >
                  {plan.cta}
                </Link>
              </div>
              
              <div className="flex-1">
                <p className="text-xs uppercase font-semibold tracking-wider text-[#4B5563] mb-3">What's included:</p>
                <ul className="space-y-3 text-sm text-[#4B5563]">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <Check className="h-5 w-5 flex-shrink-0 text-[#22C55E] mt-0.5" aria-hidden="true" />
                      <span className="ml-3">{feature}</span>
                    </li>
                  ))}
                  
                  {/* Add some features that aren't included in this plan but in higher plans */}
                  {planIdx === 0 && (
                    <>
                      <li className="flex items-start text-gray-400">
                        <X className="h-5 w-5 flex-shrink-0 text-gray-400 mt-0.5" aria-hidden="true" />
                        <span className="ml-3">Client portal</span>
                      </li>
                      <li className="flex items-start text-gray-400">
                        <X className="h-5 w-5 flex-shrink-0 text-gray-400 mt-0.5" aria-hidden="true" />
                        <span className="ml-3">Custom branding</span>
                      </li>
                    </>
                  )}
                  
                  {planIdx === 1 && (
                    <>
                      <li className="flex items-start text-gray-400">
                        <X className="h-5 w-5 flex-shrink-0 text-gray-400 mt-0.5" aria-hidden="true" />
                        <span className="ml-3">Multi-user access</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>
              
              {/* Feature tooltip */}
              {planIdx === 1 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div 
                    className="flex items-center text-sm text-[#4B5563] cursor-help"
                    onMouseEnter={() => setHoveredFeature('client-portal')}
                    onMouseLeave={() => setHoveredFeature(null)}
                  >
                    <HelpCircle className="h-4 w-4 mr-2 text-[#4B5563]" />
                    What is the client portal?
                    
                    {hoveredFeature === 'client-portal' && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-3 bg-[#1F2937] text-white text-xs rounded-lg shadow-lg z-10">
                        The client portal allows your clients to view their invoices, make payments, and download statements without contacting you directly.
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-[#1F2937]"></div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
        
        {/* FAQ section */}
        <motion.div 
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
         
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;
