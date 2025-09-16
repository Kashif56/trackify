import { useState } from 'react';
import BaseLayout from '../../layout/BaseLayout';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { sendContactMessage } from '../../api/contactApi';

const ContactPage = () => {
  const [form_data, set_form_data] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, set_loading] = useState(false);
  const [status, set_status] = useState(null); // 'success', 'error', or null

  const handle_change = (e) => {
    const { name, value } = e.target;
    set_form_data(prev => ({
      ...prev,
      [name]: value
    }));
    // Reset status when user starts typing again
    if (status) set_status(null);
  };

  const handle_submit = async (e) => {
    e.preventDefault();
    set_loading(true);
    set_status(null);
    
    try {
      await sendContactMessage(form_data);
      
      // Reset form after successful submission
      set_form_data({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      set_status('success');
      toast.success('Message sent successfully! We will get back to you soon.');
    } catch (error) {
      console.error('Error sending message:', error);
      set_status('error');
      toast.error(error.error || 'Failed to send message. Please try again later.');
    } finally {
      set_loading(false);
    }
  };

  return (
    <BaseLayout>
      <div className="bg-gradient-to-b from-white to-indigo-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center justify-center px-4 py-1 mb-6 rounded-full bg-indigo-100 text-indigo-700">
              <span className="text-sm font-medium">Get in Touch</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Contact Us
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Have questions or need help? We're here for you. Our team is ready to assist with any inquiries you may have.
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
                    <p className="mt-1 text-gray-600">info@trackifye.com</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
                    <Phone className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Phone</p>
                    <p className="mt-1 text-gray-600">+92 (349) 2648060</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
                    <MapPin className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Office</p>
                    <p className="mt-1 text-gray-600">Jhelum, Pakistan</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="rounded-2xl bg-white p-8 shadow-xl ring-1 ring-gray-200 hover:shadow-2xl transition-all duration-300">
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
                    disabled={loading}
                    className={`flex w-full items-center justify-center rounded-md px-3 py-3 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all duration-300 ${loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500'}`}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
                      </>
                    ) : status === 'success' ? (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" /> Message Sent
                      </>
                    ) : status === 'error' ? (
                      <>
                        <AlertCircle className="mr-2 h-4 w-4" /> Try Again
                      </>
                    ) : (
                      <>
                        Send Message <Send className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
                
                {status === 'success' && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-sm text-green-700 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Your message has been sent successfully! We'll get back to you soon.
                    </p>
                  </div>
                )}
                
                {status === 'error' && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-700 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      There was an error sending your message. Please try again.
                    </p>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
};

export default ContactPage;
