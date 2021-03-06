var React = require('react');

var DataTypeUtil = require('utils/DataTypeUtil');


var FailedSearch = React.createClass({
  propTypes: {
    term: React.PropTypes.string
  },

  render: function () {
    var term = this.props.term || '';
    var textMessage = 'No matches yet.';

    if (!DataTypeUtil.isValidCridQueryFormat(term) && !DataTypeUtil.isNumeric(term)) {
      textMessage = 'Sorry, there\'s no results for your search in the database.';
    }

    return (
      <div className='failed-search pad'>{ textMessage }</div>
    );
  }
});

module.exports = FailedSearch;
