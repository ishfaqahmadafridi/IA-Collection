from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from .models import Category, Product, Order, OrderItem, UserActivity, Subscription, DailySales

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
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

class ProductSerializer(serializers.ModelSerializer):
    stock_status = serializers.ReadOnlyField()
    is_in_stock = serializers.ReadOnlyField()
    category_name = serializers.CharField(source='category.name', read_only=True)
    
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
    products = ProductSerializer(many=True, read_only=True)
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

class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    total_price = serializers.ReadOnlyField()
    
    class Meta:
        model = OrderItem
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    user_name = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = Order
        fields = '__all__'

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


class ProfileUpdateSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='first_name', max_length=150, allow_blank=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'name')
        extra_kwargs = {'email': {'required': True, 'allow_blank': False}}
