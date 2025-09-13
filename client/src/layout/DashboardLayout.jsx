import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/userSlice';
import { toast } from 'react-toastify';
import { 
  Menu, X, ChevronDown, Sun, Moon, 
  Home, FileText, DollarSign, Users, 
  Settings, LogOut, BarChart2
} from 'lucide-react';

const Navbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('tokens');
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 fixed z-30 w-full">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start">
            <button 
              id="toggleSidebarMobile" 
              aria-expanded="true" 
              aria-controls="sidebar" 
              className="lg:hidden mr-2 text-gray-600 hover:text-gray-900 cursor-pointer p-2 hover:bg-gray-100 focus:bg-gray-100 focus:ring-2 focus:ring-gray-100 rounded"
              onClick={() => document.querySelector('#sidebar').classList.toggle('-translate-x-full')}
            >
              <Menu className="w-6 h-6" />
            </button>
            <Link to="/" className="flex items-center">
              <span className="self-center text-xl font-bold whitespace-nowrap text-[#F97316]">Trackify</span>
            </Link>
          </div>
          <div className="flex items-center">
            <div className="hidden lg:flex items-center">
              <span className="text-base font-normal text-gray-500 mr-5">
                Welcome, {user?.first_name || user?.username || 'User'}
              </span>
            </div>
            
            {/* Profile dropdown */}
            <div className="relative">
              <button 
                type="button" 
                className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <span className="sr-only">Open user menu</span>
                {user?.profile_picture ? (
                  <img className="w-8 h-8 rounded-full" src={user.profile_picture} alt="user photo" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#F97316] flex items-center justify-center text-white font-medium">
                    {user?.first_name?.[0] || user?.username?.[0] || 'U'}
                  </div>
                )}
              </button>
              
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Your Profile
                  </Link>
                  <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

const Sidebar = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Invoices', href: '/invoices', icon: FileText },
    { name: 'Expenses', href: '/expenses', icon: DollarSign },
    { name: 'Clients', href: '/clients', icon: Users },
    { name: 'Analytics', href: '/analytics', icon: BarChart2 },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <aside id="sidebar" className="fixed top-0 left-0 z-20 flex flex-col flex-shrink-0 w-64 h-full pt-16 font-normal duration-75 lg:flex transition-width transition-transform -translate-x-full lg:translate-x-0 border-r border-gray-200 bg-white">
      <div className="h-full px-3 py-4 overflow-y-auto bg-white">
        <ul className="space-y-2 font-medium">
          {navigation.map((item) => (
            <li key={item.name}>
              <Link
                to={item.href}
                className={`flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group ${
                  isActive(item.href) ? 'bg-gray-100' : ''
                }`}
              >
                <item.icon className={`w-5 h-5 text-gray-500 transition duration-75 group-hover:text-[#F97316] ${
                  isActive(item.href) ? 'text-[#F97316]' : ''
                }`} />
                <span className={`ml-3 ${isActive(item.href) ? 'font-medium' : ''}`}>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

const DashboardLayout = ({ children }) => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <Sidebar />
      <div className="lg:ml-64 bg-white p-4  pt-20">
        <div className="p-4 bg-white rounded-lg">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
