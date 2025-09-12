from django.http import JsonResponse
from rest_framework import status
from rest_framework_simplejwt.authentication import JWTAuthentication


class EmailVerificationMiddleware:
    """
    Middleware to ensure users have verified their email before accessing protected endpoints.
    """
    def __init__(self, get_response):
        self.get_response = get_response
        self.jwt_auth = JWTAuthentication()
        
        # Endpoints that don't require email verification
        self.exempt_paths = [
            '/api/users/login/',
            '/api/users/register/',
            '/api/users/verify-email/',
            '/api/users/resend-verification/',
            '/api/users/token/refresh/',
            '/admin/',
        ]
    
    def __call__(self, request):
        # Skip middleware for exempt paths
        if any(request.path.startswith(path) for path in self.exempt_paths):
            return self.get_response(request)
        
        # Skip middleware for non-API paths
        if not request.path.startswith('/api/'):
            return self.get_response(request)
        
        # Try to authenticate with JWT
        try:
            auth_header = request.META.get('HTTP_AUTHORIZATION', '')
            if auth_header.startswith('Bearer '):
                # Extract the validated user
                validated_token = self.jwt_auth.get_validated_token(auth_header.split(' ')[1])
                user = self.jwt_auth.get_user(validated_token)
                
                # Check if email is verified
                if not user.profile.is_email_verified:
                    return JsonResponse(
                        {
                            'error': 'Email not verified',
                            'message': 'Please verify your email before accessing this feature.'
                        },
                        status=status.HTTP_403_FORBIDDEN
                    )
        except Exception:
            # If authentication fails, let the regular authentication process handle it
            pass
        
        # Continue with the request
        return self.get_response(request)
