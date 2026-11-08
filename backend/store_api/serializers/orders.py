from collections.abc import Mapping
from rest_framework import serializers
from ..models import Order, OrderItem
from ..constants import ORDER_TRANSITIONS, CHECKOUT_MAX_LINES, CHECKOUT_MAX_QUANTITY, SHIPPING_ADDRESS_MIN_LENGTH, SHIPPING_ADDRESS_MAX_LENGTH

class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    total_price = serializers.ReadOnlyField()
    
    class Meta:
        model = OrderItem
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    allowed_statuses = serializers.SerializerMethodField()

    def get_allowed_statuses(self, obj):
        return [obj.status, *sorted(ORDER_TRANSITIONS[obj.status])]
    user_name = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = Order
        fields = '__all__'



class CheckoutItemSerializer(serializers.Serializer):
    product = serializers.IntegerField(min_value=1)
    quantity = serializers.IntegerField(min_value=1, max_value=CHECKOUT_MAX_QUANTITY)
    size = serializers.CharField(max_length=50, allow_blank=True, default='')

class CheckoutSerializer(serializers.Serializer):
    checkout_key = serializers.UUIDField()
    shipping_address = serializers.CharField(min_length=SHIPPING_ADDRESS_MIN_LENGTH, max_length=SHIPPING_ADDRESS_MAX_LENGTH)
    items = CheckoutItemSerializer(many=True, allow_empty=False, max_length=CHECKOUT_MAX_LINES)

class AdminOrderUpdateSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=Order.STATUS_CHOICES, required=False)
    notes = serializers.CharField(allow_blank=True, required=False, max_length=2000)

    def to_internal_value(self, data):
        if not isinstance(data, Mapping):
            return super().to_internal_value(data)
        unknown = set(data) - set(self.fields)
        if unknown:
            raise serializers.ValidationError({key: ['This field cannot be changed.'] for key in unknown})
        return super().to_internal_value(data)
