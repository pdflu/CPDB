var React = require('react');

var RelatedOfficerItem = require('components/OfficerPage/RelatedOfficersTab/RelatedOfficerItem.react');
var NoRelatedOfficer = require('components/OfficerPage/RelatedOfficersTab/NoRelatedOfficer.react');


var RelatedOfficersTab = React.createClass({
  renderRelatedOfficers: function (type) {
    return function (officer) {
      return (
        <RelatedOfficerItem type={type} officer={officer} />
      );
    };
  },

  render: function () {
    var coAccused = this.props.coAccused;

    if (!coAccused) {
      return (<div></div>);
    }

    var numberOfRelatedOfficers = coAccused.length;

    if (numberOfRelatedOfficers == 0) {
      return (
        <div>
          <NoRelatedOfficer />
        </div>
      )
    }

    return (
      <div className='related-officers-tab'>
        <div className='co-accused-list'>
          {coAccused.map(this.renderRelatedOfficers('Co-accused'))}
        </div>
      </div>
    );
  }
});

module.exports = RelatedOfficersTab;
