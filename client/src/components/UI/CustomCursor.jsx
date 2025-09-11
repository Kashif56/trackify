import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const CustomCursor = () => {
  
  const [mousePosition, set_mouse_position] = useState({ x: 0, y: 0 });
  const [isHovering, set_is_hovering] = useState(false);
  const [isDesktop, set_is_desktop] = useState(false);
  const [isMounted, set_is_mounted] = useState(false);

  useEffect(() => {
    set_is_mounted(true);
    
    // Check if desktop
    const checkDevice = () => {
      set_is_desktop(window.innerWidth > 1024);
    };
    checkDevice();
    
    // Mouse events
    const handleMouseMove = (e) => {
      set_mouse_position({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e) => {
      // Check if the element or its parents have clickable elements
      const isClickable = e.target.closest('a, button, input, select, textarea, [role="button"]');
      set_is_hovering(!!isClickable);
    };

    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('resize', checkDevice);
    
    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('resize', checkDevice);
    };
  }, []);

  // Don't render anything until component is mounted and only on desktop
  if (!isMounted || !isDesktop) return null;

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border-2 border-indigo-500 dark:border-indigo-400 pointer-events-none z-[9999]"
        animate={{
          x: mousePosition.x - 16,
          y: mousePosition.y - 16,
          scale: isHovering ? 1.5 : 1,
          opacity: 0.8
        }}
        transition={{
          type: 'spring',
          mass: 0.3,
          stiffness: 100,
          damping: 10
        }}
      />
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-indigo-600 dark:bg-indigo-400 rounded-full pointer-events-none z-[9999]"
        animate={{
          x: mousePosition.x - 4,
          y: mousePosition.y - 4
        }}
        transition={{
          type: 'spring',
          mass: 0.1,
          stiffness: 150,
          damping: 8
        }}
      />
    </>
  );
};

export default CustomCursor;
