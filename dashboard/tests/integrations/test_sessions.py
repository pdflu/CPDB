from common.tests.core import BaseLiveTestCase
from search.factories import SuggestionLogFactory, FilterLogFactory
from share.factories import SessionFactory
from share.models import Session


class SessionManagementTestCase(BaseLiveTestCase):
    def setUp(self):
        self.login_user()
        self.visit('/admin/')

    def tearDown(self):
        Session.objects.all().delete()
        super(SessionManagementTestCase, self).tearDown()

    def go_to_sessions(self):
        self.element_by_tagname_and_text('span', 'Sessions').click()

    def test_see_sessions_management_section(self):
        session = SessionFactory()

        self.should_see_text('Sessions')
        self.go_to_sessions()
        self.find("#sessions").should.be.ok

        self.number_of_sessions().shouldnt.equal(0)
        self.should_see_text(session.hash_id)

    def test_search_in_sessions_management_section(self):
        query = 'should'
        uppercase_query = 'SHOULD'
        match_title = 'should_match'
        non_match_title = 'no_match'

        SessionFactory(title=match_title)
        SessionFactory(title=non_match_title)

        self.go_to_sessions()
        self.number_of_sessions().should.equal(2)

        self.search_for_session_with_title(query)
        self.until_ajax_complete()
        self.number_of_sessions().should.equal(1)
        self.should_see_text(match_title)

        self.search_for_session_with_title(uppercase_query)
        self.until_ajax_complete()
        self.number_of_sessions().should.equal(1)
        self.should_see_text(match_title)


    def test_see_history_of_session(self):
        category = 'category'
        session = SessionFactory()
        suggestion = SuggestionLogFactory(session_id=session.hash_id)
        filter_log = FilterLogFactory(session_id=session.hash_id, tag_name='cat__category=category')

        self.go_to_sessions()
        self.find('tr.session-row').click()

        self.should_see_text(suggestion.search_query)
        self.should_see_text(category)

    def number_of_sessions(self):
        return len(self.find_all("#sessions .session-row"))

    def search_for_session_with_title(self, query):
        search_input = self.find('#search input')
        search_input.clear()
        search_input.send_keys(query)