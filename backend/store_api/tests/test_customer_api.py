import uuid
from decimal import Decimal
from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from store_api.models import Category, Product, Order


class CustomerOrderTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='buyer', password='StrongPass123!')
        self.other = User.objects.create_user(username='other', password='StrongPass123!')
        category = Category.objects.create(name='Men', slug='men')
        self.product = Product.objects.create(category=category, name='Shirt', price='1250.50', stock=5)
        self.client.force_authenticate(self.user)
        self.payload = {
            'checkout_key': str(uuid.uuid4()), 'shipping_address': '123 Example Street, Lahore',
            'items': [{'product': self.product.id, 'quantity': 2, 'size': ''}],
        }

    def test_checkout_uses_server_prices_and_deducts_stock(self):
        self.payload['total_amount'] = '0.01'
        self.payload['items'][0]['price'] = '0.01'
        response = self.client.post('/api/orders/', self.payload, format='json')
        self.assertEqual(response.status_code, 201, response.data)
        self.assertEqual(Decimal(response.data['total_amount']), Decimal('2501.00'))
        self.product.refresh_from_db()
        self.assertEqual(self.product.stock, 3)
        self.assertEqual(Order.objects.get().user, self.user)

    def test_retried_checkout_returns_same_order_without_double_deduction(self):
        first = self.client.post('/api/orders/', self.payload, format='json')
        second = self.client.post('/api/orders/', self.payload, format='json')
        self.assertEqual(second.status_code, 200)
        self.assertEqual(first.data['id'], second.data['id'])
        self.product.refresh_from_db()
        self.assertEqual(self.product.stock, 3)
        self.assertEqual(Order.objects.count(), 1)

    def test_cannot_reuse_key_for_changed_order(self):
        self.client.post('/api/orders/', self.payload, format='json')
        self.payload['shipping_address'] = 'Different address, Islamabad'
        response = self.client.post('/api/orders/', self.payload, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(Order.objects.count(), 1)

    def test_insufficient_stock_rolls_back_whole_order(self):
        second = Product.objects.create(category=self.product.category, name='Shoes', price='50', stock=0)
        self.payload['items'].append({'product': second.id, 'quantity': 1})
        response = self.client.post('/api/orders/', self.payload, format='json')
        self.assertEqual(response.status_code, 400)
        self.product.refresh_from_db()
        self.assertEqual(self.product.stock, 5)
        self.assertFalse(Order.objects.exists())

    def test_duplicate_lines_cannot_oversell(self):
        self.payload['items'] = [{'product': self.product.id, 'quantity': 3, 'size': 'S'}, {'product': self.product.id, 'quantity': 3, 'size': 'M'}]
        self.assertEqual(self.client.post('/api/orders/', self.payload, format='json').status_code, 400)
        self.product.refresh_from_db()
        self.assertEqual(self.product.stock, 5)

    def test_invalid_quantity_and_empty_items_are_rejected(self):
        for quantity in [0, -1, 1.5, 'invalid']:
            self.payload['items'][0]['quantity'] = quantity
            self.assertEqual(self.client.post('/api/orders/', self.payload, format='json').status_code, 400)
        self.payload['items'] = []
        self.assertEqual(self.client.post('/api/orders/', self.payload, format='json').status_code, 400)

    def test_customer_only_sees_own_orders(self):
        response = self.client.post('/api/orders/', self.payload, format='json')
        url = f"/api/orders/{response.data['order_number']}/"
        self.assertEqual(self.client.get(url).status_code, 200)
        self.client.force_authenticate(self.other)
        self.assertEqual(self.client.get(url).status_code, 404)
        self.assertEqual(self.client.post('/api/orders/', self.payload, format='json').status_code, 400)

    def test_checkout_requires_authentication(self):
        self.client.force_authenticate(None)
        self.assertEqual(self.client.post('/api/orders/', self.payload, format='json').status_code, 401)

    def test_customer_cannot_access_admin_api(self):
        self.assertEqual(self.client.get('/api/admin/products/').status_code, 403)

    def test_missing_category_does_not_expose_other_products(self):
        response = self.client.get('/api/products/?category_slug=missing')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['results'], [])

    def test_admin_cannot_delete_a_product_used_in_an_order(self):
        self.client.post('/api/orders/', self.payload, format='json')
        self.user.is_staff = True
        self.user.save()
        response = self.client.delete(f'/api/admin/products/{self.product.id}/')
        self.assertEqual(response.status_code, 409)
        self.assertEqual(Order.objects.get().items.count(), 1)

    def test_admin_stock_update_rejects_negative_and_malformed_values(self):
        self.user.is_staff = True
        self.user.save()
        for stock in [-1, 'invalid', [], 1.5]:
            response = self.client.post(f'/api/admin/products/{self.product.id}/update_stock/', {'stock': stock}, format='json')
            self.assertEqual(response.status_code, 400)
        self.product.refresh_from_db()
        self.assertEqual(self.product.stock, 5)
