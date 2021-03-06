var React = require('react');
var PropTypes = React.PropTypes;

var ComplaintListRow = require('components/DataToolPage/ComplaintListRow.react');


var ComplaintList = React.createClass({
  propTypes: {
    complaints: PropTypes.array,
    officer: PropTypes.object
  },

  renderComplaints: function (officer) {
    var rows,
      i,
      complaint;

    if (!this.props.complaints.length) {
      return (<div className='no-complaints'>No allegations match the query.</div>);
    }
    rows = [];

    for (i = 0; i < this.props.complaints.length; i++) {
      complaint = this.props.complaints[i];

      rows.push(
        <ComplaintListRow key={ i } complaint={ complaint } officer={ officer } />
      );
    }

    return rows;
  },

  render: function () {
    var officer = this.props.officer;

    return (
      <div>
        { this.renderComplaints(officer) }
      </div>
    );
  }
});

module.exports = ComplaintList;
