import json
from pathlib import Path
from django.conf import settings
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from store_api.models import Category, Product
from store_api.serializers import ProductSerializer

class Command(BaseCommand):
    help = 'Create missing demo catalog records without deleting or overwriting existing business data.'

    def add_arguments(self, parser):
        parser.add_argument('--source', choices=['default', 'assets'], default='default')

    @transaction.atomic
    def handle(self, *args, **options):
        if not settings.DEBUG:
            raise CommandError('Demo catalog seeding is restricted to development settings.')
        filename = 'catalog_assets.json' if options['source'] == 'assets' else 'catalog.json'
        payload = json.loads((Path(__file__).resolve().parents[2] / 'fixtures' / filename).read_text())
        for row in payload['categories']:
            parent = Category.objects.get(slug=row['parent']) if row['parent'] else None
            Category.objects.get_or_create(slug=row['slug'], defaults={'name': row['name'], 'parent': parent, 'try_on_kind': row.get('try_on_kind', '')})
        created = 0
        for row in payload['products']:
            category = Category.objects.get(slug=row['slug'])
            if Product.objects.filter(category=category, name=row['name']).exists():
                continue
            serializer = ProductSerializer(data={key: value for key, value in dict(row, category=category.pk).items() if key != 'slug'})
            serializer.is_valid(raise_exception=True)
            serializer.save()
            created += 1
        self.stdout.write(self.style.SUCCESS(f'Created {created} products; existing products and orders were preserved.'))
