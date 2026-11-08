import os
import subprocess
import sys
import tempfile
from decimal import Decimal
from pathlib import Path
from unittest.mock import patch
from django.conf import settings
from django.core.cache import cache
from django.core.management import call_command
from django.db import IntegrityError, transaction, connection, DatabaseError
from django.db.models.deletion import ProtectedError
from django.test import override_settings
from django.test.utils import CaptureQueriesContext
from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from store_api.models import Category, Product, Order, OrderItem, UserActivity
from store_api.throttles import AuthenticationThrottle


class BackendRulesTests(APITestCase):
    def setUp(self):
        cache.clear()
        self.user = User.objects.create_user(username='admin', password='StrongPassword123!', is_staff=True)
        self.category = Category.objects.create(name='Men', slug='men')
        self.product = Product.objects.create(name='Shirt', category=self.category, price=Decimal('10'), stock=5)
        self.client.force_authenticate(self.user)

    def test_invalid_query_values_return_validation_errors(self):
        urls = ['/api/products/?category=abc', '/api/categories/?parent=abc',
            '/api/admin/orders/recent_orders/?days=abc', '/api/admin/orders/recent_orders/?days=-1',
            '/api/admin/analytics/top-products/?limit=abc', '/api/admin/analytics/top-products/?limit=-1',
            '/api/admin/analytics/sales/?period=invalid', '/api/admin/orders/?status=invalid']
        for url in urls:
            self.assertEqual(self.client.get(url).status_code, 400, url)

    def test_newsletter_email_validation_rejects_wrong_types(self):
        self.client.force_authenticate(None)
        for email in [123, [], {}, 'invalid']:
            response = self.client.post('/api/subscribe/', {'email': email}, format='json')
            self.assertEqual(response.status_code, 400)
        response = self.client.post('/api/subscribe/', {'email': 'valid@example.com'}, format='json')
        self.assertEqual(response.status_code, 201)

    def test_public_clients_cannot_forge_login_or_purchase_events(self):
        for event in ['login', 'logout', 'purchase']:
            self.assertEqual(self.client.post('/api/activity/log/', {'activity_type': event}, format='json').status_code, 400)
        self.assertFalse(UserActivity.objects.exists())

    def test_activity_metadata_must_be_a_bounded_object(self):
        for value in [[], 'text', {'huge': 'x' * (settings.ACTIVITY_METADATA_MAX_BYTES + 1)}]:
            response = self.client.post('/api/activity/log/', {'activity_type': 'view_home', 'metadata': value}, format='json')
            self.assertEqual(response.status_code, 400)

    def test_internal_exception_details_are_not_returned(self):
        with patch('store_api.services.activity.Subscription.objects.get_or_create', side_effect=DatabaseError('private database detail')):
            with self.assertLogs('store_api.exceptions', level='ERROR'):
                response = self.client.post('/api/subscribe/', {'email': 'valid@example.com'}, format='json')
        self.assertEqual(response.status_code, 500)
        self.assertNotIn('private database detail', str(response.data))

    def test_database_rejects_negative_product_values(self):
        for field, value in [('stock', -1), ('price', -1), ('discount', 101), ('original_price', -1)]:
            with self.assertRaises(IntegrityError):
                with transaction.atomic():
                    Product.objects.filter(pk=self.product.pk).update(**{field: value})

    def make_order(self):
        order = Order.objects.create(user=self.user, order_number='test-order', total_amount=20, shipping_address='Test address')
        OrderItem.objects.create(order=order, product=self.product, quantity=2, price=10)
        return order

    def test_order_history_cannot_be_changed_through_generic_admin_writes(self):
        order = self.make_order()
        for payload in [{'total_amount': -1}, {'user': self.user.id}, {'order_number': 'changed'}]:
            self.assertEqual(self.client.patch(f'/api/admin/orders/{order.pk}/', payload, format='json').status_code, 400)
        order.refresh_from_db()
        self.assertEqual(order.total_amount, 20)
        self.assertEqual(self.client.delete(f'/api/admin/orders/{order.pk}/').status_code, 405)
        self.assertEqual(self.client.post('/api/admin/orders/', {}, format='json').status_code, 405)
        with self.assertRaises(ProtectedError):
            self.user.delete()

    def test_cancelling_order_restocks_exactly_once_and_prevents_reopening(self):
        order = self.make_order()
        url = f'/api/admin/orders/{order.pk}/update_status/'
        self.assertEqual(self.client.post(url, {'status': 'cancelled'}).status_code, 200)
        self.assertEqual(self.client.post(url, {'status': 'cancelled'}).status_code, 200)
        self.product.refresh_from_db()
        self.assertEqual(self.product.stock, 7)
        self.assertEqual(self.client.post(url, {'status': 'pending'}).status_code, 400)

    def test_order_item_constraints_enforce_positive_quantity_and_price(self):
        order = self.make_order()
        for values in [{'quantity': 0}, {'quantity': -1}, {'price': -1}]:
            with self.assertRaises(IntegrityError):
                with transaction.atomic():
                    order.items.update(**values)

    def test_lists_are_paginated_and_queries_do_not_grow_per_product(self):
        Product.objects.bulk_create([Product(name=f'Shirt {index}', category=self.category, price=10) for index in range(12)])
        with CaptureQueriesContext(connection) as queries:
            response = self.client.get('/api/products/?page_size=2')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['results']), 2)
        self.assertEqual(response.data['count'], 13)
        self.assertIsNotNone(response.data['next'])
        self.assertLessEqual(len(queries), 3)

    def test_yearly_sales_use_bounded_queries_and_include_today(self):
        self.make_order()
        with CaptureQueriesContext(connection) as queries:
            response = self.client.get('/api/admin/analytics/sales/?period=year')
        self.assertEqual(len(response.data['data']), 365)
        self.assertEqual(response.data['data'][-1]['sales'], 20)
        self.assertLessEqual(len(queries), 2)

    def test_login_rate_limit_is_enforced(self):
        self.client.force_authenticate(None)
        with patch.object(AuthenticationThrottle, 'rate', '2/min', create=True):
            for _ in range(2):
                self.assertEqual(self.client.post('/api/login/', {'username': 'admin', 'password': 'wrong'}).status_code, 401)
            self.assertEqual(self.client.post('/api/login/', {'username': 'admin', 'password': 'wrong'}).status_code, 429)

    @override_settings(DEBUG=True)
    def test_seed_is_repeatable_and_preserves_existing_business_data(self):
        order = self.make_order()
        from io import StringIO
        output = StringIO()
        call_command('seed_catalog', stdout=output)
        count = Product.objects.count()
        Product.objects.filter(pk=self.product.pk).update(stock=1)
        call_command('seed_catalog', stdout=output)
        self.assertEqual(Product.objects.count(), count)
        self.assertTrue(Order.objects.filter(pk=order.pk).exists())
        self.product.refresh_from_db()
        self.assertEqual(self.product.stock, 1)

    def test_production_rejects_missing_or_insecure_secrets(self):
        root = Path(settings.BASE_DIR)
        for secret in ['', 'django-insecure-example']:
            environment = {**os.environ, 'DJANGO_ENV': 'production', 'SECRET_KEY': secret, 'ALLOWED_HOSTS': 'store.example.test', 'DATABASE_URL': 'sqlite:///unused.sqlite3', 'CACHE_BACKEND': 'django.core.cache.backends.db.DatabaseCache', 'CACHE_LOCATION': 'limits'}
            result = subprocess.run([sys.executable, '-B', 'manage.py', 'check'], cwd=root, env=environment, capture_output=True, text=True)
            self.assertNotEqual(result.returncode, 0)
            self.assertIn('strong SECRET_KEY', result.stderr)

    def test_admin_order_body_must_be_an_object(self):
        order = self.make_order()
        for payload in [[], ['status'], 'invalid']:
            response = self.client.patch(f'/api/admin/orders/{order.pk}/', payload, format='json')
            self.assertEqual(response.status_code, 400)

    def test_order_response_exposes_only_legal_status_transitions(self):
        order = self.make_order()
        response = self.client.get(f'/api/admin/orders/{order.pk}/')
        self.assertEqual(set(response.data['allowed_statuses']), {'pending', 'processing', 'cancelled'})

    def test_production_profile_passes_deployment_checks_when_https_is_fully_configured(self):
        import secrets
        environment = {**os.environ, 'DJANGO_ENV': 'production', 'SECRET_KEY': secrets.token_urlsafe(64),
            'ALLOWED_HOSTS': 'store.example.test', 'DATABASE_URL': 'sqlite:///unused.sqlite3',
            'CACHE_BACKEND': 'django.core.cache.backends.db.DatabaseCache', 'CACHE_LOCATION': 'limits',
            'SECURE_HSTS_INCLUDE_SUBDOMAINS': 'true', 'SECURE_HSTS_PRELOAD': 'true'}
        result = subprocess.run([sys.executable, '-B', 'manage.py', 'check', '--deploy', '--fail-level', 'WARNING'], cwd=settings.BASE_DIR, env=environment, capture_output=True, text=True)
        self.assertEqual(result.returncode, 0, result.stderr)

    def test_database_environment_configuration_is_parsed_without_exposing_credentials(self):
        from store_backend.environment import database_config
        config = database_config('postgresql://user:pass%40word@db:5432/store?sslmode=require', Path('/unused'))
        self.assertEqual(config['PASSWORD'], 'pass@word')
        self.assertEqual(config['OPTIONS'], {'sslmode': 'require'})
        self.assertEqual(database_config('sqlite:////tmp/store.sqlite3', Path('/unused'))['NAME'], '/tmp/store.sqlite3')

    @override_settings(LOW_STOCK_THRESHOLD=20)
    def test_stock_status_uses_the_configured_threshold(self):
        response = self.client.get(f'/api/products/{self.product.pk}/')
        self.assertEqual(response.data['stock_status'], 'low_stock')

    def test_product_images_cannot_store_new_inline_binary_payloads(self):
        response = self.client.patch(f'/api/admin/products/{self.product.pk}/', {'image': 'data:image/png;base64,aaa'}, format='json')
        self.assertEqual(response.status_code, 400)
