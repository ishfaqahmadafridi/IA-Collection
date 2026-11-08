"""Select a settings profile explicitly with DJANGO_ENV (development by default)."""
import os
from django.core.exceptions import ImproperlyConfigured

_environment = os.environ.get('DJANGO_ENV', 'development')
if _environment == 'production':
    from .production import *  # noqa: F403
elif _environment == 'test':
    from .test import *  # noqa: F403
elif _environment == 'development':
    from .development import *  # noqa: F403
else:
    raise ImproperlyConfigured('DJANGO_ENV must be development, test or production.')
