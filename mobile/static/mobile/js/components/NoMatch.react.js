var React = require('react');

var MainPage = require('components/MainPage.react');


var NoMatch = React.createClass({
  render: function () {
    return (
      <MainPage showError={true}>

      </MainPage>
    )
  }
});

module.exports = NoMatch;
