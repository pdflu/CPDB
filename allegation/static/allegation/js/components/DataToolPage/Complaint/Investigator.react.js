var React = require('react');
var pluralize = require('pluralize');
var Link = require('react-router').Link;

var OfficerMixin = require("components/DataToolPage/Officer/OfficerMixin.react");
var StringUtil = require('utils/StringUtil');


var Investigator = React.createClass({
  mixins: [OfficerMixin],
  render: function () {
    var investigator = this.props.complaint.investigator;
    var more = '';

    var progressStyle = {
      width: '100%'
    };
    var percent = (investigator.discipline_count / investigator.complaint_count) * 100;
    var style = {
      width: percent + '%'
    };

    if (investigator.complaint_count > 1) {
      var description = (
        <div>{investigator.complaint_count} {pluralize('case', investigator.complaint_count)}</div>
      );
      if (investigator.discipline_count) {
        description = (
          <div>
            <strong className="red">
              {investigator.discipline_count} disciplined
            </strong>
            &nbsp;out of {investigator.complaint_count} {pluralize('case', investigator.complaint_count)}
          </div>
        );
      }
      more = (
        <div>
          {description}
          <div className="progress complaint" style={progressStyle}>
            <div className="progress-bar discipline" role="progressbar" aria-valuenow="60" aria-valuemin="0"
                 aria-valuemax="100" style={style}>
              <span className="sr-only"></span>
            </div>
          </div>
        </div>
      );
    }

    return (
      <Link to={this.investigatorLink(investigator)}>
        <div className='investigation'>
          <div className='row-fluid'>
            <div>
              <div className='results'>
                <div className='investigator-name'>
                  {investigator.name}
                </div>
                {more}
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  },

  investigatorLink: function (investigator) {
    return '/investigator/' + StringUtil.slugify(investigator.name) + '/' + investigator.id;
  }
});

module.exports = Investigator;
