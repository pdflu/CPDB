var React = require('react');
var _ = require('lodash');
var Base = require('../Base.react');
var DocumentCrawlStatActions = require('actions/DocumentSection/DocumentCrawlStatActions');
var DocumentCrawlStatStore = require('stores/DocumentSection/DocumentCrawlStatStore');

var DocumentCrawlStats = React.createClass(_.assign(Base(DocumentCrawlStatStore), {
  getInitialState: function () {
    return DocumentCrawlStatStore.getState();
  },

  componentDidMount: function () {
    DocumentCrawlStatActions.getCrawlStats();
    DocumentCrawlStatStore.addChangeListener(this._onChange);
  },

  renderCrawlStats: function () {
    var rows = [];
    var numRows = this.state.crawlStats.docs.length < 10 ? this.state.crawlStats.docs.length : 10;
    var i;
    for (i = 1; i < numRows; i++) {
      rows.push(
        <div key={ i } className='row'>
          <div className='col-md-12 margin-top'>
            <i className='fa fa-calendar'></i> { this.state.crawlStats.docs[i].timestamp }
            <span className='pull-right'>
              <i className='fa fa-file-text-o'></i> { this.state.crawlStats.docs[i].num_documents }</span>
          </div>
        </div>
      );
    }
    return rows;
  },

  render: function () {
    var lastSuccessfulCrawlDate = <i className='fa fa-spin fa-spinner'></i>;


    var crawlStats = <div></div>;
    var chevronClass = 'fa fa-chevron-down';
    var mostRecent;
    if (this.state.showCrawlStats) {
      crawlStats = this.renderCrawlStats();
      chevronClass = 'fa fa-chevron-up';
    }

    if (this.state.crawlStats && this.state.crawlStats.docs.length > 0) {
      mostRecent = this.state.crawlStats.docs[0];
      lastSuccessfulCrawlDate = (
        <span>
          had <strong> <i className='fa fa-file-text-o'></i> { mostRecent.num_documents } </strong>
          and ran on <strong>{ mostRecent.timestamp }</strong>.
          <span className='pull-right'>

            <button className='pull-right' onClick={ this._toggleCrawlStats }>
              <i className={ chevronClass }></i></button>
          </span>
        </span>
      );

    }

    return (
      <div className='container-fluid'>
        <div className='row margin-top'>
          <div className='col-md-6 col-md-offset-3 alert alert-info last-successful-crawl-date'>
            <span className='fa-stack fa-lg'>
              <i className='fa fa-circle fa-stack-2x'></i>
              <i className='fa fa-info fa-stack-1x fa-inverse'></i>
            </span>
            Last successful crawl { lastSuccessfulCrawlDate }
            { crawlStats }
          </div>
        </div>


      </div>
    );
  },

  _toggleCrawlStats: function () {
    DocumentCrawlStatActions.toggleCrawlStats();
  },

  _onChange: function () {
    this.setState(DocumentCrawlStatStore.getState());
  }
}));

module.exports = DocumentCrawlStats;
