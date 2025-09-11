import { useState } from 'react';
import BaseLayout from '../../layout/BaseLayout';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const ContactPage = () => {
  const [form_data, set_form_data] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handle_change = (e) => {
    const { name, value } = e.target;
    set_form_data(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handle_submit = (e) => {
    e.preventDefault();
    // Form submission logic would go here
    console.log('Form submitted:', form_data);
    // Reset form after submission
    set_form_data({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
    // Show success message (would use react-toastify in a real implementation)
    alert('Message sent successfully!');
  };

  return (
    <BaseLayout>
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Contact Us
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Have questions or need help? We're here for you.
            </p>
          </div>
          
          <div className="mx-auto mt-16 grid max-w-7xl grid-cols-1 gap-x-8 gap-y-12 lg:grid-cols-2">
            {/* Contact Information */}
            <div className="flex flex-col gap-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Get in Touch</h2>
                <p className="mt-4 text-base text-gray-600">
                  We'd love to hear from you. Our friendly team is always here to chat.
                </p>
              </div>
              
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
                    <Mail className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Email</p>
                    <p className="mt-1 text-gray-600">support@trackify.com</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
                    <Phone className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Phone</p>
                    <p className="mt-1 text-gray-600">+1 (555) 123-4567</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
                    <MapPin className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Office</p>
                    <p className="mt-1 text-gray-600">123 Business Ave, Suite 100, San Francisco, CA 94107</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="rounded-2xl bg-white p-8 shadow-lg ring-1 ring-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Send us a message</h2>
              <form onSubmit={handle_submit} className="mt-6 space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={form_data.name}
                    onChange={handle_change}
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={form_data.email}
                    onChange={handle_change}
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={form_data.subject}
                    onChange={handle_change}
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={form_data.message}
                    onChange={handle_change}
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  />
                </div>
                
                <div>
                  <button
                    type="submit"
                    className="flex w-full items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Send Message <Send className="ml-2 h-4 w-4" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
};

export default ContactPage;
