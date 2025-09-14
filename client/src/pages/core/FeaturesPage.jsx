import BaseLayout from '../../layout/BaseLayout';
import FeaturesSection from '../../components/LandingPage/FeaturesSection';

const FeaturesPage = () => {
  return (
    <BaseLayout>
      <div className="pt-16 pb-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Features
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Discover all the powerful features that make Trackifye the perfect solution for freelancers and small businesses.
            </p>
          </div>
        </div>
      </div>
      <FeaturesSection />
    </BaseLayout>
  );
};

export default FeaturesPage;
