from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, trim_whitespace=False)
    is_staff = serializers.BooleanField(read_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'is_staff')

    def validate(self, attrs):
        user = User(username=attrs.get("username", ""), email=attrs.get("email", ""))
        try:
            validate_password(attrs["password"], user=user)
        except DjangoValidationError as error:
            raise serializers.ValidationError({"password": error.messages})
        return attrs

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )
        return user

class ProfileUpdateSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='first_name', max_length=150, allow_blank=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'name')
        extra_kwargs = {'email': {'required': True, 'allow_blank': False}}

class PasswordChangeSerializer(serializers.Serializer):
    currentPassword = serializers.CharField(trim_whitespace=False)
    newPassword = serializers.CharField(trim_whitespace=False)

class ProfileImageSerializer(serializers.Serializer):
    profile_image = serializers.CharField(trim_whitespace=False)

    def validate_profile_image(self, value):
        from ..validators.images import decode_profile_image
        return decode_profile_image(value)
