from django.conf.urls import url, include

from common.middleware.cache import orderless_cache_page
from mobile.views.mobile_data_tool_view import MobileDataToolView
from mobile.views.mobile_allegation_view import MobileAllegationView
from mobile.views.mobile_officer_view import MobileOfficerView
from mobile.views.mobile_site_view import MobileSiteView
from mobile.views.mobile_suggestion_view import MobileSuggestionView


cache_view = orderless_cache_page(86400 * 90)

urlpatterns = [
    url(r'^$', cache_view(MobileSiteView.as_view()), name='home'),
    url(r'^lookup/', include('common.urls', namespace='common')),

    # api urls
    url(r'^api/suggestion/$', cache_view(MobileSuggestionView.as_view()), name='mobile-suggestion'),
    url(r'^api/allegation/$', cache_view(MobileAllegationView.as_view()), name='mobile-allegation'),
    url(r'^api/officer/$', cache_view(MobileOfficerView.as_view()), name='mobile-officer'),

    # fall-back urls
    url(r'^mobile/api/suggestion/$', cache_view(MobileSuggestionView.as_view()), name='mobile-suggestion'),
    url(r'^mobile/api/allegation/$', cache_view(MobileAllegationView.as_view()), name='mobile-allegation'),
    url(r'^mobile/api/officer/$', cache_view(MobileOfficerView.as_view()), name='mobile-officer'),

    # for interpret from desktop version
    url(r'^data/(?P<hash_id>\w+)/(?P<slug>.*)$', MobileDataToolView.as_view(), name='data-tool'),
    url(r'^mobile/data/(?P<hash_id>\w+)/(?P<slug>.*)$', MobileDataToolView.as_view(), name='mobile-data-tool'),

    url(r'^(officer/[^/]+/\d+|complaint/\d+|s/.*|q/.*)?/?$', cache_view(MobileSiteView.as_view()), name='home'),
    url(r'^mobile/(officer/[^/]+/\d+|complaint/\d+|s/.*|q/.*)?/?$', cache_view(MobileSiteView.as_view()),
        name='mobile-home')
]
