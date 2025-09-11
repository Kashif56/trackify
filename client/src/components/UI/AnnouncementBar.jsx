import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell } from 'lucide-react';

const AnnouncementBar = () => {
  const [isVisible, set_is_visible] = useState(false);
  const [announcement, set_announcement] = useState({
    message: '🎉 Special offer: Get 3 months free when you sign up for an annual plan!',
    link: '/pricing',
    linkText: 'Learn more',
    id: 'promo-2025-09'
  });

  useEffect(() => {
    // Check if this specific announcement has been dismissed
    const dismissedAnnouncements = JSON.parse(localStorage.getItem('dismissed-announcements') || '[]');
    
    if (!dismissedAnnouncements.includes(announcement.id)) {
      // Show announcement after a short delay
      const timer = setTimeout(() => {
        set_is_visible(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [announcement.id]);

  const dismissAnnouncement = () => {
    // Save to localStorage so it doesn't show again
    const dismissedAnnouncements = JSON.parse(localStorage.getItem('dismissed-announcements') || '[]');
    dismissedAnnouncements.push(announcement.id);
    localStorage.setItem('dismissed-announcements', JSON.stringify(dismissedAnnouncements));
    
    // Hide the announcement
    set_is_visible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed top-20 right-4 max-w-sm w-full bg-white rounded-lg shadow-lg border border-neutral-light z-50 overflow-hidden"
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <div className="p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <Bell size={20} className="text-primary" />
              </div>
              <div className="ml-3 w-0 flex-1">
                <p className="text-sm font-medium text-text-primary">
                  {announcement.message}
                </p>
                {announcement.link && (
                  <p className="mt-1">
                    <a 
                      href={announcement.link} 
                      className="text-sm font-medium text-primary hover:text-primary-hover"
                    >
                      {announcement.linkText}
                    </a>
                  </p>
                )}
              </div>
              <div className="ml-4 flex-shrink-0 flex">
                <button
                  onClick={dismissAnnouncement}
                  className="bg-white rounded-md inline-flex text-text-secondary hover:text-text-primary focus:outline-none"
                >
                  <span className="sr-only">Close</span>
                  <X size={16} aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
          <div className="h-1 w-full bg-gradient-to-r from-primary to-accent"></div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AnnouncementBar;
