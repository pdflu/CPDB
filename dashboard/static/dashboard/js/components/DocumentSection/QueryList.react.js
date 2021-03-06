var _ = require('lodash');
var React = require('react');
var PropTypes = React.PropTypes;


var QueryList = React.createClass({
  propTypes: {
    document: PropTypes.object
  },

  buildQuery: function (query) {
    var result = _.map(query, function (values) {
      return _.pluck(values, 'displayValue');
    });
    return _.flatten(result);
  },

  renderQueryList: function () {
    // if (!this.props.document.queries) {
    //   return;
    // }
    var that = this;
    return _.map(this.props.document.queries, function (query, index) {
      return (
        <tr key={ index }>
          <td>{ index + 1 }</td>
          <td>{ query.email }</td>
          <td className='session-query'>{ that.buildQuery(query.query) }</td>
        </tr>
      );
    });
  },

  render: function () {
    var document = this.props.document;
    if (!document.requested && (!document.queries || !document.queries.length)) {
      return (
        <div>
          This allegation has no data as the the moment.
        </div>
      );
    }

    return (
      <div className='table-responsive query-list'>
        <table className='table table-striped table-hover'>
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Search Queries</th>
            </tr>
          </thead>
          <tbody>
            { this.renderQueryList() }
          </tbody>
        </table>
      </div>
    );
  }

});

module.exports = QueryList;
