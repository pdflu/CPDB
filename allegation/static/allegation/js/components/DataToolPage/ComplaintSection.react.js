var React = require('react');
require('utils/jQuery');
var classnames = require('classnames');

var Filters = require('components/DataToolPage/Filters.react');
var ComplaintList = require('components/DataToolPage/ComplaintList.react');
var Download = require('components/DataToolPage/Download.react');
var Counter = require('components/DataToolPage/Counter.react');
var OutcomeFilter = require('components/DataToolPage/ComplaintList/OutcomeFilter.react');
var RequestModal = require('components/DataToolPage/Complaint/RequestModal.react');
var Content = require('components/DataToolPage/ComplaintList/Content.react');
var ComplaintListStore = require('stores/ComplaintListStore');
var OfficerListStore = require('stores/OfficerListStore');
var ComplaintListActions = require('actions/ComplaintList/ComplaintListActions');


var ComplaintSection = React.createClass({
  getInitialState: function () {
    return ComplaintListStore.getState();
  },

  componentDidMount: function () {
    ComplaintListStore.addChangeListener(this._onChange);
    jQuery(window).on('scroll', this._onScroll);
  },

  componentWillUnmount: function () {
    ComplaintListStore.removeChangeListener(this._onChange);
    jQuery(window).off('scroll', this._onScroll);
  },

  rowGetter: function (rowIndex) {
    return rows[rowIndex];
  },

  render: function () {
    var activeFilter = this.state.activeFilter;
    var analytics = this.state.analytics;
    var loading = this.state.loading;

    var className = classnames('complaint_list', {
      'hidden': this.state.noQuery
    });

    return (
      <div className={className} onScroll={this.onScroll}>
        <div className='row'>
          <div className='col-md-2 complaint-count'>
            <h3 className="margin-top-0">Complaints (<Counter to={analytics.All} />)</h3>
          </div>
          <div className='col-md-10 text-right'>
            <OutcomeFilter loading={loading} activeFilter={activeFilter} analytics={analytics}/>
          </div>
        </div>
        <Content loading={loading} officer={this.props.officer} complaints={this.state.complaints} />
      </div>
    )
  },

  _onChange: function () {
    this.setState(ComplaintListStore.getState());
  },

  _onScroll: function () {
    if (jQuery(window).scrollTop() / jQuery(document).height() > .35 && !this.state.scrollLock) {
      ComplaintListActions.getMoreData(this.state.pageNumber);
      ComplaintListStore.lockScroll();
    }
  },
});

module.exports = ComplaintSection;
