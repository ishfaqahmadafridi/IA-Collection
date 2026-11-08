import logging
from rest_framework.response import Response
from rest_framework.views import exception_handler
logger = logging.getLogger(__name__)

def api_exception_handler(error, context):
    response = exception_handler(error, context)
    if response is not None:
        return response
    logger.error('Unhandled API exception', exc_info=(type(error), error, error.__traceback__))
    return Response({'detail': 'An internal error occurred. Please try again later.'}, status=500)
