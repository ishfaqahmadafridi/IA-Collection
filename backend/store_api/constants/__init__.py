from decimal import Decimal

PERIOD_DAYS = {'week': 7, 'month': 30, 'year': 365}
DEFAULT_PERIOD = 'week'
DEFAULT_RECENT_DAYS = 7
MAX_RECENT_DAYS = 365
DEFAULT_TOP_PRODUCTS = 10
MAX_TOP_PRODUCTS = 100
CHECKOUT_MAX_LINES = 100
CHECKOUT_MAX_QUANTITY = 1000
SHIPPING_ADDRESS_MIN_LENGTH = 10
SHIPPING_ADDRESS_MAX_LENGTH = 2000
MAX_ORDER_AMOUNT = Decimal('99999999.99')
PROFILE_IMAGE_FORMATS = {'data:image/png;base64': 'PNG', 'data:image/jpeg;base64': 'JPEG', 'data:image/webp;base64': 'WEBP'}
# Login/logout/purchase are authoritative server events, never accepted from public clients.
PUBLIC_ACTIVITY_TYPES = ('view_product', 'add_to_cart', 'view_cart', 'search', 'view_category', 'view_home', 'view_landing', 'view_signin', 'view_signup')
ORDER_STATUS_CHOICES = [('pending', 'Pending'), ('processing', 'Processing'), ('shipped', 'Shipped'), ('delivered', 'Delivered'), ('cancelled', 'Cancelled')]
ORDER_TRANSITIONS = {'pending': {'processing', 'cancelled'}, 'processing': {'shipped', 'cancelled'}, 'shipped': {'delivered'}, 'delivered': set(), 'cancelled': set()}
