"""Mint scoped, short-lived Decart credentials; never proxy camera frames."""
import json
from urllib.error import HTTPError, URLError
from urllib.parse import urlsplit
from urllib.request import Request, build_opener, HTTPRedirectHandler
from django.conf import settings
from django.core.exceptions import ImproperlyConfigured
from django.utils import timezone
from django.utils.dateparse import parse_datetime
from rest_framework.exceptions import APIException, ValidationError
from ..models import Category

MODEL = 'lucy-vton-3.6'
TOKEN_TTL = 60
PROVIDER_TIMEOUT = 15
MAX_TOKEN_RESPONSE = 65536


class LiveTryOnUnavailable(APIException):
    status_code = 503
    default_detail = 'Live try-on is temporarily unavailable. Please try again later.'


class NoRedirect(HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


def allowed_origins():
    origins = settings.DECART_ALLOWED_ORIGINS
    if len(origins) > 20:
        raise ImproperlyConfigured('DECART_ALLOWED_ORIGINS must contain at most 20 origins.')
    for origin in origins:
        try:
            value = urlsplit(origin)
            default_port = (value.scheme == 'https' and value.port == 443) or (value.scheme == 'http' and value.port == 80)
            valid = value.scheme in {'http', 'https'} and value.hostname and not value.username and not value.password and not value.path and not value.query and not value.fragment and not default_port and value.netloc == value.netloc.lower() and origin == f'{value.scheme}://{value.netloc}'
        except ValueError:
            valid = False
        if not valid or len(origin) > 253:
            raise ImproperlyConfigured('DECART_ALLOWED_ORIGINS must contain canonical HTTP(S) origins without paths or default ports.')
    return origins


def validate_product(product):
    if not product.image or not product.category.try_on_kind:
        raise ValidationError({'product_id': 'Try-on is not available for this product category.'})
    try:
        image = urlsplit(product.image)
        valid = (not image.scheme and not image.netloc and image.path.startswith('/')) or (image.scheme == 'https' and image.hostname and not image.username and not image.password)
    except ValueError:
        valid = False
    if not valid:
        raise ValidationError({'product_id': 'This garment photo is not available for live try-on.'})
    return product


def product_prompt(product):
    bottom = product.category.try_on_kind == Category.TryOnKind.BOTTOM
    target = 'pants' if bottom else 'inner shirt or top'
    exposed = 'legs' if bottom else 'arms'
    return (
        f'Replace the camera person\'s {target} with only the reference garment ({product.name}). '
        'Perform clothing replacement, not a photo overlay or recoloring of the original garment. '
        'Fit the reference garment naturally to the camera person as they move. '
        'Match its exact color, print, collar, texture, silhouette, hem and sleeve length. '
        f'Remove original fabric outside the replacement garment, including longer original sleeves or hems. '
        f'Where the selected garment exposes more of the {exposed}, synthesize plausible skin consistent with the camera person, not leftover fabric. '
        'Preserve the camera person\'s face, identity, body proportions, hands, pose, background and other clothing. '
        'Keep any existing outer coat or jacket unchanged and in front of the replacement inner garment; preserve its occlusion. '
        'Use the reference image only for garment appearance. Never copy its model\'s face, skin, body or background into the output. '
        'Maintain consistent garment detail and skin appearance between video frames.'
    )


def mint_token(origin):
    if not settings.DECART_API_KEY:
        raise LiveTryOnUnavailable()
    payload = {'expiresIn': TOKEN_TTL, 'allowedModels': [MODEL], 'allowedOrigins': [origin],
        'constraints': {'realtime': {'maxSessionDuration': settings.DECART_MAX_SESSION_SECONDS}}}
    request = Request('https://api.decart.ai/v1/client/tokens', data=json.dumps(payload).encode(),
        headers={'x-api-key': settings.DECART_API_KEY, 'Content-Type': 'application/json'}, method='POST')
    try:
        with build_opener(NoRedirect()).open(request, timeout=PROVIDER_TIMEOUT) as response:
            raw = response.read(MAX_TOKEN_RESPONSE + 1)
        if len(raw) > MAX_TOKEN_RESPONSE:
            raise ValueError
        data = json.loads(raw)
        key = data.get('apiKey') if isinstance(data, dict) else None
        expires = parse_datetime(data.get('expiresAt', '')) if isinstance(data, dict) else None
        if not isinstance(key, str) or not key or len(key) > 8192 or key == settings.DECART_API_KEY or not expires or timezone.is_naive(expires):
            raise ValueError
        remaining = (expires - timezone.now()).total_seconds()
        if not 0 < remaining <= TOKEN_TTL + 30:
            raise ValueError
        return {'apiKey': key, 'expiresAt': expires.isoformat()}
    except (HTTPError, URLError, OSError, ValueError, TypeError, OverflowError):
        raise LiveTryOnUnavailable()
