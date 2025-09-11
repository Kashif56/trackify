import BaseLayout from '../../layout/BaseLayout';
import PricingSection from '../../components/LandingPage/PricingSection';

const PricingPage = () => {
  return (
    <BaseLayout>
      <div className="pt-16 pb-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Pricing
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Simple, transparent pricing plans designed for businesses of all sizes.
            </p>
          </div>
        </div>
      </div>
      <PricingSection />
    </BaseLayout>
  );
};

export default PricingPage;
