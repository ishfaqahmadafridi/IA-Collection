FROM python:3.11-slim
WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1 PIP_NO_CACHE_DIR=1 DJANGO_ENV=production
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
RUN DJANGO_ENV=development python manage.py collectstatic --noinput \
    && useradd --create-home app \
    && mkdir -p /app/data /app/media \
    && chown -R app:app /app/data /app/media
USER app
EXPOSE 8000
CMD ["sh", "entrypoint.sh"]
