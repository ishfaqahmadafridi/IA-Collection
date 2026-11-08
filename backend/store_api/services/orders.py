from collections import defaultdict
from django.db import transaction
from django.db.models import F
from rest_framework.exceptions import ValidationError
from ..models import Order, Product

from ..constants import ORDER_TRANSITIONS


@transaction.atomic
def update_order(order_id, status=None, notes=None):
    order = Order.objects.select_for_update().get(pk=order_id)
    if status is not None and status != order.status:
        if status not in ORDER_TRANSITIONS[order.status]:
            raise ValidationError({'status': [f'Cannot move an order from {order.status} to {status}.']})
        if status == 'cancelled':
            quantities = defaultdict(int)
            for product_id, quantity in order.items.values_list('product_id', 'quantity'):
                quantities[product_id] += quantity
            for product_id, quantity in sorted(quantities.items()):
                Product.objects.filter(pk=product_id).update(stock=F('stock') + quantity)
        order.status = status
    if notes is not None:
        order.notes = notes
    order.save(update_fields=['status', 'notes', 'updated_at'])
    return order
