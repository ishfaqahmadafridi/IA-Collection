from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from .serializers import CategorySerializer, ProductSerializer
from .serializers.queries import ProductQuerySerializer, CategoryQuerySerializer, validated_query
from .selectors import catalog

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = catalog.categories()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'

    def get_queryset(self):
        query = validated_query(CategoryQuerySerializer, self.request.query_params)
        result = catalog.categories()
        if query['parent_only']:
            return result.filter(parent__isnull=True)
        if 'parent' in query:
            return result.filter(parent_id=query['parent'])
        return result

    def paged(self, queryset, serializer_class=None):
        page = self.paginate_queryset(queryset)
        serializer = (serializer_class or self.serializer_class)(page, many=True, context=self.get_serializer_context())
        return self.get_paginated_response(serializer.data)

    @action(detail=False, methods=['get'])
    def parents(self, request):
        return self.paged(catalog.categories().filter(parent__isnull=True))

    @action(detail=True, methods=['get'])
    def subcategories(self, request, slug=None):
        return self.paged(catalog.categories().filter(parent=self.get_object()))

    @action(detail=True, methods=['get'])
    def products(self, request, slug=None):
        return self.paged(catalog.products().filter(category_id__in=catalog.category_ids(self.get_object())), ProductSerializer)

class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = catalog.products()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return catalog.filtered_products(**validated_query(ProductQuerySerializer, self.request.query_params))
