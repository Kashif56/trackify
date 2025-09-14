import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown, Sun, Moon } from 'lucide-react';
import { Link as ScrollLink } from 'react-scroll';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/userSlice.js';
import { toast } from 'react-toastify';

import logo from '../assets/logo.svg'


const Navbar = () => {
  const [isMenuOpen, set_is_menu_open] = useState(false);
  const [scrolled, set_scrolled] = useState(false);

  const { user, tokens } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();


  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        set_scrolled(isScrolled);
      }
    };

    document.addEventListener('scroll', handleScroll);
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const toggleMenu = () => {
    set_is_menu_open(!isMenuOpen);
  };

  const handleLogout = () => {

    dispatch(logout());
    toast.success('Logged out successfully');
    
  };

  return (
    <nav className={`${scrolled ? 'sticky top-0 z-20 shadow-md backdrop-blur bg-white/90 transition-all duration-300' : 'relative z-20'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img src={logo} alt="Trackify Logo" className="h-8 w-auto mr-2" />
             
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            <Link to="/" className="text-[#1F2937] hover:text-[#F97316] px-3 py-2 text-sm font-medium transition-colors duration-200">
              Home
            </Link>
            <ScrollLink to="features" smooth={true} duration={500} offset={-80} className="text-[#1F2937] hover:text-[#F97316] px-3 py-2 text-sm font-medium cursor-pointer transition-colors duration-200" style={{ zIndex: 10, position: 'relative' }}>
              Features
            </ScrollLink>
            <ScrollLink to="testimonials" smooth={true} duration={500} offset={-80} className="text-[#1F2937] hover:text-[#F97316] px-3 py-2 text-sm font-medium cursor-pointer transition-colors duration-200" style={{ zIndex: 10, position: 'relative' }}>
              Testimonials
            </ScrollLink>
            <ScrollLink to="pricing" smooth={true} duration={500} offset={-80} className="text-[#1F2937] hover:text-[#F97316] px-3 py-2 text-sm font-medium cursor-pointer transition-colors duration-200" style={{ zIndex: 10, position: 'relative' }}>
              Pricing
            </ScrollLink>
            <Link to="/contact" className="text-[#1F2937] hover:text-[#F97316] px-3 py-2 text-sm font-medium transition-colors duration-200">
              Contact
            </Link>

            {tokens.access ? (
              <div className="flex items-center space-x-4">
                <Link to="/dashboard" className="text-[#F97316] hover:text-[#EA580C] px-3 py-2 text-sm font-medium transition-colors duration-200">
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-md"
                >
                  Logout
                </button>
            </div>
            ) : ( <div className="flex items-center space-x-4">
                  <Link to="/login" className="text-[#F97316] hover:text-[#EA580C] px-3 py-2 text-sm font-medium transition-colors duration-200">
                    Login
                </Link>
                <Link to="/register" className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-md">
                  Register
                </Link>
              </div>)}


          </div>
          
          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-indigo-600 focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="block text-gray-700 hover:text-indigo-600 px-3 py-2 text-base font-medium">
              Home
            </Link>
            <Link to="/features" className="block text-gray-700 hover:text-indigo-600 px-3 py-2 text-base font-medium">
              Features
            </Link>
            <Link to="/pricing" className="block text-gray-700 hover:text-indigo-600 px-3 py-2 text-base font-medium">
              Pricing
            </Link>
            <Link to="/contact" className="block text-gray-700 hover:text-indigo-600 px-3 py-2 text-base font-medium">
              Contact
            </Link>
            <Link to="/login" className="block text-indigo-600 hover:text-indigo-800 px-3 py-2 text-base font-medium">
              Login
            </Link>
            <Link to="/register" className="block bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-base font-medium">
              Register
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

const Footer = () => {
  return (
    <footer className="bg-[#F9FAFB] border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center">
              <img src={logo} alt="Trackify Logo" className="h-8 w-auto mr-2" />
              <span className="text-xl font-bold text-[#F97316]">Trackify</span>
            </Link>
            <p className="mt-2 text-sm text-[#4B5563]">
              Simple and affordable invoice & expense tracking for freelancers and small businesses.
            </p>
          </div>
          
          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-[#1F2937] tracking-wider uppercase">Product</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/features" className="text-sm text-[#4B5563] hover:text-[#F97316] transition-colors duration-200">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-sm text-[#4B5563] hover:text-[#F97316] transition-colors duration-200">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Resources */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-[#1F2937] tracking-wider uppercase">Resources</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/contact" className="text-sm text-[#4B5563] hover:text-[#F97316] transition-colors duration-200">
                  Support
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-[#4B5563] hover:text-[#F97316] transition-colors duration-200">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Legal */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-[#1F2937] tracking-wider uppercase">Legal</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="#" className="text-sm text-[#4B5563] hover:text-[#F97316] transition-colors duration-200">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-[#4B5563] hover:text-[#F97316] transition-colors duration-200">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between">
          <p className="text-sm text-[#4B5563]">
            &copy; {new Date().getFullYear()} Trackify. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <a href="#" className="text-[#4B5563] hover:text-[#F97316] transition-colors duration-200">
              <span className="sr-only">Twitter</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
            <a href="#" className="text-[#4B5563] hover:text-[#F97316] transition-colors duration-200">
              <span className="sr-only">GitHub</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const BaseLayout = ({ children }) => {
  // Add effect to initialize dark mode from localStorage if needed
  useEffect(() => {
    // Check if user has a preference stored
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);
  return (
    <div className="flex flex-col min-h-screen bg-white transition-colors duration-300">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default BaseLayout;
