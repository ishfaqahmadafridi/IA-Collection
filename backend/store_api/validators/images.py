import base64
import binascii
import io
from django.conf import settings
from PIL import Image, UnidentifiedImageError
from rest_framework.exceptions import ValidationError
from ..constants import PROFILE_IMAGE_FORMATS


def decode_profile_image(value):
    try:
        if not isinstance(value, str) or len(value) > ((settings.PROFILE_IMAGE_MAX_BYTES + 2) // 3) * 4 + 100:
            raise ValueError
        header, encoded = value.split(',', 1)
        expected_format = PROFILE_IMAGE_FORMATS.get(header)
        if expected_format is None:
            raise ValueError
        data = base64.b64decode(encoded, validate=True)
        if len(data) > settings.PROFILE_IMAGE_MAX_BYTES:
            raise ValueError
        with Image.open(io.BytesIO(data)) as image:
            if image.format != expected_format or image.width * image.height > settings.PROFILE_IMAGE_MAX_PIXELS:
                raise ValueError
            image.verify()
        return data, {'JPEG': 'jpg', 'PNG': 'png', 'WEBP': 'webp'}[expected_format]
    except (ValueError, binascii.Error, UnidentifiedImageError, OSError, Image.DecompressionBombError):
        raise ValidationError('Provide a valid JPEG, PNG or WebP image within the configured upload limit.')
