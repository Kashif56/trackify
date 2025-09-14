import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Clock, Users, FileText, DollarSign } from 'lucide-react';

// Custom hook for counting up animation
const useCountUp = (end, duration = 2000, startOnInView = false) => {
  const [count, set_count] = useState(0);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (!startOnInView || inView) {
      let start = 0;
      const step = end / (duration / 16); // 16ms per frame (approx 60fps)
      let timer;

      const updateCount = () => {
        start += step;
        if (start < end) {
          set_count(Math.floor(start));
          timer = requestAnimationFrame(updateCount);
        } else {
          set_count(end);
        }
      };

      timer = requestAnimationFrame(updateCount);
      return () => cancelAnimationFrame(timer);
    }
  }, [end, duration, startOnInView, inView]);

  return { count, ref };
};

const StatItem = ({ icon, value, label, suffix = '', prefix = '', delay = 0 }) => {
  const { count, ref } = useCountUp(value, 2000, true);
  
  return (
    <motion.div 
      className="flex flex-col items-center p-6 bg-white border border-gray-200 rounded-lg shadow-sm"
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
    >
      <div className="p-3 bg-orange-100 rounded-full mb-4">
        {icon}
      </div>
      <h3 className="text-4xl font-bold">
        {prefix}{count.toLocaleString()}{suffix}
      </h3>
      <p className="mt-2 text-text-secondary">{label}</p>
    </motion.div>
  );
};

const StatsCounterSection = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const stats = [
    {
      icon: <Clock size={24} className="text-primary" />,
      value: 60,
      label: "Hours Saved Monthly",
      suffix: "+",
      delay: 0,
    },
    {
      icon: <Users size={24} className="text-primary" />,
      value: 5000,
      label: "Happy Customers",
      suffix: "+",
      delay: 0.1,
    },
    {
      icon: <FileText size={24} className="text-primary" />,
      value: 250000,
      label: "Invoices Generated",
      suffix: "+",
      delay: 0.2,
    },
    {
      icon: <DollarSign size={24} className="text-primary" />,
      value: 15,
      label: "Million in Transactions",
      prefix: "$",
      suffix: "M+",
      delay: 0.3,
    },
  ];

  return (
    <section className="py-16" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-text-primary sm:text-4xl">
            Our Impact in Numbers
          </h2>
          <p className="mt-4 text-lg text-text-secondary max-w-2xl mx-auto">
            See how Trackifye is transforming financial management for businesses worldwide
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <StatItem
              key={index}
              icon={stat.icon}
              value={stat.value}
              label={stat.label}
              suffix={stat.suffix}
              prefix={stat.prefix}
              delay={stat.delay}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsCounterSection;
