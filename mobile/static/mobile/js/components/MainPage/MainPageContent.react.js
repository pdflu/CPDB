var cx = require('classnames');
var React = require('react');

var SearchBar = require('components/MainPage/SearchComponent/SearchBar.react');
var SearchResults = require('components/MainPage/SearchResults.react');
var ProjectSummary = require('components/MainPage/SearchComponent/ProjectSummary.react');


var MainPageContent = React.createClass({
  render: function () {
    var topLeft = this.props.topLeft;
    var searchBarWrapperClassName = cx('search-wrapper animation', {'top-left': topLeft});
    var projectSummaryClassNames = cx('search-component', {'top-left': topLeft});

    return (
      <div className={projectSummaryClassNames}>
        <ProjectSummary topLeft={topLeft} />
        <div className={searchBarWrapperClassName}>
          <SearchBar />
        </div>
        <SearchResults />
      </div>
    );
  }
});

module.exports = MainPageContent;
