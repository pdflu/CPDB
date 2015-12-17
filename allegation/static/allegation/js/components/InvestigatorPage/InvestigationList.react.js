var React = require('react');

var InvestigationListRow = require('components/InvestigatorPage/InvestigationListRow.react');


var InvestigationList = React.createClass({
  renderInvestigations: function () {
    var rows = [];

    for (var i = 0; i < this.props.complaints.length; i++) {
      var complaint = this.props.complaints[i];
      var allegation = complaint.allegation;

      rows.push(<InvestigationListRow key={i} complaint={complaint} finding={allegation.final_finding}/>)
    }

    return rows;
  },

  render: function () {
    var officer = this.props.officer;

    return (
      <div>
        {this.renderInvestigations()}
      </div>
    )
  }
});

module.exports = InvestigationList;
