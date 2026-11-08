from datetime import timedelta
from django.utils import timezone
from ..models import Order


def orders():
    return Order.objects.select_related('user').prefetch_related('items__product').order_by('-created_at', '-id')


def recent_orders(days):
    return orders().filter(created_at__gte=timezone.now() - timedelta(days=days))
