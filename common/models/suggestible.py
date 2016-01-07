from django.template.defaultfilters import slugify


class MobileSuggestible(object):
    def get_mobile_url(self):
        raise NotImplementedError

    def as_suggestion_entry(self, suggestion_type=''):
        raise NotImplementedError


class MobileSuggestibleOfficer(MobileSuggestible):
    def get_mobile_url(self):
        slugified_display_name = slugify(self.display_name)
        return '/officer/{display_name}/{id}'.format(display_name=slugified_display_name,
                                                     id=self.id)

    def as_suggestion_entry(self, suggestion_type=''):
        return {
            'text': self.display_name,
            'resource': 'officer',
            'url': self.get_mobile_url(),
            'resource_key': self.pk,
            'meta': {
                'allegations_count': self.allegations_count,
                'gender': self.gender,
                'race': self.race,
                'star': self.star
             }
        }


class MobileSuggestibleAllegation(MobileSuggestible):
    def get_mobile_url(self):
        return '/complaint/{crid}'.format(crid=self.crid)

    def as_suggestion_entry(self, suggestion_type=''):
        return {
            'text': self.crid,
            'resource': 'allegation',
            'url': self.get_mobile_url(),
            'resource_key': self.crid,
            'meta': {
                'incident_date': self.incident_date,
                'cat': {
                    'allegation_name': self.cat.allegation_name,
                    'category': self.cat.category
                }
            }
        }
