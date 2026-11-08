from uuid import uuid4
from django.core.files.base import ContentFile
from django.db import transaction
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework.exceptions import ValidationError
from ..models import UserProfile


def profile_data(user, request):
    profile, _ = UserProfile.objects.get_or_create(user=user)
    image = request.build_absolute_uri(profile.image.url) if profile.image else profile.profile_image
    return {'id': user.id, 'username': user.username, 'email': user.email,
        'name': user.first_name or user.username, 'is_staff': user.is_staff, 'profile_image': image or ''}


def change_user_password(user, current_password, new_password):
    if not user.check_password(current_password):
        raise ValidationError({'currentPassword': ['Current password is incorrect.']})
    try:
        validate_password(new_password, user=user)
    except DjangoValidationError as error:
        raise ValidationError({'newPassword': error.messages})
    user.set_password(new_password)
    user.save(update_fields=['password'])


def save_profile_image(user, data=None):
    with transaction.atomic():
        profile, _ = UserProfile.objects.get_or_create(user=user)
        profile = UserProfile.objects.select_for_update().get(pk=profile.pk)
        old_name = profile.image.name
        storage = profile.image.storage
        if data is not None:
            content, extension = data
            profile.image.save(f'{uuid4().hex}.{extension}', ContentFile(content), save=False)
        else:
            profile.image = ''
        profile.profile_image = ''
        try:
            profile.save(update_fields=['image', 'profile_image', 'updated_at'])
        except Exception:
            if data is not None:
                storage.delete(profile.image.name)
            raise
        if old_name:
            transaction.on_commit(lambda: storage.delete(old_name), robust=True)
        return profile
