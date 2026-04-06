import redis

try:
    cache = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True, socket_connect_timeout=1)
    cache.ping()
    USE_REAL_REDIS = True
except (redis.ConnectionError, redis.TimeoutError):
    USE_REAL_REDIS = False
    mock_cache = {}

def get_cached(key):
    if USE_REAL_REDIS:
        try:
            return cache.get(key)
        except:
            return None
    return mock_cache.get(key)

def set_cached(key, value, ttl):
    if USE_REAL_REDIS:
        try:
            cache.setex(key, ttl, value)
        except:
            pass
    else:
        mock_cache[key] = value

def invalidate_cache(key):
    if USE_REAL_REDIS:
        try:
            cache.delete(key)
        except:
            pass
    else:
        if key in mock_cache:
            del mock_cache[key]
