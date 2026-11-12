from rest_framework import serializers
from ..models import Product
from ..services.live_tryon import validate_product


class LiveTryOnProductSerializer(serializers.Serializer):
    product_id = serializers.PrimaryKeyRelatedField(queryset=Product.objects.select_related('category'), source='product')

    def validate_product_id(self, product):
        return validate_product(product)


class LiveTryOnTokenSerializer(LiveTryOnProductSerializer):
    consent = serializers.BooleanField()

    def validate_consent(self, value):
        if not value:
            raise serializers.ValidationError('Agree to live video processing before starting.')
        return value
