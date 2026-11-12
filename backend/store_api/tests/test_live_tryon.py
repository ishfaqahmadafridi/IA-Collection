import json
from datetime import timedelta
from unittest.mock import patch, MagicMock
from urllib.error import URLError
from django.contrib.auth.models import User
from django.core.cache import cache
from django.core.exceptions import ImproperlyConfigured
from django.test import override_settings
from django.utils import timezone
from rest_framework.test import APITestCase
from store_api.models import Category, Product
from store_api.services.live_tryon import allowed_origins, mint_token, LiveTryOnUnavailable


@override_settings(DECART_API_KEY='dct_test_permanent_key', DECART_ALLOWED_ORIGINS=['http://localhost:5173'], DECART_MAX_SESSION_SECONDS=120)
class LiveTryOnTests(APITestCase):
    def setUp(self):
        cache.clear()
        self.user = User.objects.create_user(username='live-buyer')
        self.category = Category.objects.create(name='Shirts', slug='shirts', try_on_kind=Category.TryOnKind.TOP)
        self.product = Product.objects.create(category=self.category, name='Printed Shirt', price=100, image='/images/shirt.webp')
        self.client.force_authenticate(self.user)

    def token(self, **changes):
        data = {'product_id': self.product.pk, 'consent': True}; data.update(changes)
        return self.client.post('/api/live-try-on/token/', data, format='json', HTTP_ORIGIN='http://localhost:5173')

    def test_public_config_never_exposes_key(self):
        self.client.force_authenticate(None)
        response = self.client.get('/api/live-try-on/config/', {'product_id': self.product.pk})
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.data['available'])
        self.assertEqual(response.data['model'], 'lucy-vton-3.6')
        self.assertNotIn('dct_test_permanent_key', json.dumps(response.data))

    def test_replacement_contract_targets_selected_body_region_and_preserves_identity(self):
        response = self.client.get('/api/live-try-on/config/', {'product_id': self.product.pk})
        prompt = response.data['prompt']
        self.assertIn('inner shirt or top', prompt)
        self.assertIn('longer original sleeves', prompt)
        self.assertIn('arms', prompt)
        self.assertIn('outer coat or jacket unchanged', prompt)
        self.assertIn('Never copy', prompt)
        self.category.try_on_kind = Category.TryOnKind.BOTTOM; self.category.save()
        prompt = self.client.get('/api/live-try-on/config/', {'product_id': self.product.pk}).data['prompt']
        self.assertIn("person's pants", prompt)
        self.assertIn('legs', prompt)

    def test_product_api_exposes_category_try_on_kind(self):
        self.assertEqual(self.client.get(f'/api/products/{self.product.pk}/').data['try_on_kind'], 'top')
        self.category.try_on_kind = Category.TryOnKind.NONE; self.category.save()
        self.assertEqual(self.client.get(f'/api/products/{self.product.pk}/').data['try_on_kind'], '')

    def test_authentication_consent_and_product_are_required(self):
        self.client.force_authenticate(None)
        self.assertEqual(self.token().status_code, 401)
        self.client.force_authenticate(self.user)
        self.assertEqual(self.token(consent=False).status_code, 400)
        self.assertEqual(self.token(product_id='not-an-id').status_code, 400)
        self.category.try_on_kind = Category.TryOnKind.NONE; self.category.save()
        self.assertEqual(self.token().status_code, 400)

    @override_settings(DECART_API_KEY='')
    def test_missing_key_disables_service(self):
        self.assertFalse(self.client.get('/api/live-try-on/config/', {'product_id': self.product.pk}).data['available'])
        self.assertEqual(self.token().status_code, 503)

    @override_settings(DECART_ALLOWED_ORIGINS=[])
    def test_unscoped_service_is_disabled(self):
        self.assertEqual(self.token().status_code, 503)

    @patch('store_api.live_tryon_views.mint_token')
    def test_unapproved_origin_cannot_mint(self, mint):
        response = self.client.post('/api/live-try-on/token/', {'product_id': self.product.pk, 'consent': True}, format='json', HTTP_ORIGIN='https://evil.example')
        self.assertEqual(response.status_code, 403)
        self.assertEqual(self.client.post('/api/live-try-on/token/', {'product_id': self.product.pk, 'consent': True}, format='json').status_code, 403)
        mint.assert_not_called()

    @patch('store_api.services.live_tryon.build_opener')
    def test_provider_token_is_model_origin_and_duration_scoped(self, opener):
        expires = (timezone.now() + timedelta(seconds=60)).isoformat()
        response = MagicMock(); response.__enter__.return_value.read.return_value = json.dumps({'apiKey': 'ek_test_short_lived', 'expiresAt': expires}).encode()
        opener.return_value.open.return_value = response
        result = self.token()
        self.assertEqual(result.status_code, 200, result.data)
        request = opener.return_value.open.call_args.args[0]
        payload = json.loads(request.data)
        self.assertEqual(payload['allowedModels'], ['lucy-vton-3.6'])
        self.assertEqual(payload['allowedOrigins'], ['http://localhost:5173'])
        self.assertEqual(payload['constraints']['realtime']['maxSessionDuration'], 120)
        self.assertEqual(result['Cache-Control'], 'no-store, private')
        self.assertEqual(set(result.data), {'apiKey', 'expiresAt'})

    @patch('store_api.services.live_tryon.build_opener')
    def test_provider_details_and_long_lived_keys_are_never_forwarded(self, opener):
        opener.return_value.open.side_effect = URLError('secret internal error')
        result = self.token()
        self.assertEqual(result.status_code, 503)
        self.assertNotIn('secret', json.dumps(result.data))
        opener.return_value.open.side_effect = None
        response = MagicMock(); response.__enter__.return_value.read.return_value = json.dumps({'apiKey': 'dct_test_permanent_key', 'expiresAt': (timezone.now() + timedelta(seconds=60)).isoformat()}).encode()
        opener.return_value.open.return_value = response
        with self.assertRaises(LiveTryOnUnavailable): mint_token('http://localhost:5173')

    @override_settings(DECART_ALLOWED_ORIGINS=['https://example.com/path'])
    def test_noncanonical_origins_are_rejected(self):
        with self.assertRaises(ImproperlyConfigured): allowed_origins()

    @patch('store_api.live_tryon_views.LiveTryOnThrottle.get_rate', return_value='1/hour')
    @patch('store_api.live_tryon_views.mint_token', return_value={'apiKey': 'ek_test', 'expiresAt': 'test'})
    def test_issuance_is_rate_limited(self, mint, rate):
        self.assertEqual(self.token().status_code, 200)
        self.assertEqual(self.token().status_code, 429)
