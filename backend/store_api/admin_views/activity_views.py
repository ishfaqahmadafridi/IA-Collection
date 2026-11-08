from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from ..serializers.activity import ActivityLogSerializer, NewsletterSerializer
from ..services.activity import record_activity, subscribe
from ..throttles import PublicWriteThrottle

@api_view(['POST'])
@permission_classes([AllowAny])
@throttle_classes([PublicWriteThrottle])
def log_user_activity(request):
    serializer = ActivityLogSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    record_activity(request, **serializer.validated_data)
    return Response({'status': 'success'})

@api_view(['POST'])
@permission_classes([AllowAny])
@throttle_classes([PublicWriteThrottle])
def subscribe_newsletter(request):
    serializer = NewsletterSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    subscription, outcome = subscribe(serializer.validated_data['email'])
    return Response({'status': outcome, 'email': subscription.email}, status=201 if outcome == 'subscribed' else 200)
