from collections import defaultdict
from decimal import Decimal
from django.db import transaction, IntegrityError
from django.db.models import F
from rest_framework.exceptions import ValidationError
from ..models import Order, OrderItem, Product
from ..constants import MAX_ORDER_AMOUNT


def _existing_order(user, number, shipping_address, items):
    order = Order.objects.filter(order_number=number).first()
    if order is None:
        return None
    expected = sorted((item['product'], item['quantity'], item['size']) for item in items)
    actual = sorted(order.items.values_list('product_id', 'quantity', 'size'))
    if order.user_id != user.id or order.shipping_address != shipping_address or expected != actual:
        raise ValidationError({'checkout_key': 'This checkout key has already been used. Start a new checkout.'})
    return order


def create_order(user, checkout_key, shipping_address, items):
    # A globally unique order number doubles as a durable idempotency key.
    number = f'IA-{checkout_key}'
    grouped = defaultdict(int)
    for item in items:
        grouped[(item['product'], item['size'])] += item['quantity']
    items = [dict(product=product, size=size, quantity=quantity) for (product, size), quantity in sorted(grouped.items())]
    existing = _existing_order(user, number, shipping_address, items)
    if existing:
        return existing, False
    try:
        with transaction.atomic():
            order = Order.objects.create(user=user, order_number=number, total_amount=0, shipping_address=shipping_address)
            quantities = defaultdict(int)
            for item in items:
                quantities[item['product']] += item['quantity']
            products = {product.id: product for product in Product.objects.select_for_update().filter(id__in=quantities).order_by('id')}
            total = Decimal('0')
            for product_id, quantity in sorted(quantities.items()):
                product = products.get(product_id)
                if product is None or product.price < 0:
                    raise ValidationError({'items': 'A product is no longer available.'})
                # Conditional updates protect inventory even on databases without row locks.
                updated = Product.objects.filter(id=product_id, stock__gte=quantity).update(stock=F('stock') - quantity)
                if not updated:
                    raise ValidationError({'items': f'Insufficient stock for {product.name}.'})
                total += product.price * quantity
            if total > MAX_ORDER_AMOUNT:
                raise ValidationError({'items': 'The order total exceeds the supported amount.'})
            OrderItem.objects.bulk_create([OrderItem(order=order, product=products[item['product']], quantity=item['quantity'], price=products[item['product']].price, size=item['size']) for item in items])
            order.total_amount = total
            order.save(update_fields=['total_amount'])
            return order, True
    except IntegrityError:
        # A concurrent retry may have inserted the same durable checkout key.
        existing = _existing_order(user, number, shipping_address, items)
        if existing:
            return existing, False
        raise
