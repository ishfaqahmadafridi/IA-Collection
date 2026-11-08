from django.core.management.utils import get_random_secret_key
from .base import *  # noqa: F403
DEBUG = False
SECRET_KEY = SECRET_KEY or get_random_secret_key()
ALLOWED_HOSTS = ['testserver', 'localhost', '127.0.0.1']
MEDIA_ROOT = BASE_DIR / '.test-media'
PASSWORD_HASHERS = ['django.contrib.auth.hashers.MD5PasswordHasher']
REST_FRAMEWORK = {**REST_FRAMEWORK, 'DEFAULT_THROTTLE_CLASSES': []}
STORAGES = {**STORAGES, 'staticfiles': {'BACKEND': 'django.contrib.staticfiles.storage.StaticFilesStorage'}}

MIDDLEWARE = [item for item in MIDDLEWARE if item != 'whitenoise.middleware.WhiteNoiseMiddleware']
