import { useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { verifyEmailStart, verifyEmailSuccess, verifyEmailFailure } from '../../redux/slices/userSlice';
import authApi from '../../api/authApi';
import Button from '../../components/ui/Button';

const VerifyEmail = () => {
  const { token } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [verificationStatus, setVerificationStatus] = useState({
    loading: true,
    success: false,
    message: 'Verifying your email...',
  });
  
  // Use a ref to track if verification has been attempted
  const verificationAttempted = useRef(false);
  
  useEffect(() => {
    // Only verify email if it hasn't been attempted yet
    if (verificationAttempted.current || !token) {
      if (!token) {
        setVerificationStatus({
          loading: false,
          success: false,
          message: 'Verification token is missing.',
        });
      }
      return;
    }

    const verifyEmailToken = async () => {
      // Mark verification as attempted to prevent multiple calls
      verificationAttempted.current = true;
      
      dispatch(verifyEmailStart());
      
      try {
        console.log('Verifying email with token:', token);
        const response = await authApi.verifyEmail(token);
        console.log('Verification response:', response);
        dispatch(verifyEmailSuccess(response));
        
        setVerificationStatus({
          loading: false,
          success: true,
          message: response.message || 'Email verified successfully!',
        });
        
        // Auto-redirect to dashboard after successful verification
        // setTimeout(() => {
        //   navigate('/dashboard');
        // }, 3000);
        
      } catch (error) {
        console.error('Verification error:', error);
        const errorMessage = error.response?.data?.message || 'Email verification failed. Please try again.';
        
        dispatch(verifyEmailFailure(errorMessage));
        
        setVerificationStatus({
          loading: false,
          success: false,
          message: errorMessage,
        });
        
        toast.error(errorMessage);
      }
    };
    
    verifyEmailToken();
  }, [token]); // Only depend on token, not dispatch or navigate
  
  const handleResendVerification = () => {
    navigate('/login');
    toast.info('Please use the "Resend verification email" option on the login page.');
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-light-gray py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold text-dark-gray mb-4">Email Verification</h1>
        
        {verificationStatus.loading ? (
          <div className="my-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-orange mx-auto"></div>
            <p className="mt-4 text-medium-gray">{verificationStatus.message}</p>
          </div>
        ) : (
          <div className="my-8">
            {verificationStatus.success ? (
              <>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-success-green/20">
                  <svg
                    className="h-8 w-8 text-success-green"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="mt-4 text-medium-gray">{verificationStatus.message}</p>
                <p className="mt-2 text-medium-gray">Redirecting to dashboard...</p>
              </>
            ) : (
              <>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-error-red/20">
                  <svg
                    className="h-8 w-8 text-error-red"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
                <p className="mt-4 text-medium-gray">{verificationStatus.message}</p>
                <Button
                  onClick={handleResendVerification}
                  variant="primary"
                  size="medium"
                  className="mt-4"
                >
                  Resend Verification Email
                </Button>
              </>
            )}
          </div>
        )}
        
        <div className="mt-6">
          <Link
            to="/login"
            className="text-primary-orange hover:text-primary-orange/80 font-medium"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
