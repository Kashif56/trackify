import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const SuccessStoriesSection = () => {
  const [currentIndex, set_current_index] = useState(0);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const successStories = [
    {
      name: "Sarah Johnson",
      role: "Freelance Designer",
      image: "https://placehold.co/100x100/e2e8f0/475569?text=SJ",
      quote: "Trackify has completely transformed how I manage my freelance business. I've reduced the time spent on invoicing by 75% and get paid an average of 7 days faster!",
      metrics: [
        { label: "Time Saved", value: "10 hrs/week" },
        { label: "Faster Payments", value: "7 days" }
      ]
    },
    {
      name: "Michael Chen",
      role: "Small Business Owner",
      image: "https://placehold.co/100x100/e2e8f0/475569?text=MC",
      quote: "As my business grew, I needed a better way to track expenses and invoices. Trackify made it simple to scale our financial operations without hiring an accountant.",
      metrics: [
        { label: "Annual Savings", value: "$5,200" },
        { label: "Growth Supported", value: "3x" }
      ]
    },
    {
      name: "Emma Rodriguez",
      role: "Marketing Consultant",
      image: "https://placehold.co/100x100/e2e8f0/475569?text=ER",
      quote: "The reporting features in Trackify give me clear insights into my most profitable clients and projects. This has helped me make strategic decisions to grow my business.",
      metrics: [
        { label: "Revenue Increase", value: "32%" },
        { label: "Client Retention", value: "94%" }
      ]
    }
  ];

  useEffect(() => {
    if (inView) {
      const interval = setInterval(() => {
        set_current_index((prevIndex) => (prevIndex + 1) % successStories.length);
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [inView, successStories.length]);

  const nextStory = () => {
    set_current_index((prevIndex) => (prevIndex + 1) % successStories.length);
  };

  const prevStory = () => {
    set_current_index((prevIndex) => (prevIndex - 1 + successStories.length) % successStories.length);
  };

  return (
    <section id="success-stories" className="py-16 bg-neutral-light" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-text-primary sm:text-4xl">
            Success Stories
          </h2>
          <p className="mt-4 text-lg text-text-secondary max-w-2xl mx-auto">
            See how Trackify has helped businesses like yours succeed
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="md:flex">
              <div className="md:flex-shrink-0 bg-primary p-6 flex flex-col justify-center items-center">
                <img
                  className="h-24 w-24 rounded-full object-cover border-4 border-white"
                  src={successStories[currentIndex].image}
                  alt={successStories[currentIndex].name}
                  loading="lazy"
                />
                <div className="mt-4 text-center">
                  <h3 className="text-lg font-medium text-white">
                    {successStories[currentIndex].name}
                  </h3>
                  <p className="text-orange-200">
                    {successStories[currentIndex].role}
                  </p>
                  <div className="flex justify-center mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} className="text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-8 md:p-10">
                <blockquote>
                  <p className="text-xl font-medium text-text-primary leading-relaxed">
                    "{successStories[currentIndex].quote}"
                  </p>
                </blockquote>
                <div className="mt-8 grid grid-cols-2 gap-4">
                  {successStories[currentIndex].metrics.map((metric, index) => (
                    <div key={index} className="border border-neutral-light rounded-lg p-4">
                      <p className="text-sm text-text-secondary">{metric.label}</p>
                      <p className="text-2xl font-bold text-accent">{metric.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <div className="absolute top-1/2 -translate-y-1/2 -left-4 md:-left-6">
            <button
              onClick={prevStory}
              className="h-10 w-10 rounded-full bg-white shadow-md flex items-center justify-center text-text-secondary hover:bg-neutral-light focus:outline-none"
              aria-label="Previous story"
            >
              <ChevronLeft size={20} />
            </button>
          </div>

          <div className="absolute top-1/2 -translate-y-1/2 -right-4 md:-right-6">
            <button
              onClick={nextStory}
              className="h-10 w-10 rounded-full bg-white shadow-md flex items-center justify-center text-text-secondary hover:bg-neutral-light focus:outline-none"
              aria-label="Next story"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="mt-8 flex justify-center space-x-2">
            {successStories.map((_, index) => (
              <button
                key={index}
                onClick={() => set_current_index(index)}
                className={`h-2 w-2 rounded-full ${index === currentIndex ? 'bg-primary' : 'bg-gray-300'}`}
                aria-label={`Go to story ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuccessStoriesSection;
