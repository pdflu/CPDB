var $ = require('jquery');
var React = require('react');
var PureRenderMixin = require('react-addons-pure-render-mixin');

var PropTypes = React.PropTypes;

var DOMUtils = require('utils/DOMUtils');
var FilterTagStore = require('stores/FilterTagStore');
var ShareButtonStore = require('stores/DataToolPage/ShareButtonStore');
var SiteTitleActions = require('actions/SiteTitleActions');
var SiteTitleStore = require('stores/SiteTitleStore');
var SessionStore = require('stores/SessionStore');

var DEFAULT_TITLE_FONT = '21px Arial, Helvetica, sans-serif';


var SiteTitle = React.createClass({
  propTypes: {
    changable: PropTypes.bool
  },

  mixins: [PureRenderMixin],

  getDefaultProps: function () {
    return {
      changable: true
    };
  },

  getInitialState: function () {
    return {
      showDottedUnderline: false,
      siteTitle: SessionStore.getSiteTitle()
    };
  },


  componentDidMount: function () {
    document.title = this.state.siteTitle;
    SiteTitleStore.addChangeListener(this._onSiteTitleChange);
    ShareButtonStore.addChangeListener(this._onShareBarOrFilterTagChanged);
    FilterTagStore.addChangeListener(this._onShareBarOrFilterTagChanged);
  },

  componentDidUpdate: function () {
    document.title = this.state.siteTitle;
  },

  componentWillUnmount: function () {
    SiteTitleStore.removeChangeListener(this._onSiteTitleChange);
    ShareButtonStore.removeChangeListener(this._onShareBarOrFilterTagChanged);
    FilterTagStore.removeChangeListener(this._onShareBarOrFilterTagChanged);
  },

  _onSiteTitleChange: function () {
    this.setState({
      siteTitle: SiteTitleStore.getSiteTitle()
    });
  },

  renderDottedUnderline: function () {
    var underLineWidth, style, inputStyle;

    if (this.state.showDottedUnderline) {
      inputStyle = window.getComputedStyle(this.refs.siteTitle);
      underLineWidth = DOMUtils.getTextWidth(this.state.siteTitle, inputStyle.font);

      style = {
        width: underLineWidth,
        maxWidth: inputStyle.width
      };

      return (
        <div className='after-title-input' style={ style }/>
      );
    }

    return null;
  },

  _onShareBarOrFilterTagChanged: function () {
    this.setState({
      showDottedUnderline: ShareButtonStore.isActive() && !FilterTagStore.isNoFilter()
    });
  },

  _onTitleChange: function (e) {
    var newTitle = $(e.target).val();
    SiteTitleActions.changeSiteTitle(newTitle);
  },

  render: function () {
    var disabled = !this.props.changable;
    var inputWidth = DOMUtils.getTextWidth(this.state.siteTitle, DEFAULT_TITLE_FONT);

    // Should use Sanfrancisco font but it's load asynchronous we must choose a browser font
    // to avoid weird style on input box
    var siteTitleStyle = {
      width: inputWidth / 1.05,
      maxWidth: '100%'
    };

    return (
      <div className='site-title pull-left'>
        <input ref='siteTitle' className='site-title-input'
          type='text' value={ this.state.siteTitle }
          disabled={ disabled } onChange={ this._onTitleChange }
          style={ siteTitleStyle }/>
        { this.renderDottedUnderline() }
      </div>
    );
  }
});

module.exports = SiteTitle;
