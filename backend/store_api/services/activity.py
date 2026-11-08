from django.utils import timezone
from ..models import UserActivity, Subscription


def record_activity(request, activity_type, metadata=None, user=None):
    return UserActivity.objects.create(
        user=user if user is not None else (request.user if request.user.is_authenticated else None),
        activity_type=activity_type, metadata=metadata or {},
        ip_address=request.META.get('REMOTE_ADDR'), user_agent=request.META.get('HTTP_USER_AGENT', '')[:512],
    )


def subscribe(email):
    subscription, created = Subscription.objects.get_or_create(email=email.strip().lower(), defaults={'is_active': True})
    if not created and not subscription.is_active:
        subscription.is_active = True
        subscription.unsubscribed_at = None
        subscription.save(update_fields=['is_active', 'unsubscribed_at'])
        return subscription, 'reactivated'
    return subscription, 'subscribed' if created else 'already_subscribed'
