from datetime import timedelta
from django.db.models import Count, Sum, F
from django.db.models.functions import TruncDate
from django.utils import timezone
from ..models import Order, OrderItem, UserActivity
from ..constants import PERIOD_DAYS


def period_bounds(period):
    end = timezone.localdate()
    return end - timedelta(days=PERIOD_DAYS[period] - 1), end


def sales_analytics(period):
    start, end = period_bounds(period)
    rows = Order.objects.exclude(status='cancelled').filter(created_at__date__range=(start, end)).annotate(day=TruncDate('created_at')).values('day').annotate(sales=Sum('total_amount'), orders=Count('id')).order_by('day')
    by_day = {row['day']: row for row in rows}
    data = []
    for index in range(PERIOD_DAYS[period]):
        day = start + timedelta(days=index)
        row = by_day.get(day, {})
        data.append({'date': day.isoformat(), 'sales': float(row.get('sales', 0)), 'orders': row.get('orders', 0)})
    count = sum(row['orders'] for row in data)
    return {'data': data, 'period': period, 'average_order_value': sum(row['sales'] for row in data) / count if count else 0}


def user_analytics(period):
    start, end = period_bounds(period)
    activity = UserActivity.objects.filter(timestamp__date__range=(start, end))
    rows = activity.filter(activity_type='login', user__isnull=False).annotate(day=TruncDate('timestamp')).values('day').annotate(logins=Count('user', distinct=True)).order_by('day')
    counts = {row['day']: row['logins'] for row in rows}
    data = [{'date': (start + timedelta(days=index)).isoformat(), 'logins': counts.get(start + timedelta(days=index), 0)} for index in range(PERIOD_DAYS[period])]
    breakdown = list(activity.values('activity_type').annotate(count=Count('id')).order_by('-count'))
    return {'daily_logins': data, 'activity_breakdown': breakdown, 'unique_users': activity.filter(user__isnull=False).values('user').distinct().count(), 'period': period}


def top_products(period, limit, sort_by):
    result = OrderItem.objects.exclude(order__status='cancelled')
    if period != 'all':
        result = result.filter(order__created_at__date__range=period_bounds(period))
    result = result.values('product__id', 'product__name', 'product__price', 'product__stock').annotate(total_sold=Sum('quantity'), total_revenue=Sum(F('quantity') * F('price')))
    key = '-total_revenue' if sort_by == 'revenue' else '-total_sold'
    return {'products': list(result.order_by(key, 'product__id')[:limit]), 'limit': limit, 'sort_by': sort_by, 'period': period}
