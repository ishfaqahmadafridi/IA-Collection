import tempfile
from django.core.cache import cache
from django.test import override_settings
import base64
import io
from PIL import Image
from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from store_api.models import UserProfile


class AccountTests(APITestCase):
    def setUp(self):
        cache.clear()
        directory = tempfile.TemporaryDirectory()
        self.addCleanup(directory.cleanup)
        media = override_settings(MEDIA_ROOT=directory.name)
        media.enable()
        self.addCleanup(media.disable)
        self.user = User.objects.create_user(username='buyer', email='buyer@example.com', password='OriginalPass123!')
        self.client.force_authenticate(self.user)

    def test_profile_update_persists_and_cannot_promote_user(self):
        response = self.client.put('/api/profile/update/', {'username': 'renamed', 'name': 'New Name', 'email': 'new@example.com', 'is_staff': True}, format='json')
        self.assertEqual(response.status_code, 200, response.data)
        self.user.refresh_from_db()
        self.assertEqual(self.user.first_name, 'New Name')
        self.assertEqual(self.user.username, 'renamed')
        self.assertFalse(self.user.is_staff)

    def test_invalid_email_and_duplicate_username_return_field_errors(self):
        User.objects.create_user(username='taken')
        response = self.client.put('/api/profile/update/', {'username': 'taken', 'name': '', 'email': 'invalid'}, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertIn('username', response.data)
        self.assertIn('email', response.data)

    def test_password_contract_and_validation(self):
        response = self.client.post('/api/profile/change-password/', {'currentPassword': 'OriginalPass123!', 'newPassword': '123'}, format='json')
        self.assertEqual(response.status_code, 400)
        response = self.client.post('/api/profile/change-password/', {'currentPassword': 'OriginalPass123!', 'newPassword': 'ReplacementPass456!'}, format='json')
        self.assertEqual(response.status_code, 200)
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password('ReplacementPass456!'))

    def test_wrong_current_password_does_not_change_password(self):
        response = self.client.post('/api/profile/change-password/', {'currentPassword': 'wrong', 'newPassword': 'ReplacementPass456!'}, format='json')
        self.assertEqual(response.status_code, 400)
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password('OriginalPass123!'))

    def test_registration_enforces_password_policy(self):
        self.client.force_authenticate(None)
        response = self.client.post('/api/register/', {'username': 'newuser', 'email': 'new@example.com', 'password': '1'}, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertFalse(User.objects.filter(username='newuser').exists())

    def test_image_validation_checks_content_not_just_prefix(self):
        response = self.client.post('/api/profile/upload-image/', {'profile_image': 'data:image/png;base64,' + base64.b64encode(b'not an image').decode()}, format='json')
        self.assertEqual(response.status_code, 400)

    def test_valid_image_can_be_uploaded_and_removed(self):
        output = io.BytesIO()
        Image.new('RGB', (2, 2)).save(output, format='PNG')
        image = 'data:image/png;base64,' + base64.b64encode(output.getvalue()).decode()
        response = self.client.post('/api/profile/upload-image/', {'profile_image': image}, format='json')
        self.assertEqual(response.status_code, 200)
        profile = UserProfile.objects.get(user=self.user)
        self.assertEqual(profile.profile_image, '')
        self.assertTrue(profile.image.storage.exists(profile.image.name))
        self.assertIn('/media/profiles/', response.data['image_url'])
        self.assertEqual(self.client.delete('/api/profile/upload-image/').status_code, 204)
        self.assertFalse(UserProfile.objects.get(user=self.user).image)

    def test_legacy_profile_image_conversion_is_explicit_and_repeatable(self):
        from django.core.management import call_command
        from io import StringIO
        output = io.BytesIO()
        Image.new('RGB', (2, 2)).save(output, format='PNG')
        image = 'data:image/png;base64,' + base64.b64encode(output.getvalue()).decode()
        profile = UserProfile.objects.create(user=self.user, profile_image=image)
        call_command('migrate_profile_images', stdout=StringIO())
        profile.refresh_from_db()
        self.assertEqual(profile.profile_image, image)
        self.assertFalse(profile.image)
        call_command('migrate_profile_images', apply=True, stdout=StringIO())
        profile.refresh_from_db()
        self.assertEqual(profile.profile_image, '')
        self.assertTrue(profile.image.storage.exists(profile.image.name))
        filename = profile.image.name
        call_command('migrate_profile_images', apply=True, stdout=StringIO())
        profile.refresh_from_db()
        self.assertEqual(profile.image.name, filename)
