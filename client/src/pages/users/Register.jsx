import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { registerStart, registerSuccess, registerFailure } from '../../redux/slices/userSlice';
import authApi from '../../api/authApi';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import AuthCarousel from '../../components/auth/AuthCarousel';
import { authCarouselSlides } from '../../components/auth/carouselData';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.user);
  const { tokens } = useSelector((state) => state.user);
  
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    password2: '',
    first_name: '',
    last_name: '',
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
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    // Username validation
    if (!formData.username) {
      errors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    }
    
    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    
    // Password confirmation
    if (formData.password !== formData.password2) {
      errors.password2 = 'Passwords do not match';
    }
    
    // First name validation
    if (!formData.first_name) {
      errors.first_name = 'First name is required';
    }
    
    // Last name validation
    if (!formData.last_name) {
      errors.last_name = 'Last name is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    dispatch(registerStart());
    
    try {
      const response = await authApi.register(formData);
      dispatch(registerSuccess());
      toast.success(response.message || 'Registration successful! Please check your email to verify your account.');
      navigate('/login');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      dispatch(registerFailure(errorMessage));
      toast.error(errorMessage);
      
      // Handle field-specific errors from backend
      if (error.response?.data?.errors) {
        setFormErrors(error.response.data.errors);
      }
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
            <h1 className="text-3xl font-bold text-text-primary">Create an Account</h1>
            <p className="mt-2 text-text-secondary">
              Start tracking your finances with Trackify
            </p>
          </div>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <Input
              id="first_name"
              name="first_name"
              label="First Name"
              type="text"
              value={formData.first_name}
              onChange={handleChange}
              error={formErrors.first_name}
              required
              placeholder="eg John"
            />
            
            <Input
              id="last_name"
              name="last_name"
              label="Last Name"
              type="text"
              value={formData.last_name}
              onChange={handleChange}
              error={formErrors.last_name}
              required
              placeholder="eg Doe"
            />
          </div>
          
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
            placeholder="eg john@example.com"
          />
          
          <Input
            id="username"
            name="username"
            label="Username"
            type="text"
            autoComplete="username"
            value={formData.username}
            onChange={handleChange}
            error={formErrors.username}
            required
            placeholder="eg johndoe"
          />
          
          <Input
            id="password"
            name="password"
            label="Password"
            type="password"
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
            error={formErrors.password}
            required
            placeholder="********"
          />
          
          <Input
            id="password2"
            name="password2"
            label="Confirm Password"
            type="password"
            autoComplete="new-password"
            value={formData.password2}
            onChange={handleChange}
            error={formErrors.password2}
            required
            placeholder="********"
          />
          
          <div>
            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isLoading}
              disabled={isLoading}
            >
              Sign Up
            </Button>
          </div>
        </form>
        
        <div className="mt-6">
          <p className="text-text-secondary">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:text-primary-hover font-medium">
              Sign in
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

export default Register;
