"""
Product Management Views
Admin CRUD operations and inventory management for products
"""

from rest_framework import viewsets, status, serializers
from django.db.models.deletion import ProtectedError
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser

from ..models import Product
from ..serializers import ProductSerializer


class AdminProductViewSet(viewsets.ModelViewSet):
    """
    Admin CRUD operations for products
    Provides endpoints for product management and inventory tracking
    """
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAdminUser]

    @action(detail=False, methods=['get'])
    def inventory_status(self, request):
        """
        Get inventory status summary
        Returns total products, in stock, out of stock, and low stock counts
        """
        total_products = Product.objects.count()
        in_stock = Product.objects.filter(stock__gt=0).count()
        out_of_stock = Product.objects.filter(stock=0).count()
        low_stock = Product.objects.filter(stock__gt=0, stock__lt=5).count()
        
        return Response({
            'total_products': total_products,
            'in_stock': in_stock,
            'out_of_stock': out_of_stock,
            'low_stock': low_stock
        })

    @action(detail=False, methods=['get'])
    def low_stock_products(self, request):
        """
        Get products with low stock (stock > 0 and < 5)
        Useful for inventory alerts
        """
        products = Product.objects.filter(stock__gt=0, stock__lt=5)
        serializer = self.get_serializer(products, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def out_of_stock_products(self, request):
        """
        Get out of stock products (stock = 0)
        Helps identify products needing restocking
        """
        products = Product.objects.filter(stock=0)
        serializer = self.get_serializer(products, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def update_stock(self, request, pk=None):
        """
        Update product stock level
        Expects 'stock' parameter in request data
        """
        class StockSerializer(serializers.Serializer):
            stock = serializers.IntegerField(min_value=0)
        serializer = StockSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        product = self.get_object()
        product.stock = serializer.validated_data['stock']
        product.save(update_fields=['stock', 'updated_at'])
        return Response(self.get_serializer(product).data)

    def destroy(self, request, *args, **kwargs):
        try:
            return super().destroy(request, *args, **kwargs)
        except ProtectedError:
            return Response({'detail': 'Products referenced by orders cannot be deleted. Set stock to zero instead.'}, status=409)
