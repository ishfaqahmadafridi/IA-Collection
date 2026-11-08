"""Compatibility entry point; prefer python manage.py seed_catalog --source assets."""
import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'store_backend.settings')

def seed():
    django.setup()
    from django.core.management import call_command
    call_command('seed_catalog', source='assets')

if __name__ == '__main__':
    seed()
