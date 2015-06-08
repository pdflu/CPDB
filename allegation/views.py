import json

from django.conf import settings
from django.db.models import Count
from django.db.models.query_utils import Q
from django.http.response import HttpResponse
from django.views.generic import View
from django.views.generic import TemplateView
from django.contrib.gis.geos import Point
from django.contrib.gis.measure import D

from common.json_serializer import JSONSerializer
from common.models import Allegation, Area, AllegationCategory, Officer, PoliceWitness, ComplainingWitness


class AllegationListView(TemplateView):
    template_name = 'allegation/home.html'


class AreaAPIView(View):
    def get(self, request):
        areas = Area.objects.all().exclude(type='school-grounds')
        type_filter = request.GET.get('type')

        if type_filter:
            areas = areas.filter(type=type_filter)

        area_dict = {
            "type": "FeatureCollection",
            "features": [],
        }
        for area in areas:
            polygon = None
            if area.polygon:
                polygon = json.loads(area.polygon.geojson)
            area_json = {
                "type": "Feature",
                "properties": {
                    'id': area.id,
                    'name': area.name,
                    'type': area.type,
                },
                'geometry': polygon
            }

            area_dict['features'].append(area_json)
        content = json.dumps(area_dict)
        return HttpResponse(content)


class AllegationAPIView(View):
    def __init__(self, **kwargs):
        super(AllegationAPIView, self).__init__(**kwargs)
        self.filters = {}
        self.conditions = []
        self.years = []
        self.months = []
        self.days = []

    def add_filter(self, field):
        value = self.request.GET.getlist(field)
        if len(value) > 1:
            self.filters["%s__in" % field] = value

        elif value:
            self.filters[field] = value[0]

    def add_date_filter(self, field):
        condition = Q()

        field_name = '%s__range' % field
        date_ranges = self.request.GET.getlist(field_name)

        field_name = '%s__year' % field
        years = self.request.GET.getlist(field_name)

        field_name = '%s__year_month' % field
        year_months = self.request.GET.getlist(field_name)

        dates = self.request.GET.getlist(field)
        for date_range in date_ranges:
            date_range = date_range.split(',')
            condition = condition | Q(**{'%s__range' % field: date_range})
        for year in years:
            condition = condition | Q(**{"%s__year" % field: year})

        for year_month in year_months:
            year, month = year_month.split('-')
            condition = condition | Q(Q(**{"%s__year" % field: year}) & Q(**{"%s__month" % field: month}))

        formatted_dates = []
        for date in dates:
            formatted_dates.append(date.replace('/','-'))

        if dates:
            condition = condition | Q(**{"%s__in" % field: formatted_dates})

        self.conditions.append(condition)

    def get_allegations(self):
        filters = ['crid', 'areas__id', 'cat', 'neighborhood_id', 'recc_finding', 'final_outcome',
                   'recc_outcome', 'final_finding', 'officer_id', 'officer__star', 'investigator',
                   ]

        date_filters = ['incident_date_only']

        for filter_field in filters:
            self.add_filter(filter_field)

        for date_filter in date_filters:
            self.add_date_filter(date_filter)

        if 'category' in self.request.GET:
            self.filters['cat__category'] = self.request.GET['category']

        allegations = Allegation.objects.filter(*self.conditions, **self.filters)

        if 'latlng' in self.request.GET:
            latlng = self.request.GET['latlng'].split(',')
            if len(latlng) == 2:
                radius = self.request.GET.get('radius', 500)
                point = Point(float(latlng[1]), float(latlng[0]))
                allegations = allegations.filter(point__distance_lt=(point, D(m=radius)))
        return allegations

    def get(self, request):
        allegations = self.get_allegations()

        try:
            start = int(request.GET.get('start', 0))
        except ValueError:
            start = 0

        length = getattr(settings, 'ALLEGATION_LIST_ITEM_COUNT', 200)
        try:
            length = int(request.GET.get('length', length))
        except ValueError:
            pass

        allegations = allegations.select_related('officer','cat')

        display_allegations = allegations[start:start + length]
        allegations_list = []
        for allegation in display_allegations:
            officer = None
            category = None
            if allegation.officer_id:
                officer = allegation.officer
            if allegation.cat:
                category = allegation.cat
            witness = ComplainingWitness.objects.filter(crid=allegation.crid)
            police_witness = PoliceWitness.objects.filter(crid=allegation.crid)
            ret = {
                        'allegation': allegation, 'officer': officer, 'category': category,
                        'complaining_witness': witness, 'police_witness': police_witness
            }
            allegations_list.append(ret)

        content = JSONSerializer().serialize({
            'allegations': allegations_list,
            'iTotalRecords': Allegation.objects.all().count(),
            'iTotalDisplayRecords': allegations.count()
        })
        return HttpResponse(content)


class AllegationGISApiView(AllegationAPIView):
    def get(self, request):

        allegations = self.get_allegations()
        allegation_dict = {
            "type": "FeatureCollection",
            "features": [],
        }
        for allegation in allegations:
            point = None
            if allegation.point:
                point = json.loads(allegation.point.geojson)

            allegation_json = {
                "type": "Feature",
                "properties": {
                  "name":allegation.crid,
                },
                'geometry': point
            }
            if allegation.cat:
                allegation_json['properties']['type'] = allegation.cat.allegation_name,
            allegation_dict['features'].append(allegation_json)

        content = json.dumps(allegation_dict)
        return HttpResponse(content)


class AllegationSummaryApiView(AllegationAPIView):
    def get(self, request):
        allegations = self.get_allegations()

        count_query = allegations.values_list('cat').annotate(dcount=Count('id'))
        count_by_category = dict(count_query)

        discipline_allegations = allegations.exclude(final_outcome=600)
        discipline_count_query = discipline_allegations.values_list('cat').annotate(dcount=Count('id'))
        discipline_count_by_category = dict(discipline_count_query)
        categories = AllegationCategory.objects.filter(cat_id__in=allegations.values('cat')).order_by('category')

        summary = []
        summary_map_by_name = {}

        for category in categories:
            if category.category in summary_map_by_name:
                summary_value = summary_map_by_name[category.category]
            else:
                summary_value = summary_map_by_name[category.category] = {
                    'name': category.category,
                    'total': 0,
                    'count': 0,
                    'subcategories': []
                }
                summary.append(summary_value)

            count = count_by_category.get(category.cat_id, 0)
            summary_value['total'] += count
            summary_value['count'] += discipline_count_by_category.get(category.cat_id, 0)
            summary_value['subcategories'].append({
                'name': category.allegation_name,
                'cat_id': category.cat_id,
                'count': count
            })

        summary = sorted(summary, key=lambda x: -x['total'])

        maximum = summary[0]['total']
        for value in summary:
            value['percentToMax'] = value['total'] * 100.0 / maximum

        content = JSONSerializer().serialize({
            'summary': summary
        })
        return HttpResponse(content, content_type="application/json")


class OfficerListAPIView(AllegationAPIView):
    def get(self, request):
        allegations = self.get_allegations()
        officers = allegations.values_list('officer', flat=True).distinct()
        officers = Officer.objects.filter(pk__in=officers).order_by('-allegations_count')

        if 'allegations_count_start' in request.GET:
            officers = officers.filter(allegations_count__gt=int(request.GET['allegations_count_start']))
        if 'allegations_count_end' in request.GET:
            officers = officers.filter(allegations_count__lte=int(request.GET['allegations_count_end']))

        officer_list_length = officers.count()

        num_to_send = settings.OFFICER_LIST_SEND_LENGTH
        if officer_list_length > num_to_send:
            officers = officers[0:num_to_send]

        content = JSONSerializer().serialize({
            'officers': officers
        })
        return HttpResponse(content, content_type="application/json")
