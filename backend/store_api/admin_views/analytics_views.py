from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from ..serializers.queries import AnalyticsQuerySerializer, TopProductsQuerySerializer, validated_query
from ..selectors import analytics

@api_view(['GET'])
@permission_classes([IsAdminUser])
def sales_analytics(request):
    return Response(analytics.sales_analytics(**validated_query(AnalyticsQuerySerializer, request.query_params)))

@api_view(['GET'])
@permission_classes([IsAdminUser])
def user_analytics(request):
    return Response(analytics.user_analytics(**validated_query(AnalyticsQuerySerializer, request.query_params)))

@api_view(['GET'])
@permission_classes([IsAdminUser])
def top_selling_products(request):
    return Response(analytics.top_products(**validated_query(TopProductsQuerySerializer, request.query_params)))
