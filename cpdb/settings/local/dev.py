import sys

from cpdb.settings.base import *


if 'test' in sys.argv:
    import sure

    (lambda n: n)(sure)  # ignore warning
    CELERY_ALWAYS_EAGER = True

MAP_BOX_API_KEY = 'sk.eyJ1Ijoic3RlZmFuZ2VvcmciLCJhIjoiMTNLSkhyTSJ9.b6k_KvDsuacf72UgbStcGQ'
ALLEGATION_LIST_ITEM_COUNT = 25
CACHES = {
    'default': {
        'BACKEND': 'redis_cache.RedisCache',
        'LOCATION': 'redis://localhost:6379/0',
        'OPTIONS': {
            'MAX_ENTRIES': 20000
        }
    },
}

if len(sys.argv) > 1 and sys.argv[1] == 'test':
    CACHES = {
        'default': {
            'BACKEND': 'django.core.cache.backends.dummy.DummyCache',
        }
    }
