from django.core.management.base import BaseCommand
from rest_framework.exceptions import ValidationError
from store_api.models import UserProfile
from store_api.validators.images import decode_profile_image
from store_api.services.accounts import save_profile_image

class Command(BaseCommand):
    help = 'Validate legacy profile images; use --apply to move them to configured file storage.'

    def add_arguments(self, parser):
        parser.add_argument('--apply', action='store_true')

    def handle(self, *args, **options):
        valid = invalid = 0
        for profile in UserProfile.objects.filter(image='').exclude(profile_image='').select_related('user').iterator():
            try:
                data = decode_profile_image(profile.profile_image)
                if options['apply']:
                    save_profile_image(profile.user, data)
                valid += 1
            except ValidationError:
                invalid += 1
                self.stderr.write(f'Profile {profile.pk} has invalid legacy image data; it was preserved.')
        self.stdout.write(f'{valid} valid, {invalid} invalid. ' + ('Converted valid images.' if options['apply'] else 'Dry run; nothing changed.'))
