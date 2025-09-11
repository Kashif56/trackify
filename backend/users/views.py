from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserCreateSerializer, UserSerializer

User = get_user_model()


@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    """
    Register a new user
    """
    serializer = UserCreateSerializer(data=request.data)
    
    if serializer.is_valid():
        user = serializer.save()
        
        # Generate tokens for the user
        refresh = RefreshToken.for_user(user)
        tokens = {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }
        
        # Return user data and tokens
        return Response({
            'user': UserSerializer(user).data,
            'tokens': tokens
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    """
    Authenticate a user and return tokens
    """
    email = request.data.get('email')
    password = request.data.get('password')
    
    # Validate input
    if not email or not password:
        return Response({
            'error': 'Please provide both email and password'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({
            'error': 'Invalid credentials'
        }, status=status.HTTP_401_UNAUTHORIZED)
    
    # Check password
    if not user.check_password(password):
        return Response({
            'error': 'Invalid credentials'
        }, status=status.HTTP_401_UNAUTHORIZED)
    
    # Generate tokens
    refresh = RefreshToken.for_user(user)
    tokens = {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }
    
    return Response({
        'user': UserSerializer(user).data,
        'tokens': tokens
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    """
    Get the current user's profile
    """
    serializer = UserSerializer(request.user)
    return Response(serializer.data)
