from rest_framework import serializers
from urllib.parse import urlparse
from ..models import Category, Product

class ProductSerializer(serializers.ModelSerializer):
    image = serializers.CharField(required=False, allow_blank=True, max_length=2048)

    def validate_image(self, value):
        if not value:
            return value
        parsed = urlparse(value)
        relative = value.startswith('/') and not value.startswith('//') and not parsed.netloc
        if relative or (parsed.scheme in {'http', 'https'} and parsed.netloc and not parsed.username):
            return value
        raise serializers.ValidationError('Use an HTTP(S) URL or a local image path; inline image payloads are not supported.')

    stock_status = serializers.ReadOnlyField()
    is_in_stock = serializers.ReadOnlyField()
    category_name = serializers.CharField(source='category.name', read_only=True)
    try_on_kind = serializers.CharField(source='category.try_on_kind', read_only=True)

    class Meta:
        model = Product
        fields = '__all__'
        extra_kwargs = {
            'image': {'required': False, 'allow_blank': True},
            'price': {'min_value': 0},
            'original_price': {'min_value': 0},
            'stock': {'min_value': 0},
            'discount': {'min_value': 0, 'max_value': 100},
        }

class CategorySerializer(serializers.ModelSerializer):
    parent_name = serializers.CharField(source='parent.name', read_only=True, allow_null=True)
    subcategories = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = '__all__'

    def get_subcategories(self, obj):
        # Only return subcategories for parent categories (where parent is null)
        if obj.parent is None:
            subs = obj.subcategories.all()
            return [{'id': sub.id, 'name': sub.name, 'slug': sub.slug} for sub in subs]
        return []
