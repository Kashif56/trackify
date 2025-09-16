import { useState, useEffect } from 'react';
import { X, Monitor } from 'lucide-react';

const MobileWarning = () => {
  const [isVisible, set_is_visible] = useState(false);
  const [isMobile, set_is_mobile] = useState(false);
  
  useEffect(() => {
    // Check if the device is mobile (screen width less than 768px)
    const checkMobile = () => {
      const isMobileDevice = window.innerWidth < 768;
      set_is_mobile(isMobileDevice);
      
      // Only show the warning if it's a mobile device
      if (isMobileDevice) {
        set_is_visible(true);
      } else {
        set_is_visible(false);
      }
    };
    
    // Check on initial load
    checkMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkMobile);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  // If not mobile or dismissed, don't render anything
  if (!isVisible || !isMobile) return null;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-indigo-600 text-white p-4 z-50 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Monitor className="h-5 w-5 mr-2" />
          <p className="text-sm font-medium">
            For a better experience, please use a desktop or wider screen.
          </p>
        </div>
        <button 
          onClick={() => set_is_visible(false)}
          className="text-white hover:text-indigo-200 focus:outline-none"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default MobileWarning;
