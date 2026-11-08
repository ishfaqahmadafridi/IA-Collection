from django.db.models import Count
from rest_framework import viewsets, mixins
from rest_framework.decorators import action
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from ..serializers import OrderSerializer, AdminOrderUpdateSerializer
from ..serializers.queries import RecentOrderQuerySerializer, OrderQuerySerializer, validated_query
from ..selectors import orders as selectors
from ..services.orders import update_order

class AdminOrderViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin, mixins.UpdateModelMixin, viewsets.GenericViewSet):
    queryset = selectors.orders()
    serializer_class = OrderSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        query = validated_query(OrderQuerySerializer, self.request.query_params)
        result = selectors.orders()
        return result.filter(status=query['status']) if 'status' in query else result

    def update(self, request, *args, **kwargs):
        order = self.get_object()
        serializer = AdminOrderUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order = update_order(order.pk, **serializer.validated_data)
        return Response(OrderSerializer(order).data)

    @action(detail=False, methods=['get'])
    def recent_orders(self, request):
        query = validated_query(RecentOrderQuerySerializer, request.query_params)
        page = self.paginate_queryset(selectors.recent_orders(query['days']))
        return self.get_paginated_response(OrderSerializer(page, many=True).data)

    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        self.get_object()
        serializer = AdminOrderUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        if 'status' not in serializer.validated_data:
            from rest_framework.exceptions import ValidationError
            raise ValidationError({'status': ['This field is required.']})
        order = update_order(pk, **serializer.validated_data)
        return Response({'message': f'Order status updated to {order.status}', 'order': OrderSerializer(order).data})

    @action(detail=False, methods=['get'])
    def status_summary(self, request):
        summary = list(self.queryset.values('status').order_by('status').annotate(count=Count('id')))
        return Response({'summary': summary, 'total': sum(row['count'] for row in summary)})
