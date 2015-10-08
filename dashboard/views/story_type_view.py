from django.views.generic.base import View

from document.response import JsonResponse
from officer.models import Story


class StoryTypeView(View):
	def get(self, request):
		query = request.GET.get('query', '')
		types = Story.objects.filter(story_type__icontains=query).values_list('story_type', flat=True)

		return JsonResponse(data={
			'data': list(types),
		})