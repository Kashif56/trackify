import { useEffect } from 'react';

const PreloadResources = () => {
  useEffect(() => {
    // Preload critical images
    const preloadImages = [
      'https://placehold.co/1200x800/e2e8f0/475569?text=Trackify+Dashboard+Preview',
      'https://placehold.co/200x80/e2e8f0/475569?text=Partner+1',
      'https://placehold.co/200x80/e2e8f0/475569?text=Partner+2'
    ];

    preloadImages.forEach(src => {
      const img = new Image();
      img.src = src;
    });

    // Preload web fonts if needed
    const preloadFonts = () => {
      if ('fonts' in document) {
        // Load Poppins font variants
        Promise.all([
          document.fonts.load('1em Poppins'),
          document.fonts.load('bold 1em Poppins')
        ]).then(() => {
          // Fonts are loaded
          document.documentElement.classList.add('fonts-loaded');
        });
      }
    };

    preloadFonts();
  }, []);

  return null; // This component doesn't render anything
};

export default PreloadResources;
