from django.conf.urls import url
from django.views.decorators.cache import cache_page

from allegation.views import AllegationAPIView, AreaAPIView, AllegationClusterApiView
from allegation.views import AllegationChartApiView, AllegationCSVView, InvestigationAPIView
from allegation.views import AllegationSummaryApiView, OfficerListAPIView
from allegation.views.allegation_analysis_api_view import AllegationAnalysisAPIView
from allegation.views.allegation_download_view import AllegationDownloadView


cache_view = cache_page(86400 * 90)


urlpatterns = [
    url(r'^api/allegations/$', cache_view(AllegationAPIView.as_view()), name='allegation-api'),
    url(r'^api/allegations/analysis$', cache_view(AllegationAnalysisAPIView.as_view()), name='allegation-api-analysis'),
    url(r'^api/allegations/csv/$', cache_view(AllegationCSVView.as_view()), name='allegation-api-csv'),
    url(r'^api/allegations/cluster/$', cache_view(AllegationClusterApiView.as_view()), name='allegation-api-gis'),
    url(r'^api/allegations/summary/$', cache_view(AllegationSummaryApiView.as_view()), name='allegation-api-summary'),
    url(r'^api/allegations/chart/$', cache_view(AllegationChartApiView.as_view()), name='allegation-api-chart'),
    url(r'^api/allegations/officers/$', cache_view(OfficerListAPIView.as_view()), name='allegation-api-summary'),
    url(r'^api/areas/$', cache_view(AreaAPIView.as_view()), name='area-api'),
    url(r'^api/investigation/$', cache_view(InvestigationAPIView.as_view()), name='investigation'),
    url(r'^allegations/download/', (AllegationDownloadView.as_view()), name='allegation-download'),
]
