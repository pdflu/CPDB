from django.views.generic.base import TemplateView


class AdminAnalysisDashboardView(TemplateView):
    template_name = "dashboard/index.html"
