from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Category, Product
from .serializers import CategorySerializer, ProductSerializer

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'slug'
    
    def get_queryset(self):
        queryset = Category.objects.all()
        # Filter by parent parameter
        parent_id = self.request.query_params.get('parent', None)
        parent_only = self.request.query_params.get('parent_only', None)
        
        if parent_only == 'true':
            # Return only parent categories (no parent)
            queryset = queryset.filter(parent__isnull=True)
        elif parent_id:
            # Return subcategories of a specific parent
            queryset = queryset.filter(parent_id=parent_id)
        
        return queryset
    
    @action(detail=False, methods=['get'])
    def parents(self, request):
        """Get only parent categories (Men, Women, Kids, etc.)"""
        parents = Category.objects.filter(parent__isnull=True)
        serializer = self.get_serializer(parents, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def subcategories(self, request, slug=None):
        """Get subcategories of a specific category"""
        category = self.get_object()
        subs = category.subcategories.all()
        serializer = self.get_serializer(subs, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def products(self, request, slug=None):
        """Get products of a category (including all subcategory products for parent categories)"""
        category = self.get_object()
        
        # If it's a parent category, get products from all subcategories
        if category.parent is None:
            subcategory_ids = category.subcategories.values_list('id', flat=True)
            products = Product.objects.filter(category_id__in=list(subcategory_ids) + [category.id])
        else:
            products = category.products.all()
        
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)

class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    
    def get_queryset(self):
        queryset = Product.objects.all()
        
        # Filter by category
        category = self.request.query_params.get('category', None)
        category_slug = self.request.query_params.get('category_slug', None)
        
        if category:
            queryset = queryset.filter(category_id=category)
        elif category_slug:
            try:
                cat = Category.objects.get(slug=category_slug)
                # If parent category, include products from subcategories
                if cat.parent is None:
                    subcategory_ids = cat.subcategories.values_list('id', flat=True)
                    queryset = queryset.filter(category_id__in=list(subcategory_ids) + [cat.id])
                else:
                    queryset = queryset.filter(category=cat)
            except Category.DoesNotExist:
                return queryset.none()
        
        return queryset
