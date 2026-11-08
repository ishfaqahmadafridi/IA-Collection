from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth.models import User
from django.contrib.auth.hashers import check_password
from .serializers import UserSerializer, ProfileUpdateSerializer
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from rest_framework import serializers
import base64
import binascii
import io
from PIL import Image, UnidentifiedImageError
from .models import UserProfile
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        # Get or create profile
        profile, _ = UserProfile.objects.get_or_create(user=self.user)
        data['user'] = {
            'id': self.user.id,
            'username': self.user.username,
            'email': self.user.email,
            'is_staff': self.user.is_staff,
            'profile_image': profile.profile_image or '',
        }
        return data


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = UserSerializer


class CustomTokenObtainPairView(TokenObtainPairView):
    permission_classes = (AllowAny,)
    serializer_class = CustomTokenObtainPairSerializer


@api_view(['POST', 'DELETE'])
@permission_classes([IsAuthenticated])
def upload_profile_image(request):
    profile, _ = UserProfile.objects.get_or_create(user=request.user)
    if request.method == 'DELETE':
        profile.profile_image = ''
        profile.save(update_fields=['profile_image'])
        return Response(status=status.HTTP_204_NO_CONTENT)
    image_data = request.data.get('profile_image', '')
    if not isinstance(image_data, str) or len(image_data) > 2800000:
        return Response({'profile_image': ['Image must be smaller than 2 MB.']}, status=400)
    try:
        header, encoded = image_data.split(',', 1)
        allowed = {'data:image/png;base64': 'PNG', 'data:image/jpeg;base64': 'JPEG', 'data:image/webp;base64': 'WEBP'}
        if header not in allowed:
            raise ValueError
        raw = base64.b64decode(encoded, validate=True)
        if len(raw) > 2 * 1024 * 1024:
            raise ValueError
        with Image.open(io.BytesIO(raw)) as image:
            if image.format != allowed[header] or image.width * image.height > 16000000:
                raise ValueError
            image.verify()
    except (ValueError, binascii.Error, UnidentifiedImageError, OSError, Image.DecompressionBombError):
        return Response({'profile_image': ['Provide a valid JPEG, PNG or WebP image smaller than 2 MB.']}, status=400)
    profile.profile_image = image_data
    profile.save(update_fields=['profile_image'])
    return Response({'image_url': image_data})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    """Change user password"""
    class PasswordSerializer(serializers.Serializer):
        currentPassword = serializers.CharField()
        newPassword = serializers.CharField()
    serializer = PasswordSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    current_password = serializer.validated_data['currentPassword']
    new_password = serializer.validated_data['newPassword']
    
    if not current_password or not new_password:
        return Response({'error': 'Current and new password are required'}, status=status.HTTP_400_BAD_REQUEST)
    
    if not check_password(current_password, request.user.password):
        return Response({'error': 'Current password is incorrect'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        validate_password(new_password, user=request.user)
    except ValidationError as error:
        return Response({'newPassword': error.messages}, status=400)
    request.user.set_password(new_password)
    request.user.save()
    
    return Response({'message': 'Password changed successfully'})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_profile(request):
    """Get user profile"""
    profile, _ = UserProfile.objects.get_or_create(user=request.user)
    return Response({
        'id': request.user.id,
        'username': request.user.username,
        'email': request.user.email,
        'name': request.user.first_name or request.user.username,
        'is_staff': request.user.is_staff,
        'profile_image': profile.profile_image or '',
    })


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    serializer = ProfileUpdateSerializer(request.user, data=request.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.save()
    profile, _ = UserProfile.objects.get_or_create(user=user)
    return Response({
        'id': user.id, 'username': user.username, 'name': user.first_name,
        'email': user.email, 'is_staff': user.is_staff,
        'profile_image': profile.profile_image or '',
    })
