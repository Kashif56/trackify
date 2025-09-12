from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from .models import UserProfile


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for the UserProfile model"""
    
    class Meta:
        model = UserProfile
        fields = ['company_name', 'phone_number', 'address', 'city', 'state',
                 'country', 'zip_code', 'profile_picture']


class UserSerializer(serializers.ModelSerializer):
    """Serializer for the User model with profile data"""
    profile = UserProfileSerializer(read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'first_name', 'last_name', 'profile']
        read_only_fields = ['id']


class UserCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating a new user"""
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = User
        fields = ['email', 'username', 'password', 'password2', 'first_name', 'last_name']
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user


class UserUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating user data"""
    
    class Meta:
        model = User
        fields = ['first_name', 'last_name']


class UserProfileUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating user profile data"""
    
    class Meta:
        model = UserProfile
        fields = ['company_name', 'phone_number', 'address', 'city', 'state',
                 'country', 'zip_code', 'profile_picture']
