from rest_framework.throttling import SimpleRateThrottle

class AuthenticationThrottle(SimpleRateThrottle):
    scope = 'auth'

    def get_cache_key(self, request, view):
        return self.cache_format % {'scope': self.scope, 'ident': self.get_ident(request)}


class PublicWriteThrottle(AuthenticationThrottle):
    scope = 'public_write'
