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
      'Basic reporting',
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
      'Unlimited invoices',
      'Unlimited expenses',
      'Advanced reporting',
      'Client portal',
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
      'Everything in Pro',
      'Multi-user access',
      'Custom branding',
      'API access',
      'Dedicated support',
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
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="bg-white py-24 sm:py-32" id="pricing" ref={ref}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div 
          className="mx-auto max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-base font-semibold leading-7 text-[#F97316]">Pricing</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-[#1F2937] sm:text-4xl">
            Simple, transparent pricing
          </p>
          <p className="mt-6 text-lg leading-8 text-[#4B5563]">
            Choose the plan that's right for your business. All plans include a 14-day free trial.
          </p>

          {/* Billing toggle */}
          <div className="mt-10 flex justify-center items-center space-x-4">
            <span className={`text-sm ${billingCycle === 'monthly' ? 'text-[#1F2937] font-medium' : 'text-[#4B5563]'}`}>Monthly</span>
            <button 
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
              className="relative inline-flex h-6 w-12 items-center rounded-full bg-gray-200"
            >
              <span className="sr-only">Toggle billing cycle</span>
              <span 
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${billingCycle === 'annual' ? 'translate-x-7' : 'translate-x-1'}`}
              />
            </button>
            <span className={`text-sm ${billingCycle === 'annual' ? 'text-[#1F2937] font-medium' : 'text-[#4B5563]'}`}>Annual</span>
            <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
              Save 20%
            </span>
          </div>
        </motion.div>
        
        <motion.div 
          className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-start gap-8 sm:mt-20 lg:max-w-none lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
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
          <h3 className="text-lg font-semibold text-[#1F2937]">Frequently Asked Questions</h3>
          <p className="mt-2 text-[#4B5563]">Have questions about our pricing? <a href="/contact" className="text-[#F97316] hover:text-[#EA580C]">Contact our sales team</a></p>
        </motion.div>
      </div>
    </div>
  );
};

export default PricingSection;
