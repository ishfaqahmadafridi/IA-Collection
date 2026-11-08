from rest_framework import serializers
from ..constants import PERIOD_DAYS, DEFAULT_PERIOD, DEFAULT_RECENT_DAYS, MAX_RECENT_DAYS, DEFAULT_TOP_PRODUCTS, MAX_TOP_PRODUCTS

class ProductQuerySerializer(serializers.Serializer):
    category = serializers.IntegerField(min_value=1, required=False)
    category_slug = serializers.SlugField(required=False)

class CategoryQuerySerializer(serializers.Serializer):
    parent = serializers.IntegerField(min_value=1, required=False)
    parent_only = serializers.BooleanField(required=False, default=False)

class RecentOrderQuerySerializer(serializers.Serializer):
    days = serializers.IntegerField(min_value=1, max_value=MAX_RECENT_DAYS, default=DEFAULT_RECENT_DAYS)

class AnalyticsQuerySerializer(serializers.Serializer):
    period = serializers.ChoiceField(choices=tuple(PERIOD_DAYS), default=DEFAULT_PERIOD)

class TopProductsQuerySerializer(serializers.Serializer):
    period = serializers.ChoiceField(choices=(*PERIOD_DAYS, 'all'), default='all')
    limit = serializers.IntegerField(min_value=1, max_value=MAX_TOP_PRODUCTS, default=DEFAULT_TOP_PRODUCTS)
    sort_by = serializers.ChoiceField(choices=('quantity', 'revenue'), default='quantity')

class OrderQuerySerializer(serializers.Serializer):
    from ..models import Order
    status = serializers.ChoiceField(choices=Order.STATUS_CHOICES, required=False)

class StockUpdateSerializer(serializers.Serializer):
    stock = serializers.IntegerField(min_value=0)


def validated_query(serializer_type, params):
    serializer = serializer_type(data=params)
    serializer.is_valid(raise_exception=True)
    return serializer.validated_data
