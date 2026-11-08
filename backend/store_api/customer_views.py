"""Customer checkout and order lookup; no client-supplied financial values."""
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Order
from .serializers import OrderSerializer, CheckoutSerializer
from .services.checkout import create_order


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
