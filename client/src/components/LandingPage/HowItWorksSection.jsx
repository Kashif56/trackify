import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FileText, CreditCard, BarChart3, CheckCircle } from 'lucide-react';

const HowItWorksSection = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const steps = [
    {
      title: 'Create Invoices',
      description: 'Easily create professional invoices with our intuitive interface. Add your branding, client details, and line items in minutes.',
      icon: <FileText size={32} className="text-primary" />,
    },
    {
      title: 'Track Expenses',
      description: 'Keep track of all your business expenses in one place. Categorize, add receipts, and monitor your spending habits.',
      icon: <CreditCard size={32} className="text-primary" />,
    },
    {
      title: 'Generate Reports',
      description: 'Get insights into your business finances with detailed reports. Monitor income, expenses, and outstanding payments.',
      icon: <BarChart3 size={32} className="text-primary" />,
    },
    {
      title: 'Get Paid Faster',
      description: 'Accept online payments directly through your invoices. Set up automatic reminders for overdue payments.',
      icon: <CheckCircle size={32} className="text-primary" />,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section id="how-it-works" className="py-16 bg-white" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-text-primary sm:text-4xl">
            How Trackifye Works
          </h2>
          <p className="mt-4 text-lg text-text-secondary max-w-2xl mx-auto">
            Simplify your financial workflow in just a few steps
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="relative p-6 bg-neutral-light rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
              variants={itemVariants}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-orange-100 mb-4">
                {step.icon}
              </div>
              <h3 className="text-xl font-medium text-text-primary">
                {step.title}
              </h3>
              <p className="mt-2 text-base text-text-secondary">
                {step.description}
              </p>
              <div className="absolute top-0 right-0 -mt-2 -mr-2 bg-primary rounded-full h-8 w-8 flex items-center justify-center text-white font-bold">
                {index + 1}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <a
            href="/register"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200"
          >
            Start Using Trackifye Today
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
