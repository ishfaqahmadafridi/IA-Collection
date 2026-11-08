from django.conf import settings
"""
Dashboard Views
Dashboard statistics and overview data
"""

from django.contrib.auth.models import User
from django.db.models import Sum, Count
from django.utils import timezone
from datetime import timedelta

from ..models import Product, Order, UserActivity, Subscription
from ..constants import PERIOD_DAYS


def dashboard_stats():
    """
    Get comprehensive dashboard statistics

    Returns:
        - Sales metrics (total, weekly, monthly)
        - Order metrics (total, weekly, pending)
        - Product metrics (total, out of stock, low stock)
        - User metrics (total, active this week)
        - Subscription metrics (total, new this week)
    """
    today = timezone.now().date()
    week_ago = today - timedelta(days=PERIOD_DAYS['week'] - 1)
    month_ago = today - timedelta(days=PERIOD_DAYS['month'] - 1)

    booked_orders = Order.objects.exclude(status='cancelled')
    # Sales statistics
    total_sales = booked_orders.aggregate(
        total=Sum('total_amount')
    )['total'] or 0

    weekly_sales = booked_orders.filter(
        created_at__date__gte=week_ago
    ).aggregate(total=Sum('total_amount'))['total'] or 0

    monthly_sales = booked_orders.filter(
        created_at__date__gte=month_ago
    ).aggregate(total=Sum('total_amount'))['total'] or 0

    # Order statistics
    total_orders = Order.objects.count()
    weekly_orders = Order.objects.filter(created_at__date__gte=week_ago).count()
    pending_orders = Order.objects.filter(status='pending').count()
    processing_orders = Order.objects.filter(status='processing').count()
    shipped_orders = Order.objects.filter(status='shipped').count()

    # Product statistics
    total_products = Product.objects.count()
    out_of_stock = Product.objects.filter(stock=0).count()
    low_stock = Product.objects.filter(stock__gt=0, stock__lt=settings.LOW_STOCK_THRESHOLD).count()
    in_stock = Product.objects.filter(stock__gt=0).count()

    # User statistics
    total_users = User.objects.count()
    active_users_week = UserActivity.objects.filter(
        timestamp__date__gte=week_ago,
        activity_type='login'
    ).values('user').distinct().count()

    new_users_week = User.objects.filter(
        date_joined__date__gte=week_ago
    ).count()

    # Subscription statistics
    total_subscriptions = Subscription.objects.filter(is_active=True).count()
    new_subscriptions_week = Subscription.objects.filter(
        subscribed_at__date__gte=week_ago
    ).count()

    return {
        'sales': {
            'total': float(total_sales),
            'weekly': float(weekly_sales),
            'monthly': float(monthly_sales),
        },
        'orders': {
            'total': total_orders,
            'weekly': weekly_orders,
            'pending': pending_orders,
            'processing': processing_orders,
            'shipped': shipped_orders,
        },
        'products': {
            'total': total_products,
            'out_of_stock': out_of_stock,
            'low_stock': low_stock,
            'in_stock': in_stock,
        },
        'users': {
            'total': total_users,
            'active_this_week': active_users_week,
            'new_this_week': new_users_week,
        },
        'subscriptions': {
            'total': total_subscriptions,
            'new_this_week': new_subscriptions_week,
        }
    }
