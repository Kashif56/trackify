from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserCreateSerializer, UserSerializer, UserProfileUpdateSerializer, UserUpdateSerializer
from .models import UserProfile, EmailVerification

from subscription.models import Subscription
from subscription.serializers import SubscriptionSerializer

from invoice.models import Invoice
from invoice.serializers import InvoiceSerializer
from expense.models import Expense
from expense.serializers import ExpenseSerializer
from django.db.models import Sum
from django.utils import timezone
from datetime import timedelta, datetime
from trackify.utils import send_email


@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    """
    Register a new user and send verification email
    """
    serializer = UserCreateSerializer(data=request.data)
    
    if serializer.is_valid():
        user = serializer.save()
        
        # Create email verification token
        email_verification = EmailVerification.objects.create(user=user)
        
        # Send verification email
        verification_url = f"{settings.FRONTEND_URL}/verify-email/{email_verification.token}"
        
        # Email subject
        subject = 'Verify your Trackify account'
        
    
        plain_message = f"""Hello {user.first_name},

Thank you for registering with Trackify. Please verify your email address by clicking the link below:

{verification_url}

This link will expire in 24 hours.

If you did not create this account, please ignore this email.

Best regards,
The Trackify Team
"""
        
        # Send email
        try:
            send_email(user.email, subject, plain_message)
            print("Email sent successfully")
        except Exception as e:
            # Log the error but don't expose it to the user
            print(f"Error sending verification email: {e}")
        
        # Return user data without tokens (tokens will be provided after verification)
        return Response({
            'user': UserSerializer(user).data,
            'message': 'Registration successful. Please check your email to verify your account.'
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    """
    Authenticate a user and return tokens if email is verified
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
    
    # Check if email is verified
    if not user.profile.is_email_verified:
        # Check if there's an existing verification token
        try:
            email_verification = EmailVerification.objects.get(user=user)
            if email_verification.is_expired:
                # Create a new token if expired
                email_verification.delete()
                email_verification = EmailVerification.objects.create(user=user)
        except EmailVerification.DoesNotExist:
            # Create a new token if none exists
            email_verification = EmailVerification.objects.create(user=user)
        
        # Send verification email
        verification_url = f"{settings.FRONTEND_URL}/verify-email/{email_verification.token}"
        
        # Email subject
        subject = 'Verify your Trackify account'
        
        # Email message
        plain_message = f"""Hello {user.first_name},

Please verify your email address by clicking the link below:

{verification_url}

This link will expire in 24 hours.

If you did not create this account, please ignore this email.

Best regards,
The Trackify Team
"""
        
        # Send email
        try:
            send_email(user.email, subject, plain_message)
            print("Email sent successfully")
        except Exception as e:
            # Log the error but don't expose it to the user
            print(f"Error sending verification email: {e}")
        
        return Response({
            'error': 'Email not verified',
            'message': 'Please check your email to verify your account. A new verification link has been sent.'
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
    
    # Get user information if available
    try:

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


@api_view(['GET'])
@permission_classes([AllowAny])
def verify_email(request, token):
    """
    Verify user email using the token sent in the verification email
    """
    print(token)
    try:
        # Find the verification token
        email_verification = EmailVerification.objects.get(token=token)
        
        # Check if token is expired
        if email_verification.is_expired:
            return Response({
                'error': 'Verification link has expired',
                'message': 'Please request a new verification link by logging in.'
            }, status=status.HTTP_400_BAD_REQUEST)
        

        print("Token is valid")
        
        # Mark user as verified
        user = email_verification.user
        user.profile.is_email_verified = True
        user.profile.save()

        print("User is verified")
        
        # Delete the verification token
        email_verification.delete()

        print("Verification token deleted")
        
        # Generate tokens for the user
        refresh = RefreshToken.for_user(user)
        tokens = {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }
        
        return Response({
            'message': 'Email verified successfully',
            'user': UserSerializer(user).data,
            'tokens': tokens
        }, status=status.HTTP_200_OK)
        
    except EmailVerification.DoesNotExist:
        print("Verification Token does not exist")
        return Response({
            'error': 'Invalid verification link',
            'message': 'The verification link is invalid or has already been used.'
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def resend_verification_email(request):
    """
    Resend verification email to the user
    """
    email = request.data.get('email')

    print(email)
    
    if not email:
        return Response({
            'error': 'Email is required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user = User.objects.get(email=email)

    except User.DoesNotExist:
        print("User does not exist")
        # Don't reveal that the email doesn't exist for security reasons
        return Response({
            'message': 'If your email exists in our system, a verification link has been sent.'
        }, status=status.HTTP_200_OK)
    
    # Check if email is already verified
    if user.profile.is_email_verified:
        print("Email is already verified")
        return Response({
            'message': 'Your email is already verified. You can log in.'
        }, status=status.HTTP_200_OK)
    
    # Check if there's an existing verification token
    try:
        email_verification = EmailVerification.objects.get(user=user)
        if email_verification.is_expired:
            # Create a new token if expired
            email_verification.delete()
            email_verification = EmailVerification.objects.create(user=user)
    except EmailVerification.DoesNotExist:
        # Create a new token if none exists
        email_verification = EmailVerification.objects.create(user=user)
    
    # Send verification email
    verification_url = f"{settings.FRONTEND_URL}/verify-email/{email_verification.token}"
    
    # Email subject
    subject = 'Verify your Trackify account'
    
    # Email message
    plain_message = f"""Hello {user.first_name},

Please verify your email address by clicking the link below:

{verification_url}

This link will expire in 24 hours.

If you did not create this account, please ignore this email.

Best regards,
The Trackify Team
"""
    
    # Send email
    try:
        send_email(user.email, subject, plain_message)
        print("Verification email sent successfully")
    except Exception as e:
        # Log the error but don't expose it to the user
        print(f"Error sending verification email: {e}")
    
    return Response({
        'message': 'If your email exists in our system, a verification link has been sent.'
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_dashboard_data(request):
    """
    Get dashboard data including stats and recent invoices/expenses
    With optional date range filtering
    """
    user = request.user

    print(user)



    
    # Get date range parameters from query params
    start_date = request.query_params.get('start_date', None)
    end_date = request.query_params.get('end_date', None)
    range_type = request.query_params.get('range_type', 'last_30_days')
    
    # Set default date filters based on range_type if not explicitly provided
    if not start_date or not end_date:
        today = timezone.now()
        
        if range_type == 'last_30_days':
            end_date = today
            start_date = today - timedelta(days=30)
        elif range_type == 'last_month':
            last_month = today.replace(day=1) - timedelta(days=1)
            start_date = last_month.replace(day=1)
            end_date = last_month.replace(day=last_month.day)
        elif range_type == 'last_3_months':
            end_date = today
            start_date = today - timedelta(days=90)
        elif range_type == 'last_6_months':
            end_date = today
            start_date = today - timedelta(days=180)
        elif range_type == 'last_year':
            last_year = today.replace(year=today.year-1)
            start_date = last_year.replace(month=1, day=1)
            end_date = last_year.replace(month=12, day=31)
        else:  # Default to last 30 days
            end_date = today
            start_date = today - timedelta(days=30)
    else:
        # Convert string dates to datetime objects
        try:
            start_date = timezone.make_aware(datetime.strptime(start_date, '%Y-%m-%d'))
            # Set end_date to end of the day
            end_date = timezone.make_aware(datetime.strptime(end_date, '%Y-%m-%d'))
            end_date = end_date.replace(hour=23, minute=59, second=59)
        except ValueError:
            # If date parsing fails, default to last 30 days
            today = timezone.now()
            end_date = today
            start_date = today - timedelta(days=30)
    
    # Calculate total income from paid invoices within date range
    total_income = Invoice.objects.filter(
        user=user,
        status='paid',
        created_at__gte=start_date,
        created_at__lte=end_date
    ).aggregate(total=Sum('total'))['total'] or 0
    
    # Calculate total expenses within date range
    total_expenses = Expense.objects.filter(
        user=user,
        created_at__gte=start_date,
        created_at__lte=end_date
    ).aggregate(total=Sum('amount'))['total'] or 0
    
    # Calculate balance
    balance = total_income - total_expenses
    
    # Get recent invoices (last 5) within date range
    recent_invoices = Invoice.objects.filter(
        user=user,
        created_at__gte=start_date,
        created_at__lte=end_date
    ).order_by('-created_at')[:5]
    invoice_serializer = InvoiceSerializer(recent_invoices, many=True)
    
    # Get recent expenses (last 5) within date range
    recent_expenses = Expense.objects.filter(
        user=user,
        created_at__gte=start_date,
        created_at__lte=end_date
    ).order_by('-created_at')[:5]
    expense_serializer = ExpenseSerializer(recent_expenses, many=True)
    
    # Calculate trends based on previous period of equal length
    period_length = (end_date - start_date).days
    previous_start = start_date - timedelta(days=period_length)
    previous_end = start_date - timedelta(days=1)
    
    # Get previous period income
    previous_income = Invoice.objects.filter(
        user=user,
        status='paid',
        created_at__gte=previous_start,
        created_at__lte=previous_end
    ).aggregate(total=Sum('total'))['total'] or 0
    
    # Get previous period expenses
    previous_expenses = Expense.objects.filter(
        user=user,
        created_at__gte=previous_start,
        created_at__lte=previous_end
    ).aggregate(total=Sum('amount'))['total'] or 0
    
    # Calculate income trend percentage
    income_trend = 0
    if previous_income > 0:
        income_trend = ((total_income - previous_income) / previous_income) * 100
    
    # Calculate expense trend percentage
    expense_trend = 0
    if previous_expenses > 0:
        expense_trend = ((total_expenses - previous_expenses) / previous_expenses) * 100
    
    # Calculate balance trend
    balance_trend = 0
    previous_balance = previous_income - previous_expenses
    current_balance = total_income - total_expenses
    
    if previous_balance != 0:
        balance_trend = ((current_balance - previous_balance) / abs(previous_balance)) * 100
    
    return Response({
        'stats': {
            'total_income': total_income,
            'total_expenses': total_expenses,
            'balance': balance,
            'income_trend': round(income_trend, 2),
            'expense_trend': round(expense_trend, 2),
            'balance_trend': round(balance_trend, 2),
            'date_range': {
                'start_date': start_date.strftime('%Y-%m-%d'),
                'end_date': end_date.strftime('%Y-%m-%d'),
                'range_type': range_type
            }
        },
        'recent_invoices': invoice_serializer.data,
        'recent_expenses': expense_serializer.data
    }, status=status.HTTP_200_OK)
