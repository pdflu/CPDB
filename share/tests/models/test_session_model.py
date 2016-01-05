from allegation.factories import InvestigatorFactory, AreaFactory
from common.tests.core import SimpleTestCase
from share.factories import SessionFactory


class SessionModelTestCase(SimpleTestCase):
    def setUp(self):
        self.session = SessionFactory()

    def test_readable_query(self):
        area = AreaFactory()
        investigator = InvestigatorFactory()
        self.session.query = {
            'filters': {
                'allegation__investigator': {
                    'value': [investigator.id],
                },
                'allegation__areas__id': {
                    'value': [area.id],
                },
                'officer__allegations_count__gt': {
                    'value': [10],
                },
            },
        }

        self.session.readable_query.should.equal({
            'allegation__investigator': [{
                'text': investigator.name,
                'value': investigator.id,
            }],
            'allegation__areas__id': [{
                'text': "%s: %s" % (area.type, area.name),
                'value': area.id
            }],
            'officer__allegations_count__gt': [{
                'text': 'Repeater (10+ complaints)',
                'value': 10,
            }],
        })
