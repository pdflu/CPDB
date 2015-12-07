from django.contrib.gis.db.models import GeoManager

from allegation.models.allegation_query_set import AllegationQuerySet


class AllegationManager(GeoManager):
    def get_queryset(self):
        return AllegationQuerySet(self.model, using=self._db)

    def by_officer_names(self, officer_names=[]):
        return self.get_queryset().by_officer_names(officer_names)

    def by_latlng(self, latlng=[], radius=500):
        return self.get_queryset().by_latlng(latlng, radius)

    def by_allegation_filter(self, allegation_query_filter):
        return self.get_queryset().by_allegation_filter(allegation_query_filter)
