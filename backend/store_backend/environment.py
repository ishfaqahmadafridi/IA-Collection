"""Typed environment access and database URL parsing, without embedded credentials."""
import os
from pathlib import Path
from urllib.parse import urlparse, parse_qs, unquote
from django.core.exceptions import ImproperlyConfigured


def env(name, default=None, cast=str):
    value = os.environ.get(name)
    if value is None:
        return default
    if cast is bool:
        normalized = value.lower().strip()
        if normalized not in {'true', 'false', '1', '0', 'yes', 'no'}:
            raise ImproperlyConfigured(f'{name} must be a boolean.')
        return normalized in {'true', '1', 'yes'}
    if cast is list:
        return [part.strip() for part in value.split(',') if part.strip()]
    try:
        return cast(value)
    except (ValueError, TypeError) as error:
        raise ImproperlyConfigured(f'{name} has an invalid value.') from error


def database_config(url, base_dir):
    if not url:
        return {'ENGINE': 'django.db.backends.sqlite3', 'NAME': base_dir / 'db.sqlite3'}
    parsed = urlparse(url)
    if parsed.scheme == 'sqlite':
        name = unquote(parsed.path)
        if name.startswith('//'):
            name = name[1:]
        else:
            name = str(base_dir / name.lstrip('/'))
        return {'ENGINE': 'django.db.backends.sqlite3', 'NAME': name}
    if parsed.scheme in {'postgres', 'postgresql'}:
        result = {'ENGINE': 'django.db.backends.postgresql', 'NAME': unquote(parsed.path.lstrip('/')),
            'USER': unquote(parsed.username or ''), 'PASSWORD': unquote(parsed.password or ''),
            'HOST': parsed.hostname or '', 'PORT': parsed.port or '', 'CONN_MAX_AGE': env('DB_CONN_MAX_AGE', 60, cast=int)}
        options = parse_qs(parsed.query)
        if 'sslmode' in options:
            result['OPTIONS'] = {'sslmode': options['sslmode'][0]}
        return result
    raise ImproperlyConfigured('DATABASE_URL must use sqlite, postgres or postgresql.')
