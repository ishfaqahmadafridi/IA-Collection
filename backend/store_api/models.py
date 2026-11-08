from django.db import models
from django.contrib.auth.models import User
from django.conf import settings
from .constants import ORDER_STATUS_CHOICES
from django.core.validators import MinValueValidator, MaxValueValidator

class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='subcategories')
    image = models.ImageField(upload_to='categories/', null=True, blank=True)
    hero_image = models.ImageField(upload_to='heroes/', null=True, blank=True)
    description = models.TextField(blank=True)

    def __str__(self):
        if self.parent:
            return f"{self.parent.name} > {self.name}"
        return self.name

    class Meta:
        verbose_name_plural = 'Categories'

class Product(models.Model):
    category = models.ForeignKey(Category, related_name='products', on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    original_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, validators=[MinValueValidator(0)])
    discount = models.IntegerField(default=0, validators=[MinValueValidator(0), MaxValueValidator(100)])
    image = models.TextField(blank=True, default='')  # Store image URL as text
    description = models.TextField(blank=True)
    stock = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    is_hot = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.CheckConstraint(check=models.Q(price__gte=0), name='product_price_nonnegative'),
            models.CheckConstraint(check=models.Q(stock__gte=0), name='product_stock_nonnegative'),
            models.CheckConstraint(check=models.Q(original_price__isnull=True) | models.Q(original_price__gte=0), name='product_original_price_nonnegative'),
            models.CheckConstraint(check=models.Q(discount__gte=0, discount__lte=100), name='product_discount_valid'),
        ]

    def __str__(self):
        return self.name

    @property
    def is_in_stock(self):
        return self.stock > 0

    @property
    def stock_status(self):
        if self.stock == 0:
            return 'out_of_stock'
        elif self.stock < settings.LOW_STOCK_THRESHOLD:
            return 'low_stock'
        return 'in_stock'

class Order(models.Model):
    STATUS_CHOICES = ORDER_STATUS_CHOICES

    user = models.ForeignKey(User, on_delete=models.PROTECT, related_name='orders')
    order_number = models.CharField(max_length=100, unique=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    shipping_address = models.TextField()
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"Order {self.order_number} - {self.user.username}"

    class Meta:
        ordering = ['-created_at']
        constraints = [models.CheckConstraint(check=models.Q(total_amount__gte=0), name='order_total_nonnegative'),
            models.CheckConstraint(check=models.Q(status__in=[key for key, _ in ORDER_STATUS_CHOICES]), name='order_status_valid')]

class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    quantity = models.IntegerField(default=1, validators=[MinValueValidator(1)])
    price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    size = models.CharField(max_length=50, blank=True)

    def __str__(self):
        return f"{self.product.name} x {self.quantity}"

    class Meta:
        constraints = [
            models.CheckConstraint(check=models.Q(quantity__gt=0), name='order_item_quantity_positive'),
            models.CheckConstraint(check=models.Q(price__gte=0), name='order_item_price_nonnegative'),
        ]

    @property
    def total_price(self):
        return self.price * self.quantity

class UserActivity(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    activity_type = models.CharField(max_length=50)  # login, logout, view_product, add_to_cart, purchase
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    metadata = models.JSONField(default=dict, blank=True)

    def __str__(self):
        return f"{self.activity_type} - {self.timestamp}"

    class Meta:
        verbose_name_plural = 'User Activities'
        ordering = ['-timestamp']

class Subscription(models.Model):
    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=True)
    subscribed_at = models.DateTimeField(auto_now_add=True)
    unsubscribed_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.email

class DailySales(models.Model):
    date = models.DateField(unique=True)
    total_sales = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_orders = models.IntegerField(default=0)
    total_items_sold = models.IntegerField(default=0)
    unique_customers = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Sales for {self.date}"

    class Meta:
        verbose_name_plural = 'Daily Sales'
        ordering = ['-date']


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    profile_image = models.TextField(blank=True)  # Legacy data, cleared by migrate_profile_images.
    image = models.ImageField(upload_to='profiles/%Y/%m/', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Profile of {self.user.username}"
