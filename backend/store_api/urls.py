from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, ProductViewSet
from .auth_views import (
    RegisterView, CustomTokenObtainPairView,
    upload_profile_image, change_password, get_profile, update_profile
)
from rest_framework_simplejwt.views import TokenRefreshView

# Import from organized admin_views package
from .admin_views import (
    AdminProductViewSet, AdminOrderViewSet,
    dashboard_stats, sales_analytics, user_analytics,
    top_selling_products, log_user_activity, subscribe_newsletter
)

from .customer_views import CustomerOrderCreate, CustomerOrderDetail

# Single router for all viewsets
router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'products', ProductViewSet)
router.register(r'admin/products', AdminProductViewSet, basename='admin-products')
router.register(r'admin/orders', AdminOrderViewSet, basename='admin-orders')

urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Profile endpoints
    path('orders/', CustomerOrderCreate.as_view(), name='customer-order-create'),
    path('orders/<str:order_number>/', CustomerOrderDetail.as_view(), name='customer-order-detail'),
    path('profile/update/', update_profile, name='profile-update'),
    path('profile/', get_profile, name='profile'),
    path('profile/upload-image/', upload_profile_image, name='upload-profile-image'),
    path('profile/change-password/', change_password, name='change-password'),
    
    # Admin analytics endpoints
    path('admin/dashboard/stats/', dashboard_stats, name='dashboard-stats'),
    path('admin/analytics/sales/', sales_analytics, name='sales-analytics'),
    path('admin/analytics/users/', user_analytics, name='user-analytics'),
    path('admin/analytics/top-products/', top_selling_products, name='top-products'),
    
    # Public endpoints
    path('activity/log/', log_user_activity, name='log-activity'),
    path('subscribe/', subscribe_newsletter, name='subscribe'),
]
