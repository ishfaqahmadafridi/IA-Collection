import json
from django.conf import settings
from rest_framework import serializers
from ..models import UserActivity, Subscription, DailySales
from ..constants import PUBLIC_ACTIVITY_TYPES

class UserActivitySerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True, allow_null=True)
    
    class Meta:
        model = UserActivity
        fields = '__all__'

class SubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        fields = '__all__'

class DailySalesSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailySales
        fields = '__all__'




class ActivityLogSerializer(serializers.Serializer):
    activity_type = serializers.ChoiceField(choices=PUBLIC_ACTIVITY_TYPES)
    metadata = serializers.JSONField(default=dict)

    def validate_metadata(self, value):
        if not isinstance(value, dict):
            raise serializers.ValidationError('Metadata must be a JSON object.')
        if len(json.dumps(value).encode()) > settings.ACTIVITY_METADATA_MAX_BYTES:
            raise serializers.ValidationError('Metadata exceeds the configured size limit.')
        return value

class NewsletterSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=254)
