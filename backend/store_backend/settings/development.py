from django.core.management.utils import get_random_secret_key
from .base import *  # noqa: F403

DEBUG = env('DJANGO_DEBUG', True, cast=bool)
SECRET_KEY = SECRET_KEY or get_random_secret_key()
ALLOWED_HOSTS = ALLOWED_HOSTS or ['localhost', '127.0.0.1', '[::1]']
