from common.models import Allegation
from django.core.management.base import BaseCommand
from django.db.models.query_utils import Q


class Command(BaseCommand):

    def handle(self, *args, **options):
        q = Q(Q(beat=None) | Q(point=None))
        counter = {
            'fail': 0,
            'success': 0
        }
        for allegation in Allegation.objects.all().exclude(q):
            if not allegation.beat.polygon.contains(allegation.point):
                distance = allegation.beat.polygon.distance(allegation.point) * 100
                if distance > 100:
                    print("{crid}'s point is not within its beat {beat} and {distance}m away".format(
                        crid=allegation.crid,
                        beat=allegation.beat.name,
                        distance=distance
                    ))
                    counter['fail'] += 1
            else:
                counter['success'] += 1
        print(counter)