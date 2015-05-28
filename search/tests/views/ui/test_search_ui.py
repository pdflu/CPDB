from allegation.factories import OfficerFactory
from common.tests.core import BaseLiveTestCase


class SearchUITestCase(BaseLiveTestCase):
    def test_search_box_displayed_on_home_page(self):
        self.visit('/')
        self.until(lambda: self.find_all('#cpdb-search'))
        len(self.find_all('#cpdb-search')).should.equal(1)

    def test_display_suggestions_upon_typing(self):
        officer = OfficerFactory(officer_first='Jerry')

        self.visit('/')
        self.until(lambda: self.find('.ui-autocomplete-input').send_keys('je'))

        self.until(lambda: self.should_see_text(officer.officer_first))
