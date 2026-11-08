#!/bin/sh
set -eu
DJANGO_ENV=${DJANGO_ENV:-production}
export DJANGO_ENV
python manage.py migrate --noinput
python manage.py createcachetable
exec gunicorn store_backend.wsgi:application --config gunicorn.conf.py
