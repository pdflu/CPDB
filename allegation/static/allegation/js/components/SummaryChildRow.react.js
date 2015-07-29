var HOST = 'http://localhost:8000';
var React = require('react');
var Filters = require('./Filters.react');
var MapStore = require('../stores/MapStore');
var SummaryActions = require('../actions/SummaryActions');
var FilterStore = require('../stores/FilterStore');

function getChildRowState() {
  return {
    selected: false
  };
}

var SummaryChildRow = React.createClass({
  getInitialState: function () {
    return getChildRowState();
  },
  onClick: function (e) {
    e.preventDefault();

    FilterStore.tagsInputRemoveItemObject(this.props.category.tagValue);
    var tagValue = this.props.subcategory.tagValue;

    if (this.state.selected) {
      FilterStore.tagsInputRemoveItemObject(tagValue);
    } else {
      $('#cpdb-search').tagsinput("add", tagValue);
    }

    this.state.selected = !this.state.selected;
  },
  render: function () {
    var className = "category-name";
    var filters = FilterStore.getAll();
    if ('cat' in filters && filters['cat'].value.indexOf(this.props.subcategory.cat_id) > -1) {
      className += " active";
    }
    if ('cat__category' in filters && filters['cat__category'].value.indexOf(this.props.category.name) > -1) {
      className += " active";
    }

    return (
      <div className="row summary-child-row">
        <div className="col-md-2 count">
          {this.props.subcategory.count}
        </div>
        <div className="col-md-10 category-name-wrapper">
          <a href="#" className={className} onClick={this.onClick}>{this.props.subcategory.name}</a>
        </div>
      </div>
    );
  }
});

module.exports = SummaryChildRow;
