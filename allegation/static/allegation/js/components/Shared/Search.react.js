var classnames = require('classnames');
var React = require('react');
var PropTypes = React.PropTypes;

var AppConstants = require('constants/AppConstants');
var FilterTagsActions = require('actions/FilterTagsActions');
var NavActions = require('actions/NavActions');
var SessionAPI = require('utils/SessionAPI');


var Search = React.createClass({
  propTypes: {
    mobileExpanded: PropTypes.bool
  },

  componentDidMount: function () {
    this.initAutocomplete();
  },

  onSearchClick: function () {
    if (!this.props.mobileExpanded) {
      NavActions.mobileSearchClick();
    } else {
      NavActions.mobileSearchCollapse();
    }
  },

  onKeyPress: function (event) {
    var keyCode = (event.keyCode ? event.keyCode : event.which);

    if (keyCode == 13) { // Enter key code
      event.preventDefault();
      event.stopPropagation();
    }
  },

  initAutocomplete: function () {
    $('#autocomplete').catcomplete({
      autoFocus: true,
      source: function (request, response) {
        var that = this;
        this.displayMessage('Searching...');

        $.ajax({
          url: '/search/suggest/',
          dataType: 'json',
          data: {
            term: request.term
          },
          success: function (data) {
            var newData = [];
            $.each(data, function (i, subdata) {
              newData = newData.concat(subdata);
            });
            if (newData.length > 0) {
              response(newData);
            } else {
              that.displayMessage('No matches found');
            }
          }
        });
      },
      appendTo: '#autocomplete-container',
      select: this.select,
      focus: function (event) {
        event.preventDefault();
      },
      categoryNames: AppConstants.AUTOCOMPLETE_CATEGORY_NAMES,
      categoriesDisplayInTag: AppConstants.AUTOCOMPLETE_DISPLAY_CATEGORY_IN_TAG
    });
  },

  select: function (event, ui) {
    event.preventDefault();

    if (ui.item.tagValue.category == 'session') {
      SessionAPI.getSessionInfo(ui.item.tagValue.displayValue);
    } else {
      FilterTagsActions.addTag(ui.item.tagValue);
      $('#autocomplete').val('');
    }
  },

  render: function () {
    var searchIconClass = classnames(
      {
        'glyphicon glyphicon-search': !this.props.mobileExpanded,
        'glyphicon glyphicon-remove': this.props.mobileExpanded
      }
    );

    return (
      <div className='row search-row'>
        <div className='col-md-12'>
          <form role='search'>
            <div className='input-group'>
              <input type='text' id='autocomplete'
                placeholder='Search by a name/place/category, or click inside the graphs below'
                className='ui-autocomplete-input form-control' autoComplete='off' onKeyPress={ this.onKeyPress } />
              <span className='input-group-btn'>
                <button className='btn btn-primary' id='btn-search' type='button'
                  onClick={ this.onSearchClick }>
                  <i className={ searchIconClass }></i>
                </button>
              </span>
            </div>
          </form>
        </div>
      </div>
    );
  }
});

module.exports = Search;
