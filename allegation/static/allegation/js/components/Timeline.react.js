var React = require('react');
var MapStore = require("../stores/MapStore");


var Timeline = React.createClass({
  getInitialState: function () {
    return {}
  },
  componentDidMount: function () {
    var officer = this.props.officer;
    var container = this.getDOMNode();

    $.getJSON('/officer/timeline/', {'officer': officer.id}, function (data) {
      var timeLineItems = [];

      var items = data.items;
      for (var i = 0; i < items.length; i++) {
        if (!items[i]) {
          continue;
        }
        var style = 'display: none';
        var start = moment(items[i]);
        if(start == "Invalid date"){
          continue
        }

        var content = '';
        if (i == 0) {
          style = '';
          content = 'Joined force<br /><span>' + start.format('MMM DD, YYYY'); + '</span>';
        }

        var timeLineItem = {
          id: i + 1,
          content: "",
          start: start,
          style: style
        };
        if (i == 0) {
          timeLineItem.style = '';
          timeLineItem.content = 'Joined force<br /><span>' + start.format('MMM DD, YYYY') + '</span>';
          timeLineItems.push(timeLineItem);
          if(i + 1 <= items.length) {
            var rangeItem = {
              id: "range" - (i + 1),
              content: "Data missing for this timeframe",
              start: start,
              end: moment(items[i + 1]),
              type: 'background',
              style: 'background: #e5e5e5; color: #989898'
            };
            timeLineItems.push(rangeItem);
          }

        }
        else {
          timeLineItems.push(timeLineItem);
        }
      }

      if (!timeLineItems.length) {
        return;
      }
      timeLineItems = new vis.DataSet(timeLineItems);

      // Configuration for the Timeline
      var options = {'moveable': false, 'zoomable': false, height: '260px'};

      new vis.Timeline(container, timeLineItems, options);
    });
  },
  render: function () {
    return <div></div>
  }

});


module.exports = Timeline;
