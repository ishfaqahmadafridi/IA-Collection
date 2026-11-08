from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from django.contrib.auth.models import User
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .serializers import UserSerializer, ProfileUpdateSerializer, PasswordChangeSerializer, ProfileImageSerializer
from .services.accounts import profile_data, change_user_password, save_profile_image
from .throttles import AuthenticationThrottle
from .services.activity import record_activity

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data['user'] = profile_data(self.user, self.context['request'])
        record_activity(self.context['request'], 'login', user=self.user)
        return data

class RegisterView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    throttle_classes = [AuthenticationThrottle]
    serializer_class = UserSerializer

class CustomTokenObtainPairView(TokenObtainPairView):
    permission_classes = [AllowAny]
    throttle_classes = [AuthenticationThrottle]
    serializer_class = CustomTokenObtainPairSerializer

class CustomTokenRefreshView(TokenRefreshView):
    permission_classes = [AllowAny]
    throttle_classes = [AuthenticationThrottle]

@api_view(['POST', 'DELETE'])
@permission_classes([IsAuthenticated])
def upload_profile_image(request):
    if request.method == 'DELETE':
        save_profile_image(request.user)
        return Response(status=status.HTTP_204_NO_CONTENT)
    serializer = ProfileImageSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    profile = save_profile_image(request.user, serializer.validated_data['profile_image'])
    return Response({'image_url': request.build_absolute_uri(profile.image.url)})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@throttle_classes([AuthenticationThrottle])
def change_password(request):
    serializer = PasswordChangeSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    change_user_password(request.user, serializer.validated_data['currentPassword'], serializer.validated_data['newPassword'])
    return Response({'message': 'Password changed successfully'})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_profile(request):
    return Response(profile_data(request.user, request))

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    serializer = ProfileUpdateSerializer(request.user, data=request.data)
    serializer.is_valid(raise_exception=True)
    return Response(profile_data(serializer.save(), request))
