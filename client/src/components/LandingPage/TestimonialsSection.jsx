import { Star } from 'lucide-react';

const testimonials = [
  {
    content: "Trackify has completely transformed how I manage my freelance business. Creating invoices is so simple, and I love being able to see my income and expenses at a glance.",
    author: "Sarah Johnson",
    role: "Freelance Designer",
    rating: 5,
  },
  {
    content: "As a small business owner, I needed something simple without the complexity of full accounting software. Trackify is exactly what I was looking for.",
    author: "Michael Chen",
    role: "Coffee Shop Owner",
    rating: 5,
  },
  {
    content: "I've tried many invoice tools, but Trackify stands out for its simplicity and affordability. The customer support is also excellent!",
    author: "Priya Patel",
    role: "Marketing Consultant",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  return (
    <div className="bg-gray-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">Testimonials</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Loved by freelancers and small businesses
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Don't just take our word for it — hear from some of our satisfied customers.
          </p>
        </div>
        
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:gap-8 lg:mt-20 lg:max-w-none lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="flex flex-col justify-between bg-white p-6 shadow-sm ring-1 ring-gray-200 rounded-2xl">
              <div>
                <div className="flex gap-1 text-yellow-400">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
                <p className="mt-6 text-base leading-7 text-gray-600">{testimonial.content}</p>
              </div>
              <div className="mt-6 border-t border-gray-100 pt-6">
                <div className="flex items-center gap-x-4">
                  <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 font-semibold">
                    {testimonial.author.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.author}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 flex justify-center">
          <div className="relative rounded-full px-6 py-3 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
            Join thousands of satisfied customers.{' '}
            <a href="/register" className="font-semibold text-indigo-600">
              <span className="absolute inset-0" aria-hidden="true" />
              Try it free <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection;
