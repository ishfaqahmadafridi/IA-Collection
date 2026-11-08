from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from ..selectors.dashboard import dashboard_stats as read_dashboard_stats

@api_view(['GET'])
@permission_classes([IsAdminUser])
def dashboard_stats(request):
    return Response(read_dashboard_stats())
