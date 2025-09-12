from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserCreateSerializer, UserSerializer, UserProfileUpdateSerializer, UserUpdateSerializer
from .models import UserProfile


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


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_user_profile(request):
    """
    Update the current user's profile and basic information
    """
    user = request.user
    
    # Update User model data
    user_serializer = UserUpdateSerializer(user, data=request.data, partial=True)
    if user_serializer.is_valid():
        user_serializer.save()
    else:
        return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    # Update UserProfile model data
    profile_serializer = UserProfileUpdateSerializer(user.profile, data=request.data, partial=True)
    if profile_serializer.is_valid():
        profile_serializer.save()
    else:
        return Response(profile_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    # Return updated user data
    return Response(UserSerializer(user).data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_details(request):
    """
    Get detailed information about the current user including profile and subscription details
    """
    user = request.user
    
    # Get user data with profile
    user_data = UserSerializer(user).data
    
    # Get subscription information if available
    try:
        from subscription.models import Subscription
        from subscription.serializers import SubscriptionSerializer
        
        subscription = Subscription.objects.filter(user=user, status='active').first()
        if subscription:
            subscription_data = SubscriptionSerializer(subscription).data
            user_data['subscription'] = subscription_data
        else:
            user_data['subscription'] = None
    except ImportError:
        # If subscription app is not available
        user_data['subscription'] = None
    
    return Response(user_data, status=status.HTTP_200_OK)
