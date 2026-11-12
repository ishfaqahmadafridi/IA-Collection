from django.conf import settings
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.throttling import UserRateThrottle
from rest_framework.views import APIView
from .serializers.live_tryon import LiveTryOnProductSerializer, LiveTryOnTokenSerializer
from .services.live_tryon import MODEL, allowed_origins, mint_token, product_prompt, LiveTryOnUnavailable


class LiveTryOnThrottle(UserRateThrottle):
    scope = 'live_tryon'


class LiveTryOnConfig(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        serializer = LiveTryOnProductSerializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)
        product = serializer.validated_data['product']
        return Response({'available': bool(settings.DECART_API_KEY and allowed_origins()), 'provider': 'Decart',
            'model': MODEL, 'session_seconds': settings.DECART_MAX_SESSION_SECONDS, 'requires_sign_in': True,
            'garment_image': product.image, 'prompt': product_prompt(product)})


class LiveTryOnToken(APIView):
    permission_classes = [IsAuthenticated]
    throttle_classes = [LiveTryOnThrottle]

    def post(self, request):
        serializer = LiveTryOnTokenSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        origins = allowed_origins()
        if not settings.DECART_API_KEY or not origins:
            raise LiveTryOnUnavailable()
        origin = request.headers.get('Origin', '')
        if origin not in origins:
            return Response({'detail': 'This website is not enabled for live try-on.'}, status=403)
        response = Response(mint_token(origin))
        response['Cache-Control'] = 'no-store, private'
        response['Pragma'] = 'no-cache'
        return response
