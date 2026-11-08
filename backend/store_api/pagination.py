from django.conf import settings
from rest_framework.pagination import PageNumberPagination


class StorePagination(PageNumberPagination):
    page_size_query_param = 'page_size'

    @property
    def max_page_size(self):
        return settings.API_MAX_PAGE_SIZE
