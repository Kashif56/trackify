import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const CookieConsent = () => {
  const [isVisible, set_is_visible] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const hasConsented = localStorage.getItem('cookie-consent');
    
    if (!hasConsented) {
      // Show banner after a short delay
      const timer = setTimeout(() => {
        set_is_visible(true);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'true');
    set_is_visible(false);
  };

  const declineCookies = () => {
    localStorage.setItem('cookie-consent', 'false');
    set_is_visible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-0 left-0 right-0 bg-white shadow-lg z-50 border-t border-neutral-light"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between">
            <div className="flex-1 pr-4 mb-4 sm:mb-0">
              <p className="text-sm text-text-secondary">
                We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.
                <a href="/privacy-policy" className="text-primary hover:underline ml-1">
                  Learn more
                </a>
              </p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={declineCookies}
                className="px-4 py-2 text-sm font-medium text-text-secondary hover:bg-neutral-light rounded-md transition-colors duration-200"
              >
                Decline
              </button>
              <button
                onClick={acceptCookies}
                className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-hover rounded-md transition-colors duration-200"
              >
                Accept All
              </button>
              <button
                onClick={declineCookies}
                className="sm:hidden p-2 text-text-secondary hover:text-text-primary"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
