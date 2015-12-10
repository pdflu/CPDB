var React = require('react');

var HelperUtil = require('utils/HelperUtil');


var InvestigatorSection = React.createClass({
  renderInvestigator: function (investigator) {
    return (
      <div className='investigator-card pad'>
        <div className='row'>
          <div className='one column circle-wrapper center'>
            <div className='small-circle background-black circle'></div>
          </div>
          <div className='eleven columns'>
            <div className='investigator'>
              <div className='name bold'>{investigator['name']}</div>
              <div className='rank'>{investigator['current_rank']}</div>
            </div>
          </div>
        </div>
      </div>
    )
  },

  render: function () {
    var investigator = HelperUtil.fetch(this.props.info, 'investigator', false);

    if (!investigator) {
      return (
        <div></div>
      )
    }
    return (
      <div className='investigator-section'>
        <div className='row section-header'>
          <span className='section-title bold pad'>Investigator</span>
        </div>
        {this.renderInvestigator(investigator)}
      </div>
    )
  }
});

module.exports = InvestigatorSection;
