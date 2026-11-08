from django.core.management.base import BaseCommand, CommandError
from django.db.models import Q
from store_api.models import Product, Order, OrderItem
from store_api.constants import ORDER_STATUS_CHOICES

class Command(BaseCommand):
    help = 'Report invalid existing records without modifying data, before integrity migrations.'

    def handle(self, *args, **options):
        checks = [
            (Product, Q(price__lt=0) | Q(stock__lt=0) | Q(original_price__lt=0) | Q(discount__lt=0) | Q(discount__gt=100)),
            (Order, Q(total_amount__lt=0) | ~Q(status__in=[key for key, _ in ORDER_STATUS_CHOICES])),
            (OrderItem, Q(quantity__lte=0) | Q(price__lt=0)),
        ]
        invalid = 0
        for model, query in checks:
            ids = list(model.objects.filter(query).values_list('pk', flat=True))
            if ids:
                invalid += len(ids)
                self.stderr.write(f'{model.__name__}: {len(ids)} invalid records; example IDs {ids[:10]}')
        if invalid:
            raise CommandError('Repair reported records before migrating. Nothing was changed.')
        self.stdout.write(self.style.SUCCESS('No invalid store values found.'))
