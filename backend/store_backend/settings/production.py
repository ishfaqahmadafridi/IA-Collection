from django.core.exceptions import ImproperlyConfigured
from .base import *  # noqa: F403

if len(SECRET_KEY) < 50 or len(set(SECRET_KEY)) < 5 or SECRET_KEY.startswith('django-insecure-'):
    raise ImproperlyConfigured('Production requires a strong SECRET_KEY from the environment.')
if not ALLOWED_HOSTS or '*' in ALLOWED_HOSTS:
    raise ImproperlyConfigured('Production requires explicit ALLOWED_HOSTS.')
if not env('DATABASE_URL'):
    raise ImproperlyConfigured('Production requires an explicit DATABASE_URL.')
DEBUG = False
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = env('SECURE_HSTS_SECONDS', 3600, cast=int)
# Opt in only after all subdomains are HTTPS-ready and preload requirements are met.
SECURE_HSTS_INCLUDE_SUBDOMAINS = env('SECURE_HSTS_INCLUDE_SUBDOMAINS', False, cast=bool)
SECURE_HSTS_PRELOAD = env('SECURE_HSTS_PRELOAD', False, cast=bool)
if env('TRUST_PROXY_HEADERS', False, cast=bool):
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

if CACHES['default']['BACKEND'] not in {
    'django.core.cache.backends.db.DatabaseCache', 'django.core.cache.backends.redis.RedisCache',
    'django.core.cache.backends.memcached.PyMemcacheCache', 'django.core.cache.backends.memcached.PyLibMCCache',
} or not env('CACHE_LOCATION'):
    raise ImproperlyConfigured('Production requires a shared CACHE_BACKEND and CACHE_LOCATION for rate limiting.')
