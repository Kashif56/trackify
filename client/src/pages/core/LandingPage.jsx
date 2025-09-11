import { lazy, Suspense } from 'react';
import BaseLayout from '../../layout/BaseLayout';
import BasicSEO from '../../components/SEO/BasicSEO';
import ScrollToTopButton from '../../components/UI/ScrollToTopButton';
import CookieConsent from '../../components/UI/CookieConsent';
import AnnouncementBar from '../../components/UI/AnnouncementBar';
import PreloadResources from '../../components/UI/PreloadResources';

// Eager loaded components (above the fold)
import HeroSection from '../../components/LandingPage/HeroSection';

// Lazy loaded components (below the fold)
const FeaturesSection = lazy(() => import('../../components/LandingPage/FeaturesSection'));

const HowItWorksSection = lazy(() => import('../../components/LandingPage/HowItWorksSection'));
const StatsCounterSection = lazy(() => import('../../components/LandingPage/StatsCounterSection'));
const TestimonialsSection = lazy(() => import('../../components/LandingPage/TestimonialsSection'));
const SuccessStoriesSection = lazy(() => import('../../components/LandingPage/SuccessStoriesSection'));
const CTABanner = lazy(() => import('../../components/LandingPage/CTABanner'));
const PricingSection = lazy(() => import('../../components/LandingPage/PricingSection'));


// Loading skeleton component
const SectionSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-8 bg-neutral-light rounded w-1/3 mx-auto mb-4"></div>
    <div className="h-4 bg-neutral-light rounded w-1/2 mx-auto mb-8"></div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto px-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-64 bg-neutral-light rounded"></div>
      ))}
    </div>
  </div>
);

const LandingPage = () => {
  return (
    <BaseLayout>
      <BasicSEO 
        title="Trackify - Simple Invoice & Expense Tracking for Small Businesses" 
        description="Trackify helps freelancers and small businesses create professional invoices, track expenses, and get paid faster."
      />
      <PreloadResources />
      <ScrollToTopButton />
      <CookieConsent />
      <AnnouncementBar />
      
      {/* Hero section - eagerly loaded */}
      <HeroSection />
      
      {/* Lazy loaded sections with suspense fallbacks */}
      <Suspense fallback={<SectionSkeleton />}>
        <div id="features">
          <FeaturesSection />
        </div>
      </Suspense>
      
      <Suspense fallback={<SectionSkeleton />}>
        <HowItWorksSection />
      </Suspense>
      
      <Suspense fallback={<SectionSkeleton />}>
        <StatsCounterSection />
      </Suspense>
      
      <Suspense fallback={<SectionSkeleton />}>
        <div id="testimonials">
          <TestimonialsSection />
        </div>
      </Suspense>
      
      <Suspense fallback={<SectionSkeleton />}>
        <SuccessStoriesSection />
      </Suspense>
      
      <Suspense fallback={<div className="py-16"></div>}>
        <CTABanner />
      </Suspense>
      
      <Suspense fallback={<SectionSkeleton />}>
        <div id="pricing">
          <PricingSection />
        </div>
      </Suspense>

    </BaseLayout>
  );
};

export default LandingPage;
