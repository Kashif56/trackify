from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views
from . import views_bank_account


urlpatterns = [
    # Authentication endpoints
    path('register/', views.register_user, name='register'),
    path('login/', views.login_user, name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Email verification
    path('verify-email/<uuid:token>/', views.verify_email, name='verify_email'),
    path('resend-verification/', views.resend_verification_email, name='resend_verification'),
    
    # User profile
    path('profile/', views.get_user_profile, name='user_profile'),
    path('profile/update/', views.update_user_profile, name='update_user_profile'),
    path('profile/details/', views.get_user_details, name='user_details'),
    
    # Dashboard
    path('dashboard/', views.get_dashboard_data, name='dashboard_data'),
    
    # Bank Account
    path('bank-account/', views_bank_account.BankAccountView.as_view(), name='bank_account'),
]