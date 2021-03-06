var React = require('react');

var OfficerResult = require('components/Shared/SearchablePage/SearchResults/SuccessfulSearch/OfficerResult.react');
var ComplaintResult = require('components/Shared/SearchablePage/SearchResults/SuccessfulSearch/ComplaintResult.react');

var SuggestionPresenter = require('presenters/SuggestionPresenter');


var SuccessfulSearch = React.createClass({
  propTypes: {
    term: React.PropTypes.string,
    suggestions: React.PropTypes.array
  },

  getSubComponentFor: function (type) {
    var subComponentMapper = {
      'officer': OfficerResult,
      'officer_allegation': ComplaintResult
    };

    return subComponentMapper[type];
  },

  renderSuggestionItem: function () {
    var suggestions = this.props.suggestions;
    var suggestionType = SuggestionPresenter(suggestions[0]).resource;
    var term = this.props.term;
    var SubComponent = this.getSubComponentFor(suggestionType);

    return (
      <SubComponent term={ term } suggestions={ suggestions }/>
    );
  },

  render: function () {
    return (
      <div className='success-search'>
        { this.renderSuggestionItem() }
      </div>
    );
  }
});

module.exports = SuccessfulSearch;
