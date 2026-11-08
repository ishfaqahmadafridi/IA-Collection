"""Customer checkout and order lookup; no client-supplied financial values."""
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import serializers
from .models import Order
from .serializers import OrderSerializer
from .services.checkout import create_order


class CheckoutItemSerializer(serializers.Serializer):
    product = serializers.IntegerField(min_value=1)
    quantity = serializers.IntegerField(min_value=1, max_value=1000)
    size = serializers.CharField(max_length=50, allow_blank=True, default='')


class CheckoutSerializer(serializers.Serializer):
    checkout_key = serializers.UUIDField()
    shipping_address = serializers.CharField(min_length=10, max_length=2000)
    items = CheckoutItemSerializer(many=True, allow_empty=False, max_length=100)


class CustomerOrderCreate(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CheckoutSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order, created = create_order(request.user, **serializer.validated_data)
        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)


class CustomerOrderDetail(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = OrderSerializer
    lookup_field = 'order_number'

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).prefetch_related('items__product')
