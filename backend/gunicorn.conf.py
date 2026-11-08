import os
os.environ.setdefault('DJANGO_ENV', 'production')
bind = os.environ.get('GUNICORN_BIND', '0.0.0.0:8000')
workers = int(os.environ.get('GUNICORN_WORKERS', '2'))
timeout = int(os.environ.get('GUNICORN_TIMEOUT', '30'))
accesslog = '-'
errorlog = '-'

forwarded_allow_ips = os.environ.get('GUNICORN_FORWARDED_ALLOW_IPS', '')
