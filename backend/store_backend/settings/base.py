from pathlib import Path

from ..environment import env, database_config

BASE_DIR = Path(__file__).resolve().parents[2]

SECRET_KEY = env('SECRET_KEY', '')
DEBUG = False
ALLOWED_HOSTS = env('ALLOWED_HOSTS', [], cast=list)

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'rest_framework_simplejwt',
    'store_api',
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    )
}

from datetime import timedelta
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=env('ACCESS_TOKEN_MINUTES', 60, cast=int)),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=env('REFRESH_TOKEN_DAYS', 1, cast=int)),
    'AUTH_HEADER_TYPES': ('Bearer',),
}

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'store_backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'store_backend.wsgi.application'

DATABASES = {'default': database_config(env('DATABASE_URL', ''), BASE_DIR)}

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',},
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = env('TIME_ZONE', 'UTC')
USE_I18N = True
USE_TZ = True

STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
MEDIA_URL = '/media/'
MEDIA_ROOT = Path(env('MEDIA_ROOT', str(BASE_DIR / 'media')))
STORAGES = {
    'default': {'BACKEND': 'django.core.files.storage.FileSystemStorage'},
    'staticfiles': {'BACKEND': 'whitenoise.storage.CompressedManifestStaticFilesStorage'},
}
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOWED_ORIGINS = env('CORS_ALLOWED_ORIGINS', [], cast=list)
CSRF_TRUSTED_ORIGINS = env('CSRF_TRUSTED_ORIGINS', [], cast=list)
REST_FRAMEWORK.update({
    'EXCEPTION_HANDLER': 'store_api.exceptions.api_exception_handler',
    'DEFAULT_PERMISSION_CLASSES': ['rest_framework.permissions.IsAuthenticated'],
    'DEFAULT_PAGINATION_CLASS': 'store_api.pagination.StorePagination',
    'PAGE_SIZE': env('API_PAGE_SIZE', 50, cast=int),
    'NUM_PROXIES': env('TRUSTED_PROXY_COUNT', 0, cast=int),
    'DEFAULT_THROTTLE_CLASSES': ['rest_framework.throttling.AnonRateThrottle', 'rest_framework.throttling.UserRateThrottle'],
    'DEFAULT_THROTTLE_RATES': {
        'anon': env('API_ANON_RATE', '120/min'), 'user': env('API_USER_RATE', '600/min'),
        'auth': env('API_AUTH_RATE', '10/min'), 'public_write': env('API_PUBLIC_WRITE_RATE', '30/min'),
    },
})
PROFILE_IMAGE_MAX_BYTES = env('PROFILE_IMAGE_MAX_BYTES', 2 * 1024 * 1024, cast=int)
PROFILE_IMAGE_MAX_PIXELS = env('PROFILE_IMAGE_MAX_PIXELS', 16000000, cast=int)
DATA_UPLOAD_MAX_MEMORY_SIZE = PROFILE_IMAGE_MAX_BYTES * 2
FILE_UPLOAD_MAX_MEMORY_SIZE = PROFILE_IMAGE_MAX_BYTES
LOW_STOCK_THRESHOLD = env('LOW_STOCK_THRESHOLD', 5, cast=int)
API_MAX_PAGE_SIZE = env('API_MAX_PAGE_SIZE', 200, cast=int)
LOGGING = {'version': 1, 'disable_existing_loggers': False,
    'handlers': {'console': {'class': 'logging.StreamHandler'}},
    'root': {'handlers': ['console'], 'level': env('LOG_LEVEL', 'INFO')}}

ACTIVITY_METADATA_MAX_BYTES = env('ACTIVITY_METADATA_MAX_BYTES', 4096, cast=int)
CACHES = {'default': {'BACKEND': env('CACHE_BACKEND', 'django.core.cache.backends.locmem.LocMemCache'),
    'LOCATION': env('CACHE_LOCATION', 'ia-collection')}}

from django.core.exceptions import ImproperlyConfigured
for _name, _value in {'API_PAGE_SIZE': REST_FRAMEWORK['PAGE_SIZE'], 'API_MAX_PAGE_SIZE': API_MAX_PAGE_SIZE,
    'PROFILE_IMAGE_MAX_BYTES': PROFILE_IMAGE_MAX_BYTES, 'PROFILE_IMAGE_MAX_PIXELS': PROFILE_IMAGE_MAX_PIXELS,
    'LOW_STOCK_THRESHOLD': LOW_STOCK_THRESHOLD, 'ACTIVITY_METADATA_MAX_BYTES': ACTIVITY_METADATA_MAX_BYTES}.items():
    if _value <= 0:
        raise ImproperlyConfigured(f'{_name} must be positive.')

# Optional external live-video try-on. Permanent credentials remain server-side.
DECART_API_KEY = env('DECART_API_KEY', '')
DECART_ALLOWED_ORIGINS = env('DECART_ALLOWED_ORIGINS', [], cast=list)
DECART_MAX_SESSION_SECONDS = env('DECART_MAX_SESSION_SECONDS', 120, cast=int)
REST_FRAMEWORK['DEFAULT_THROTTLE_RATES']['live_tryon'] = env('LIVE_TRYON_RATE', '3/hour')
if not 10 <= DECART_MAX_SESSION_SECONDS <= 300:
    raise ImproperlyConfigured('DECART_MAX_SESSION_SECONDS must be between 10 and 300.')
