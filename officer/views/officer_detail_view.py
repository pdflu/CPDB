import json
from django.conf import settings
from django.db.models.aggregates import Count
from django.http import HttpResponse
from django.shortcuts import render
from django.views.generic.base import View

from common.json_serializer import JSONSerializer
from common.models import Officer, Allegation, PoliceWitness


class OfficerDetailView(View):
    def get(self, request):
        officer_id = request.GET.get('pk')
        officer = Officer.objects.get(id=officer_id)
        allegations = Allegation.objects.filter(officer=officer)
        has_map = allegations.exclude(point=None).count() > settings.MAP_POINT_THRESHOLD
        related_query = Allegation.objects.filter(crid__in=allegations.values_list('crid', flat=True))
        related_query = related_query.exclude(officer_id=officer_id)
        related_officers_ordered = related_query.values('officer').annotate(total=Count('crid')).order_by('-total')

        related_witness = PoliceWitness.objects.filter(crid__in=allegations.values_list('crid', flat=True))
        related_witness = related_witness.exclude(officer_id=officer_id)
        related_witness_ordered = related_witness.values('officer').annotate(total=Count('crid')).order_by('-total')

        related_officers = []
        for related_officer in related_officers_ordered:
            related_officers.append({'num_allegations': related_officer['total'],
                                     'witness': False,
                                     'officer': Officer.objects.get(pk=related_officer['officer'])})

        for witness in related_witness_ordered:
            related_officers.append({'num_allegations': witness['total'],
                                     'witness': True,
                                     'officer': Officer.objects.get(pk=witness['officer'])})

        related_officers = sorted(related_officers, key=lambda n: n['num_allegations'], reverse=True)

        return HttpResponse(JSONSerializer().serialize({
            'officer': officer,
            'allegations': allegations,
            'relatedOfficers': related_officers,
            'has_map': has_map
        }))
