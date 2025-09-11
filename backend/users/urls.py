from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views


urlpatterns = [
    # Authentication endpoints
    path('register/', views.register_user, name='register'),
    path('login/', views.login_user, name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # User profile
    path('profile/', views.get_user_profile, name='user_profile'),
]