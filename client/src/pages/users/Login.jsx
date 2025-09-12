import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginStart, loginSuccess, loginFailure } from '../../redux/slices/userSlice';
import authApi from '../../api/authApi';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import AuthCarousel from '../../components/auth/AuthCarousel';
import { authCarouselSlides } from '../../components/auth/carouselData';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.user);
  const { tokens } = useSelector((state) => state.user);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const [formErrors, setFormErrors] = useState({});
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: '' });
    }
  };
  
  const validateForm = () => {
    const errors = {};
    
    // Email validation
    if (!formData.email) {
      errors.email = 'Email is required';
    }
    
    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    dispatch(loginStart());
    
    try {
      const response = await authApi.login(formData);
      dispatch(loginSuccess(response));
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
      dispatch(loginFailure(errorMessage));
      toast.error(errorMessage);
      
      // Handle field-specific errors from backend
      if (error.response?.data?.errors) {
        setFormErrors(error.response.data.errors);
      }
    }
  };
  
  const handleResendVerification = async () => {
    if (!formData.email) {
      setFormErrors({ ...formErrors, email: 'Email is required to resend verification' });
      return;
    }
    
    try {
      await authApi.resendVerification(formData.email);
      toast.success('If your email exists in our system, a verification link has been sent.');
    } catch (error) {
      toast.error('Failed to resend verification email. Please try again later.');
    }
  };

  useEffect(() => {
    if (tokens.access) {
      navigate('/dashboard');
    }
  }, [tokens.access]);


  
  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="w-full md:w-1/2 min-h-screen flex items-center justify-center bg-white p-4 md:p-8 lg:p-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-text-primary">Log in</h1>
            <p className="mt-2 text-text-secondary">
              Welcome back! Please enter your details.
            </p>
          </div>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          <Input
            id="email"
            name="email"
            label="Email Address"
            type="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            error={formErrors.email}
            required
            placeholder="Enter your email address"
          />
          
          <Input
            id="password"
            name="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            error={formErrors.password}
            required
            placeholder="Enter your password"
          />
          
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <button
                type="button"
                onClick={handleResendVerification}
                className="font-medium text-primary-orange hover:text-primary-orange/80"
              >
                Resend verification email
              </button>
            </div>
            <div className="text-sm">
              <a href="#" className="font-medium text-primary-orange hover:text-primary-orange/80">
                Forgot your password?
              </a>
            </div>
          </div>
          
          <div>
            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isLoading}
              disabled={isLoading}
            >
              Sign In
            </Button>
          </div>
        </form>
        
        <div className="mt-6">
          <p className="text-text-secondary">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary hover:text-primary-hover font-medium">
              Sign up
            </Link>
          </p>
        </div>
        </div>
      </div>
      
      {/* Right side - Carousel */}
      <div className="hidden md:block md:w-1/2 bg-text-primary">
        <AuthCarousel slides={authCarouselSlides} />
      </div>
    </div>
  );
};

export default Login;
